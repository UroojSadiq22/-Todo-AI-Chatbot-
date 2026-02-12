"""Chat API endpoint for conversational task management with OpenAI Agents SDK."""

import logging
import os
import httpx
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List, Dict, Any, Optional
from openai import OpenAI

from ..auth.middleware import get_current_user_id
from ..database.session import get_async_session
from ..services.conversation_service import ConversationService
from ..models.message import Message

import os
from groq import Groq


# Set up logging
logger = logging.getLogger(__name__)

# Initialize router
router = APIRouter()

# Initialize OpenAI client

client = Groq(api_key=os.getenv("GROQ_API_KEY", "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"))




# MCP Server configuration
MCP_SERVER_URL = os.getenv("MCP_SERVER_URL", "http://localhost:5000")


# Utility functions for input sanitization
def sanitize_user_input(text: str) -> str:
    """
    Sanitize user input to prevent injection attacks.

    Args:
        text: Raw user input

    Returns:
        Sanitized text
    """
    if not text:
        return ""

    # Remove null bytes and control characters (except newlines and tabs)
    sanitized = "".join(char for char in text if char == "\n" or char == "\t" or (ord(char) >= 32 and ord(char) != 127))

    # Trim excessive whitespace
    sanitized = " ".join(sanitized.split())

    # Limit length to prevent overflow attacks
    max_length = 5000
    if len(sanitized) > max_length:
        sanitized = sanitized[:max_length]

    return sanitized


# Request/Response models
class ChatRequest(BaseModel):
    """Request model for chat endpoint."""
    message: str
    conversation_id: Optional[str] = None


class ToolCall(BaseModel):
    """Model for MCP tool call information."""
    name: str
    arguments: Dict[str, Any]
    result: Optional[Dict[str, Any]] = None


class ChatResponse(BaseModel):
    """Response model for chat endpoint."""
    conversation_id: str
    response: str
    tool_calls: List[ToolCall]


# MCP Tool definitions for OpenAI
MCP_TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "add_task",
            "description": "Add a new task to the user's todo list",
            "parameters": {
                "type": "object",
                "properties": {
                    "user_id": {
                        "type": "string",
                        "description": "The ID of the user creating the task"
                    },
                    "title": {
                        "type": "string",
                        "description": "The title of the task"
                    },
                    "description": {
                        "type": "string",
                        "description": "Optional detailed description of the task"
                    }
                },
                "required": ["user_id", "title"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "list_tasks",
            "description": "List all tasks for a user, optionally filtered by status",
            "parameters": {
                "type": "object",
                "properties": {
                    "user_id": {
                        "type": "string",
                        "description": "The ID of the user"
                    },
                    "status": {
                        "type": "string",
                        "description": "Filter tasks by status (completed, pending, or all)",
                        "enum": ["completed", "pending", "all"]
                    }
                },
                "required": ["user_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "complete_task",
            "description": "Mark a task as completed",
            "parameters": {
                "type": "object",
                "properties": {
                    "user_id": {
                        "type": "string",
                        "description": "The ID of the user"
                    },
                    "task_id": {
                        "type": "string",
                        "description": "The ID of the task to complete"
                    }
                },
                "required": ["user_id", "task_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "update_task",
            "description": "Update a task's title or description",
            "parameters": {
                "type": "object",
                "properties": {
                    "user_id": {
                        "type": "string",
                        "description": "The ID of the user"
                    },
                    "task_id": {
                        "type": "string",
                        "description": "The ID of the task to update"
                    },
                    "title": {
                        "type": "string",
                        "description": "New title for the task"
                    },
                    "description": {
                        "type": "string",
                        "description": "New description for the task"
                    }
                },
                "required": ["user_id", "task_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "delete_task",
            "description": "Delete a task from the user's todo list",
            "parameters": {
                "type": "object",
                "properties": {
                    "user_id": {
                        "type": "string",
                        "description": "The ID of the user"
                    },
                    "task_id": {
                        "type": "string",
                        "description": "The ID of the task to delete"
                    }
                },
                "required": ["user_id", "task_id"]
            }
        }
    }
]


async def call_mcp_tool(tool_name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
    """
    Call an MCP tool endpoint and return the result.

    Args:
        tool_name: Name of the MCP tool to call
        arguments: Arguments to pass to the tool

    Returns:
        Result from the MCP tool
    """
    try:
        url = f"{MCP_SERVER_URL}/tools/{tool_name}"
        async with httpx.AsyncClient(timeout=30.0) as http_client:
            response = await http_client.post(url, json=arguments)
            response.raise_for_status()
            return response.json()
    except httpx.TimeoutException:
        logger.error(f"MCP tool {tool_name} timed out")
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail=f"MCP tool {tool_name} timed out"
        )
    except httpx.HTTPError as e:
        logger.error(f"MCP tool {tool_name} failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"MCP tool {tool_name} failed: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error calling MCP tool {tool_name}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error calling MCP tool: {str(e)}"
        )


def format_messages_for_openai(messages: List[Message]) -> List[Dict[str, str]]:
    """
    Format message objects for OpenAI API.

    Args:
        messages: List of Message objects from the database

    Returns:
        List of message dictionaries formatted for OpenAI
    """
    return [
        {
            "role": msg.role,
            "content": msg.content
        }
        for msg in messages
    ]


@router.post("/{user_id}/chat", response_model=ChatResponse)
async def chat_endpoint(
    user_id: str,
    chat_request: ChatRequest,
    current_user_id: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_async_session)
) -> ChatResponse:
    """
    Process a chat message through an AI agent with MCP tool access.

    This endpoint:
    1. Validates user authorization
    2. Fetches or creates conversation
    3. Loads conversation history
    4. Processes message through OpenAI Agent with MCP tools
    5. Saves both user and assistant messages
    6. Returns the AI response

    Args:
        user_id: User ID from URL path
        chat_request: Chat message request
        current_user_id: Authenticated user ID from JWT
        session: Database session

    Returns:
        ChatResponse with conversation_id, response text, and tool calls
    """
    # Validate user authorization
    if user_id != current_user_id:
        logger.warning(f"User {current_user_id} attempted to access conversation for {user_id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only access your own conversations"
        )

    logger.info(f"Processing chat message for user {user_id}")

    # Sanitize user input
    sanitized_message = sanitize_user_input(chat_request.message)

    # Validate sanitized message is not empty
    if not sanitized_message or sanitized_message.strip() == "":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message cannot be empty"
        )

    try:
        # Initialize conversation service
        conversation_service = ConversationService(session)

        # Get or create conversation
        conversation = await conversation_service.get_user_conversation(user_id)
        if not conversation:
            logger.info(f"Creating new conversation for user {user_id}")
            conversation = await conversation_service.create_conversation(user_id)

        conversation_id = conversation.id

        # Save user message (sanitized)
        user_message = await conversation_service.save_message(
            conversation_id=conversation_id,
            user_id=user_id,
            role="user",
            content=sanitized_message
        )
        logger.info(f"Saved user message {user_message.id} to conversation {conversation_id}")

        # Fetch conversation history (last 20 messages)
        history = await conversation_service.get_conversation_history(conversation_id, limit=20)

        # Format messages for OpenAI
        messages = format_messages_for_openai(history)

        # Add system message for context
        system_message = {
            "role": "system",
            "content": (
                "You are a helpful AI assistant for task management. "
                "You can help users create, view, update, complete, and delete tasks. "
                "When users ask you to perform task operations, use the available tools to interact with their todo list. "
                "Be conversational and helpful, and confirm actions after completing them."
            )
        }
        full_messages = [system_message] + messages

        # Call OpenAI with function calling
        logger.info(f"Calling OpenAI API for conversation {conversation_id}")
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=full_messages,
            tools=MCP_TOOLS,
            tool_choice="auto"
        )

        assistant_message = response.choices[0].message
        tool_calls_info: List[ToolCall] = []

        # Process tool calls if any
        if assistant_message.tool_calls:
            logger.info(f"Processing {len(assistant_message.tool_calls)} tool calls")

            for tool_call in assistant_message.tool_calls:
                tool_name = tool_call.function.name
                import json
                tool_arguments = json.loads(tool_call.function.arguments)

                if "user_id" in tool_arguments:
                    tool_arguments["user_id"] = user_id

                logger.info(f"Calling MCP tool: {tool_name} with arguments: {tool_arguments}")

                # Call the MCP tool
                tool_result = await call_mcp_tool(tool_name, tool_arguments)

                # Record tool call
                tool_calls_info.append(ToolCall(
                    name=tool_name,
                    arguments=tool_arguments,
                    result=tool_result
                ))

                logger.info(f"Tool {tool_name} completed with result: {tool_result}")

            # Get final response from OpenAI after tool calls
            # Add tool results to messages
            tool_messages = []
            for i, tool_call in enumerate(assistant_message.tool_calls):
                tool_messages.append({
                    "role": "assistant",
                    "content": None,
                    "tool_calls": [
                        {
                            "id": tool_call.id,
                            "type": "function",
                            "function": {
                                "name": tool_call.function.name,
                                "arguments": tool_call.function.arguments
                            }
                        }
                    ]
                })
                tool_messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "name": tool_call.function.name,
                    "content": json.dumps(tool_calls_info[i].result)
                })

            # Get final response
            final_response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=full_messages + tool_messages
            )

            final_content = final_response.choices[0].message.content or "Task completed successfully."
        else:
            final_content = assistant_message.content or "I'm here to help with your tasks."

        # Save assistant response
        assistant_msg = await conversation_service.save_message(
            conversation_id=conversation_id,
            user_id=user_id,
            role="assistant",
            content=final_content
        )
        logger.info(f"Saved assistant message {assistant_msg.id} to conversation {conversation_id}")

        # Return response
        return ChatResponse(
            conversation_id=conversation_id,
            response=final_content,
            tool_calls=tool_calls_info
        )

    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error processing chat message: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process chat message: {str(e)}"
        )

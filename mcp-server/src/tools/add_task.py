"""Add Task MCP Tool - Create new tasks for users."""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '../../..'))

from typing import Dict, Any
import logging
from sqlmodel import select

from backend.src.models.todo import Todo
from backend.src.models.user import User
from utils.db_utils import get_db_session
from utils.response_utils import success_response, error_response

logger = logging.getLogger(__name__)


async def add_task_tool(
    user_id: str,
    title: str,
    description: str = None
) -> Dict[str, Any]:
    """
    Create a new task for the user.

    This MCP tool validates the user exists, creates a task in the database,
    and returns a structured response with the task details.

    Args:
        user_id: The user's unique identifier (UUID)
        title: Task title (required, 1-200 characters)
        description: Task description (optional, max 1000 characters)

    Returns:
        Structured response dictionary:
        - Success: {"status": "success", "data": {...}, "message": "..."}
        - Error: {"status": "error", "data": {"error_code": ...}, "message": "..."}

    Security:
        - Validates user_id exists in database
        - Prevents SQL injection via parameterized queries
        - Returns sanitized task data only

    Example:
        >>> result = await add_task_tool("user-123", "Buy groceries", "Milk and eggs")
        >>> print(result)
        {
            "status": "success",
            "data": {
                "task_id": "uuid-here",
                "title": "Buy groceries",
                "created_at": "2026-02-08T10:30:00"
            },
            "message": "Task 'Buy groceries' created successfully"
        }
    """
    try:
        # Validate inputs
        if not title or len(title.strip()) == 0:
            return error_response("Title cannot be empty", 400)

        if len(title) > 200:
            return error_response("Title cannot exceed 200 characters", 400)

        if description and len(description) > 1000:
            return error_response("Description cannot exceed 1000 characters", 400)

        async with get_db_session() as session:
            # Validate user exists
            result = await session.execute(
                select(User).where(User.id == user_id)
            )
            user = result.scalar_one_or_none()

            if not user:
                logger.warning(f"User not found: {user_id}")
                return error_response(f"User {user_id} not found", 404)

            # Create new task
            new_task = Todo(
                user_id=user_id,
                title=title.strip(),
                description=description.strip() if description else None,
                completed=False
            )

            session.add(new_task)
            await session.commit()
            await session.refresh(new_task)

            logger.info(f"Task created: {new_task.id} for user {user_id}")

            return success_response(
                data={
                    "task_id": str(new_task.id),
                    "title": new_task.title,
                    "created_at": new_task.created_at.isoformat()
                },
                message=f"Task '{title}' created successfully"
            )

    except Exception as e:
        logger.error(f"Error creating task: {str(e)}", exc_info=True)
        return error_response(f"Failed to create task: {str(e)}", 500)

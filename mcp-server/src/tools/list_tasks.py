"""List Tasks MCP Tool - Retrieve tasks for users with optional filtering."""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '../../..'))

from typing import Dict, Any, Optional
import logging
from sqlmodel import select

from backend.src.models.todo import Todo
from backend.src.models.user import User
from src.utils.db_utils import get_db_session
from src.utils.response_utils import success_response, error_response

logger = logging.getLogger(__name__)


async def list_tasks_tool(
    user_id: str,
    status: Optional[str] = None
) -> Dict[str, Any]:
    """
    Retrieve tasks for the user with optional status filtering.

    This MCP tool validates the user exists, queries their tasks from the database,
    and returns a structured response with the task list.

    Args:
        user_id: The user's unique identifier (UUID)
        status: Optional filter by status ("pending" or "completed")

    Returns:
        Structured response dictionary:
        - Success: {"status": "success", "data": {"tasks": [...]}, "message": "..."}
        - Error: {"status": "error", "data": {"error_code": ...}, "message": "..."}

    Security:
        - Validates user_id exists in database
        - Returns only tasks belonging to the authenticated user
        - Prevents SQL injection via parameterized queries

    Example:
        >>> result = await list_tasks_tool("user-123")
        >>> print(result)
        {
            "status": "success",
            "data": {
                "tasks": [
                    {
                        "id": "uuid-here",
                        "title": "Buy groceries",
                        "description": "Milk and eggs",
                        "completed": false,
                        "created_at": "2026-02-08T10:30:00",
                        "updated_at": "2026-02-08T10:30:00"
                    }
                ]
            },
            "message": "Found 1 task(s)"
        }
    """
    try:
        # Validate status parameter if provided
        if status and status not in ["pending", "completed"]:
            return error_response(
                "Invalid status filter. Use 'pending' or 'completed'",
                400
            )

        async with get_db_session() as session:
            # Validate user exists
            result = await session.execute(
                select(User).where(User.id == user_id)
            )
            user = result.scalar_one_or_none()

            if not user:
                logger.warning(f"User not found: {user_id}")
                return error_response(f"User {user_id} not found", 404)

            # Build query with user_id filter
            query = select(Todo).where(Todo.user_id == user_id)

            # Add status filter if provided
            if status == "pending":
                query = query.where(Todo.completed == False)
            elif status == "completed":
                query = query.where(Todo.completed == True)

            # Order by created_at descending (newest first)
            query = query.order_by(Todo.created_at.desc())

            # Execute query
            result = await session.execute(query)
            tasks = result.scalars().all()

            # Format tasks for response
            tasks_data = [
                {
                    "id": str(task.id),
                    "title": task.title,
                    "description": task.description,
                    "completed": task.completed,
                    "created_at": task.created_at.isoformat(),
                    "updated_at": task.updated_at.isoformat()
                }
                for task in tasks
            ]

            logger.info(f"Retrieved {len(tasks)} task(s) for user {user_id}")

            status_msg = f" with status '{status}'" if status else ""
            return success_response(
                data={"tasks": tasks_data},
                message=f"Found {len(tasks)} task(s){status_msg}"
            )

    except Exception as e:
        logger.error(f"Error listing tasks: {str(e)}", exc_info=True)
        return error_response(f"Failed to list tasks: {str(e)}", 500)

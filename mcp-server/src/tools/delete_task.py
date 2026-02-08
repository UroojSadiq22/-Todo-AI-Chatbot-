"""Delete Task MCP Tool - Remove tasks with ownership validation."""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '../../..'))

from typing import Dict, Any
import logging
from sqlmodel import select

from backend.src.models.todo import Todo
from utils.db_utils import get_db_session
from utils.response_utils import success_response, error_response

logger = logging.getLogger(__name__)


async def delete_task_tool(
    user_id: str,
    task_id: int
) -> Dict[str, Any]:
    """
    Delete a task permanently.

    This MCP tool validates user ownership and removes the task from database.

    Args:
        user_id: The user's unique identifier (UUID)
        task_id: Task identifier to delete

    Returns:
        Structured response dictionary confirming deletion

    Security:
        - Validates task belongs to the user (ownership check)
        - Returns 404 if task not found or access denied
        - Permanent deletion (no soft delete)

    Example:
        >>> result = await delete_task_tool("user-123", 456)
        >>> print(result)
        {
            "status": "success",
            "data": {
                "task_id": "456"
            },
            "message": "Task deleted successfully"
        }
    """
    try:
        async with get_db_session() as session:
            # Fetch task with user_id filter (ownership validation)
            result = await session.execute(
                select(Todo).where(
                    Todo.id == task_id,
                    Todo.user_id == user_id  # Critical security filter
                )
            )
            task = result.scalar_one_or_none()

            if not task:
                logger.warning(
                    f"Task {task_id} not found or access denied for user {user_id}"
                )
                return error_response(
                    f"Task {task_id} not found or access denied",
                    404
                )

            # Delete the task
            await session.delete(task)
            await session.commit()

            logger.info(f"Task {task_id} deleted by user {user_id}")

            return success_response(
                data={"task_id": str(task_id)},
                message="Task deleted successfully"
            )

    except Exception as e:
        logger.error(f"Error deleting task: {str(e)}", exc_info=True)
        return error_response(f"Failed to delete task: {str(e)}", 500)

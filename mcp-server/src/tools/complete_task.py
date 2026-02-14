"""Complete Task MCP Tool - Mark tasks as completed with ownership validation."""

import sys
import os
from uuid import UUID
sys.path.append(os.path.join(os.path.dirname(__file__), '../../..'))

from typing import Dict, Any
import logging
from sqlmodel import select
from datetime import datetime

from src.models.todo import Todo
from src.utils.db_utils import get_db_session
from src.utils.response_utils import success_response, error_response

logger = logging.getLogger(__name__)


async def complete_task_tool(
    user_id: str,
    task_id: str
) -> Dict[str, Any]:
    """
    Mark a task as completed.

    This MCP tool validates user ownership of the task and updates its
    completed status to True.

    Args:
        user_id: The user's unique identifier (UUID)
        task_id: Task identifier to complete

    Returns:
        Structured response dictionary:
        - Success: {"status": "success", "data": {...}, "message": "..."}
        - Error: {"status": "error", "data": {"error_code": ...}, "message": "..."}

    Security:
        - Validates task belongs to the user (ownership check)
        - Returns 404 if task not found or access denied
        - Prevents cross-user task access

    Example:
        >>> result = await complete_task_tool("user-123", 456)
        >>> print(result)
        {
            "status": "success",
            "data": {
                "task_id": "456",
                "updated_at": "2026-02-08T10:35:00"
            },
            "message": "Task marked as completed"
        }
    """
    try:
        async with get_db_session() as session:

            # Convert task_id to UUID
            try:
                task_uuid = UUID(str(task_id)) if not isinstance(task_id, UUID) else task_id
            except ValueError:
                return error_response(f"Invalid task ID format: {task_id}", 400)
                
            # Fetch task with user_id filter (ownership validation)
            result = await session.execute(
                select(Todo).where(
                    Todo.id == task_uuid,
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

            # Check if already completed
            if task.completed:
                return success_response(
                    data={
                        "task_id": str(task.id),
                        "updated_at": task.updated_at.isoformat()
                    },
                    message="Task was already completed"
                )

            # Mark task as completed
            task.completed = True
            task.updated_at = datetime.utcnow()

            session.add(task)
            await session.commit()
            await session.refresh(task)

            logger.info(f"Task {task_id} marked as completed by user {user_id}")

            return success_response(
                data={
                    "task_id": str(task.id),
                    "updated_at": task.updated_at.isoformat()
                },
                message="Task marked as completed"
            )

    except Exception as e:
        logger.error(f"Error completing task: {str(e)}", exc_info=True)
        return error_response(f"Failed to complete task: {str(e)}", 500)

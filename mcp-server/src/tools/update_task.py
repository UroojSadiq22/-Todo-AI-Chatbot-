"""Update Task MCP Tool - Modify task details with ownership validation."""

import sys
import os
from uuid import UUID
sys.path.append(os.path.join(os.path.dirname(__file__), '../../..'))

from typing import Dict, Any, Optional
import logging
from sqlmodel import select
from datetime import datetime

from src.models.todo import Todo
from src.utils.db_utils import get_db_session
from src.utils.response_utils import success_response, error_response

logger = logging.getLogger(__name__)


async def update_task_tool(
    user_id: str,
    task_id: str,
    title: Optional[str] = None,
    description: Optional[str] = None
) -> Dict[str, Any]:
    """
    Update task details (title and/or description).

    This MCP tool validates user ownership and updates the specified fields.

    Args:
        user_id: The user's unique identifier (UUID)
        task_id: Task identifier to update
        title: New task title (optional, 1-200 chars)
        description: New task description (optional, max 1000 chars)

    Returns:
        Structured response dictionary with updated fields

    Security:
        - Validates task belongs to the user (ownership check)
        - Returns 404 if task not found or access denied

    Example:
        >>> result = await update_task_tool("user-123", 456, title="New Title")
        >>> print(result)
        {
            "status": "success",
            "data": {
                "task_id": "456",
                "updated_fields": ["title"]
            },
            "message": "Task updated successfully"
        }
    """
    try:
        # Validate at least one field is provided
        if title is None and description is None:
            return error_response(
                "At least one field (title or description) must be provided",
                400
            )

        # Validate field lengths
        if title is not None:
            if len(title.strip()) == 0:
                return error_response("Title cannot be empty", 400)
            if len(title) > 200:
                return error_response("Title cannot exceed 200 characters", 400)

        if description is not None and len(description) > 1000:
            return error_response("Description cannot exceed 1000 characters", 400)

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

            # Track which fields were updated
            updated_fields = []

            # Update title if provided
            if title is not None:
                task.title = title.strip()
                updated_fields.append("title")

            # Update description if provided
            if description is not None:
                task.description = description.strip() if description else None
                updated_fields.append("description")

            # Update timestamp
            task.updated_at = datetime.utcnow()

            session.add(task)
            await session.commit()
            await session.refresh(task)

            logger.info(
                f"Task {task_id} updated by user {user_id}: {', '.join(updated_fields)}"
            )

            return success_response(
                data={
                    "task_id": str(task.id),
                    "updated_fields": updated_fields
                },
                message="Task updated successfully"
            )

    except Exception as e:
        logger.error(f"Error updating task: {str(e)}", exc_info=True)
        return error_response(f"Failed to update task: {str(e)}", 500)

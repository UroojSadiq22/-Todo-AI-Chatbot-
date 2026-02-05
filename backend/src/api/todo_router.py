"""Todo router for the Todo application."""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List, Optional
from uuid import UUID
from ..models.todo import Todo, TodoCreate, TodoUpdate, TodoResponse
from ..services.todo_service import (
    get_todos_by_user,
    get_todo_by_id_and_user,
    create_todo,
    update_todo,
    toggle_todo_completion,
    delete_todo
)
from ..database.session import get_async_session
from ..auth.middleware import get_current_user_id
from ..utils.errors import TodoNotFoundException, UnauthorizedAccessException, handle_error
from ..utils.logging import log_api_call, log_error


router = APIRouter()


@router.get("/", response_model=List[TodoResponse])
async def get_todos(
    completed: Optional[bool] = Query(None, description="Filter by completion status"),
    limit: Optional[int] = Query(None, ge=1, le=100, description="Limit number of results"),
    offset: Optional[int] = Query(None, ge=0, description="Offset for pagination"),
    current_user: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_async_session)
):
    """
    Get all todos for the current user.
    """
    try:
        # Log the API call
        log_api_call("/api/todos", "GET", current_user)

        # In a real implementation, current_user would be the user ID extracted from the JWT
        # For now, we'll use the current_user directly as the user_id
        user_id = current_user
        todos = await get_todos_by_user(
            session=session,
            user_id=user_id,
            completed=completed,
            limit=limit,
            offset=offset
        )
        return todos
    except Exception as e:
        log_error(e, f"Error getting todos for user {current_user}")
        handle_error("Failed to retrieve todos", status.HTTP_500_INTERNAL_SERVER_ERROR)


@router.post("/", response_model=TodoResponse, status_code=status.HTTP_201_CREATED)
async def create_todo_endpoint(
    todo: TodoCreate,
    current_user: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_async_session)
):
    """
    Create a new todo for the current user.
    """
    try:
        # Log the API call
        log_api_call("/api/todos", "POST", current_user, {"title": todo.title})

        # In a real implementation, current_user would be the user ID extracted from the JWT
        user_id = current_user
        created_todo = await create_todo(
            session=session,
            todo_create=todo,
            user_id=user_id
        )
        return created_todo
    except Exception as e:
        log_error(e, f"Error creating todo for user {current_user}")
        handle_error("Failed to create todo", status.HTTP_500_INTERNAL_SERVER_ERROR)


@router.get("/{todo_id}", response_model=TodoResponse)
async def get_todo(
    todo_id: UUID,
    current_user: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_async_session)
):
    """
    Get a specific todo by ID.
    """
    try:
        # Log the API call
        log_api_call(f"/api/todos/{todo_id}", "GET", current_user)

        # In a real implementation, current_user would be the user ID extracted from the JWT
        user_id = current_user
        todo = await get_todo_by_id_and_user(
            session=session,
            todo_id=todo_id,
            user_id=user_id
        )
        if not todo:
            raise TodoNotFoundException(str(todo_id))
        return todo
    except TodoNotFoundException:
        raise
    except Exception as e:
        log_error(e, f"Error getting todo {todo_id} for user {current_user}")
        handle_error("Failed to retrieve todo", status.HTTP_500_INTERNAL_SERVER_ERROR)


@router.put("/{todo_id}", response_model=TodoResponse)
async def update_todo_endpoint(
    todo_id: UUID,
    todo_update: TodoUpdate,
    current_user: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_async_session)
):
    """
    Update a specific todo by ID.
    """
    try:
        # Log the API call
        log_api_call(f"/api/todos/{todo_id}", "PUT", current_user, todo_update.model_dump(exclude_unset=True))

        # In a real implementation, current_user would be the user ID extracted from the JWT
        user_id = current_user
        updated_todo = await update_todo(
            session=session,
            todo_id=todo_id,
            user_id=user_id,
            todo_update=todo_update
        )
        if not updated_todo:
            raise TodoNotFoundException(str(todo_id))
        return updated_todo
    except TodoNotFoundException:
        raise
    except Exception as e:
        log_error(e, f"Error updating todo {todo_id} for user {current_user}")
        handle_error("Failed to update todo", status.HTTP_500_INTERNAL_SERVER_ERROR)


@router.patch("/{todo_id}/toggle", response_model=TodoResponse)
async def toggle_todo_completion_endpoint(
    todo_id: UUID,
    current_user: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_async_session)
):
    """
    Toggle the completion status of a specific todo.
    """
    try:
        # Log the API call
        log_api_call(f"/api/todos/{todo_id}/toggle", "PATCH", current_user)

        # In a real implementation, current_user would be the user ID extracted from the JWT
        user_id = current_user
        toggled_todo = await toggle_todo_completion(
            session=session,
            todo_id=todo_id,
            user_id=user_id
        )
        if not toggled_todo:
            raise TodoNotFoundException(str(todo_id))
        return toggled_todo
    except TodoNotFoundException:
        raise
    except Exception as e:
        log_error(e, f"Error toggling todo {todo_id} for user {current_user}")
        handle_error("Failed to toggle todo completion", status.HTTP_500_INTERNAL_SERVER_ERROR)


@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_todo_endpoint(
    todo_id: UUID,
    current_user: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_async_session)
):
    """
    Delete a specific todo by ID.
    """
    try:
        # Log the API call
        log_api_call(f"/api/todos/{todo_id}", "DELETE", current_user)

        # In a real implementation, current_user would be the user ID extracted from the JWT
        user_id = current_user
        success = await delete_todo(
            session=session,
            todo_id=todo_id,
            user_id=user_id
        )
        if not success:
            raise TodoNotFoundException(str(todo_id))
        return
    except TodoNotFoundException:
        raise
    except Exception as e:
        log_error(e, f"Error deleting todo {todo_id} for user {current_user}")
        handle_error("Failed to delete todo", status.HTTP_500_INTERNAL_SERVER_ERROR)
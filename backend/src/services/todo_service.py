"""Todo service for the Todo application."""

from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select, update
from typing import List, Optional
from uuid import UUID
from ..models.todo import Todo, TodoCreate, TodoUpdate
from ..models.user import User
from ..utils.errors import TodoNotFoundException, UnauthorizedAccessException


async def get_todos_by_user(
    session: AsyncSession,
    user_id: UUID,
    completed: Optional[bool] = None,
    limit: Optional[int] = None,
    offset: Optional[int] = None
) -> List[Todo]:
    """
    Get all todos for a specific user, with optional filtering.
    """
    statement = select(Todo).where(Todo.user_id == user_id)

    if completed is not None:
        statement = statement.where(Todo.completed == completed)

    if limit is not None:
        statement = statement.limit(limit)

    if offset is not None:
        statement = statement.offset(offset)

    result = await session.execute(statement)
    todos = result.scalars().all()
    return todos


async def get_todo_by_id_and_user(session: AsyncSession, todo_id: UUID, user_id: UUID) -> Optional[Todo]:
    """
    Get a specific todo by its ID and ensure it belongs to the user.
    """
    statement = select(Todo).where(Todo.id == todo_id, Todo.user_id == user_id)
    result = await session.execute(statement)
    todo = result.first()
    return todo[0] if todo else None


async def create_todo(session: AsyncSession, todo_create: TodoCreate, user_id: UUID) -> Todo:
    """
    Create a new todo for a specific user.
    """
    todo = Todo(
        **todo_create.model_dump(),
        user_id=user_id
    )
    session.add(todo)
    await session.commit()
    await session.refresh(todo)
    return todo


async def update_todo(
    session: AsyncSession,
    todo_id: UUID,
    user_id: UUID,
    todo_update: TodoUpdate
) -> Optional[Todo]:
    """
    Update a specific todo if it belongs to the user.
    """
    # First check if the todo exists and belongs to the user
    existing_todo = await get_todo_by_id_and_user(session, todo_id, user_id)
    if not existing_todo:
        return None

    # Prepare update data
    update_data = todo_update.model_dump(exclude_unset=True)

    # Update the todo
    statement = (
        update(Todo)
        .where(Todo.id == todo_id, Todo.user_id == user_id)
        .values(**update_data)
    )
    await session.execute(statement)
    await session.commit()

    # Refresh and return the updated todo
    updated_todo = await get_todo_by_id_and_user(session, todo_id, user_id)
    return updated_todo


async def toggle_todo_completion(session: AsyncSession, todo_id: UUID, user_id: UUID) -> Optional[Todo]:
    """
    Toggle the completion status of a specific todo.
    """
    # First check if the todo exists and belongs to the user
    existing_todo = await get_todo_by_id_and_user(session, todo_id, user_id)
    if not existing_todo:
        return None

    # Toggle the completion status
    new_completion_status = not existing_todo.completed
    statement = (
        update(Todo)
        .where(Todo.id == todo_id, Todo.user_id == user_id)
        .values(completed=new_completion_status)
    )
    await session.execute(statement)
    await session.commit()

    # Refresh and return the updated todo
    updated_todo = await get_todo_by_id_and_user(session, todo_id, user_id)
    return updated_todo


async def delete_todo(session: AsyncSession, todo_id: UUID, user_id: UUID) -> bool:
    """
    Delete a specific todo if it belongs to the user.
    """
    # Check if the todo exists and belongs to the user
    existing_todo = await get_todo_by_id_and_user(session, todo_id, user_id)
    if not existing_todo:
        return False

    # Delete the todo
    await session.delete(existing_todo)
    await session.commit()
    return True
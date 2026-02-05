"""Authentication service for the Todo application."""

from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from typing import Optional
from ..models.user import User, UserCreate, UserRegistration
from ..auth import verify_password, get_password_hash
from datetime import timedelta


async def authenticate_user(session: AsyncSession, email: str, password: str) -> Optional[User]:
    """
    Authenticate a user by email and password.
    """
    # Find user by email
    statement = select(User).where(User.email == email)
    result = await session.execute(statement)
    user = result.scalar_one_or_none()

    if user is None:
        return None

    # Verify password
    if not verify_password(password, user.hashed_password):
        return None

    return user


async def create_user(session: AsyncSession, user_create: UserRegistration) -> User:
    """
    Create a new user with hashed password.
    """
    # Hash the password
    hashed_password = get_password_hash(user_create.password)

    # Create user instance with both username and email
    user = User(
        username=user_create.username,
        email=user_create.email,
        hashed_password=hashed_password
    )

    # Add to session and commit
    session.add(user)
    await session.commit()
    await session.refresh(user)

    return user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """
    Create an access token (wrapper for auth module function).
    """
    from ..auth import create_access_token as create_jwt_token
    return create_jwt_token(data, expires_delta)


async def get_user_by_email(session: AsyncSession, email: str) -> Optional[User]:
    """
    Get a user by email.
    """
    statement = select(User).where(User.email == email)
    result = await session.execute(statement)
    user = result.scalar_one_or_none()
    return user


async def get_user_by_username(session: AsyncSession, username: str) -> Optional[User]:
    """
    Get a user by username.
    """
    statement = select(User).where(User.username == username)
    result = await session.execute(statement)
    user = result.scalar_one_or_none()
    return user


def validate_email_format(email: str) -> bool:
    """
    Validate email format using basic pattern matching.
    """
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None
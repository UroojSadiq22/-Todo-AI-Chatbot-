"""Database utility functions for MCP server."""

from contextlib import asynccontextmanager
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

# Create async engine with connection pooling
engine = create_async_engine(
    DATABASE_URL,
    echo=True,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True
)

# Create session maker
async_session_maker = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)


@asynccontextmanager
async def get_db_session():
    """
    Async context manager for database sessions.

    Yields:
        AsyncSession: Database session for executing queries

    Example:
        async with get_db_session() as session:
            result = await session.execute(select(Todo))
            tasks = result.scalars().all()
    """
    async with async_session_maker() as session:
        try:
            yield session
        finally:
            await session.close()

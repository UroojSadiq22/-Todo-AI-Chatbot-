"""Configuration for integration tests."""

import pytest
from sqlmodel import create_engine
from sqlmodel.pool import StaticPool
from backend.src.main import app
from backend.src.database.session import get_async_session
from backend.src.models import User, Todo
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from httpx import AsyncClient


# Create an in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

# Create tables
from backend.src.database import models  # Import models to create tables
models.Base.metadata.create_all(bind=engine)


async def override_get_async_session():
    """Override the get_async_session dependency for testing."""
    async with AsyncSession(engine) as session:
        yield session


@pytest.fixture(scope="module")
def event_loop():
    """Create a new event loop for async tests."""
    import asyncio
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="module")
async def test_client():
    """Create a test client for the API."""
    app.dependency_overrides[get_async_session] = override_get_async_session
    async with AsyncClient(app=app, base_url="http://testserver") as client:
        yield client
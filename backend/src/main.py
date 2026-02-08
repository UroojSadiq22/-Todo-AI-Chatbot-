"""Main entry point for the Todo application API."""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from sqlmodel import SQLModel
from .api.auth_router import router as auth_router
from .api.todo_router import router as todo_router
from .api.chat import router as chat_router
from .config import settings
from .database import async_engine


# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan event handler for application startup and shutdown."""
    # Startup
    logger.info("Initializing database connection...")
    try:
        # Test the database connection
        async with async_engine.begin() as conn:
            await conn.execute(text("SELECT 1"))
            await conn.run_sync(SQLModel.metadata.create_all)
        logger.info("Database connection established successfully")
    except Exception as e:
        logger.error(f"Failed to connect to database: {e}")
        # Fail fast if database connection fails
        raise HTTPException(status_code=500, detail=f"Database connection failed: {str(e)}")

    yield  # Application runs here

    # Shutdown
    await async_engine.dispose()
    logger.info("Database connection closed")


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    app = FastAPI(
        title="Todo API",
        description="A secure, multi-user todo application API",
        version="1.0.0",
        lifespan=lifespan,  # Add lifespan to handle startup/shutdown events
    )

    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # In production, replace with specific origins
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include routers
    app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
    app.include_router(todo_router, prefix="/api/todos", tags=["todos"])
    app.include_router(chat_router, prefix="/api", tags=["chat"])

    @app.get("/")
    def read_root():
        return {"message": "Welcome to the Todo API"}

    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
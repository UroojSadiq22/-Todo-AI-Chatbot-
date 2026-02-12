"""MCP Server main entry point for Todo App Phase 3.

This module initializes the MCP server with FastAPI and registers all MCP tools.
The server runs on port 5000 and exposes 5 MCP tools for task management.
"""

from typing import Optional
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
import os
from dotenv import load_dotenv
from pydantic import BaseModel

from .tools import (
    add_task_tool,
    list_tasks_tool,
    complete_task_tool,
    update_task_tool,
    delete_task_tool
)

# Load environment variables
load_dotenv()

class AddTaskRequest(BaseModel):
    user_id: str
    title: str
    description: Optional[str] = None

class ListTasksRequest(BaseModel):
    user_id: str
    status: Optional[str] = "all"

class CompleteTaskRequest(BaseModel):
    user_id: str
    task_id: str

class UpdateTaskRequest(BaseModel):
    user_id: str
    task_id: str
    title: Optional[str] = None
    description: Optional[str] = None

class DeleteTaskRequest(BaseModel):
    user_id: str
    task_id: str


# Configure logging
logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO"),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="MCP Server - Todo App",
    description="Model Context Protocol server for AI-powered task management",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Initialize MCP server on startup."""
    logger.info("MCP Server starting up...")
    logger.info("Environment: %s", os.getenv("ENVIRONMENT", "development"))
    logger.info("Server port: %s", os.getenv("MCP_SERVER_PORT", "5000"))
    logger.info("Registered tools: add_task, list_tasks, complete_task, update_task, delete_task")
    # Additional tools will be registered as they are implemented


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on server shutdown."""
    logger.info("MCP Server shutting down...")


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "ok",
        "message": "MCP Server is running",
        "version": "1.0.0",
        "tools": ["add_task", "list_tasks", "complete_task", "update_task", "delete_task"]
    }


@app.post("/tools/add_task")
async def add_task_endpoint(request: AddTaskRequest):
    """Endpoint for add_task MCP tool."""
    return await add_task_tool(
        user_id=request.user_id, 
        title=request.title, 
        description=request.description
        )


@app.post("/tools/list_tasks")
async def list_tasks_endpoint(request: ListTasksRequest):
    """Endpoint for list_tasks MCP tool."""
    return await list_tasks_tool(user_id=request.user_id, status=request.status)


@app.post("/tools/complete_task")
async def complete_task_endpoint(request: CompleteTaskRequest):
    """Endpoint for complete_task MCP tool."""
    return await complete_task_tool(user_id=request.user_id, task_id=request.task_id)


@app.post("/tools/update_task")
async def update_task_endpoint(request: UpdateTaskRequest):
    """Endpoint for update_task MCP tool."""
    return await update_task_tool(
        user_id=request.user_id, 
        task_id=request.task_id, 
        title=request.title, 
        description=request.description
        )


@app.post("/tools/delete_task")
async def delete_task_endpoint(request: DeleteTaskRequest):
    """Endpoint for delete_task MCP tool."""
    return await delete_task_tool(user_id=request.user_id, task_id=request.task_id)


@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring."""
    return {
        "status": "healthy",
        "database": "connected"  # Will add actual DB check later
    }


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("MCP_SERVER_PORT", "5000"))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level=os.getenv("LOG_LEVEL", "info").lower()
    )

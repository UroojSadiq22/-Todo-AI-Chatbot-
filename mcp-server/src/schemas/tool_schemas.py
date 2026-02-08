"""Pydantic schemas for MCP tool requests and responses."""

from pydantic import BaseModel, Field
from typing import Optional, List, Any, Dict


# Request Schemas

class AddTaskRequest(BaseModel):
    """Request schema for add_task tool."""
    user_id: str = Field(..., description="User's unique identifier")
    title: str = Field(..., min_length=1, max_length=200, description="Task title")
    description: Optional[str] = Field(None, max_length=1000, description="Task description")


class ListTasksRequest(BaseModel):
    """Request schema for list_tasks tool."""
    user_id: str = Field(..., description="User's unique identifier")
    status: Optional[str] = Field(None, description="Filter by status ('pending' or 'completed')")


class CompleteTaskRequest(BaseModel):
    """Request schema for complete_task tool."""
    user_id: str = Field(..., description="User's unique identifier")
    task_id: int = Field(..., description="Task identifier")


class UpdateTaskRequest(BaseModel):
    """Request schema for update_task tool."""
    user_id: str = Field(..., description="User's unique identifier")
    task_id: int = Field(..., description="Task identifier")
    title: Optional[str] = Field(None, min_length=1, max_length=200, description="New task title")
    description: Optional[str] = Field(None, max_length=1000, description="New task description")


class DeleteTaskRequest(BaseModel):
    """Request schema for delete_task tool."""
    user_id: str = Field(..., description="User's unique identifier")
    task_id: int = Field(..., description="Task identifier")


# Response Schemas

class ToolResponse(BaseModel):
    """Generic tool response schema."""
    status: str = Field(..., description="Response status ('success' or 'error')")
    data: Dict[str, Any] = Field(..., description="Tool-specific response data")
    message: str = Field(..., description="Human-readable status message")


class TaskData(BaseModel):
    """Task data schema for responses."""
    id: str
    title: str
    description: Optional[str] = None
    completed: bool
    created_at: str
    updated_at: str


class AddTaskResponse(ToolResponse):
    """Specific response schema for add_task tool."""
    pass


class ListTasksResponse(ToolResponse):
    """Specific response schema for list_tasks tool."""
    pass


class CompleteTaskResponse(ToolResponse):
    """Specific response schema for complete_task tool."""
    pass


class UpdateTaskResponse(ToolResponse):
    """Specific response schema for update_task tool."""
    pass


class DeleteTaskResponse(ToolResponse):
    """Specific response schema for delete_task tool."""
    pass

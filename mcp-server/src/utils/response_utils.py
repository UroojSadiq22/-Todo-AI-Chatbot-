"""Utility functions for creating structured MCP tool responses."""

from typing import Dict, Any


def success_response(data: Dict[str, Any], message: str = "Success") -> Dict[str, Any]:
    """
    Create a structured success response for MCP tools.

    Args:
        data: Tool-specific payload to return
        message: Human-readable success message

    Returns:
        Structured response dictionary with status='success'

    Example:
        >>> success_response({"task_id": "123"}, "Task created")
        {"status": "success", "data": {"task_id": "123"}, "message": "Task created"}
    """
    return {
        "status": "success",
        "data": data,
        "message": message
    }


def error_response(message: str, code: int = 400) -> Dict[str, Any]:
    """
    Create a structured error response for MCP tools.

    Args:
        message: Human-readable error message
        code: HTTP-style error code (400=bad request, 404=not found, 500=server error)

    Returns:
        Structured response dictionary with status='error'

    Example:
        >>> error_response("User not found", 404)
        {"status": "error", "data": {"error_code": 404}, "message": "User not found"}
    """
    return {
        "status": "error",
        "data": {"error_code": code},
        "message": message
    }

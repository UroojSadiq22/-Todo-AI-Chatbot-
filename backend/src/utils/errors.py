"""Custom error handling for the Todo application."""

from fastapi import HTTPException, status


class TodoException(HTTPException):
    """Base exception class for Todo application."""
    def __init__(self, detail: str, status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR):
        super().__init__(status_code=status_code, detail=detail)


class UserNotFoundException(TodoException):
    """Raised when a user is not found."""
    def __init__(self, user_id: str):
        super().__init__(
            detail=f"User with id {user_id} not found",
            status_code=status.HTTP_404_NOT_FOUND
        )


class TodoNotFoundException(TodoException):
    """Raised when a todo is not found."""
    def __init__(self, todo_id: str):
        super().__init__(
            detail=f"Todo with id {todo_id} not found",
            status_code=status.HTTP_404_NOT_FOUND
        )


class UnauthorizedAccessException(TodoException):
    """Raised when a user tries to access resources they don't own."""
    def __init__(self):
        super().__init__(
            detail="Not authorized to access this resource",
            status_code=status.HTTP_403_FORBIDDEN
        )


class DuplicateEmailException(TodoException):
    """Raised when trying to create a user with an existing email."""
    def __init__(self):
        super().__init__(
            detail="A user with this email already exists",
            status_code=status.HTTP_409_CONFLICT
        )


def handle_error(error_msg: str, status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR):
    """Helper function to handle errors consistently."""
    raise HTTPException(status_code=status_code, detail=error_msg)
"""Authentication middleware for JWT token validation."""

from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Dict, Any
from .jwt_handler import verify_token


security = HTTPBearer()


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    """
    Dependency to get current user from JWT token.

    This function extracts and validates the JWT token from the Authorization header,
    then returns the user information from the token payload.

    Returns:
        Dict containing user information extracted from the token
    """
    token = credentials.credentials
    payload = verify_token(token)

    # Verify that required user information exists in the token
    if "sub" not in payload or "email" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token: missing user information",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return payload


def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """
    Dependency to get current user ID from JWT token.

    This function extracts and validates the JWT token from the Authorization header,
    then returns just the user ID from the token payload.

    Returns:
        User ID as a string
    """
    token = credentials.credentials
    payload = verify_token(token)

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token: missing user ID",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user_id
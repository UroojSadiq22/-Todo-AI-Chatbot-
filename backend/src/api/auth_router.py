"""Authentication router for the Todo application."""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from pydantic import BaseModel, ValidationError
from typing import Optional
from datetime import timedelta
from ..models.user import User, UserCreate, UserResponse, UserRegistration
from ..models.auth import RegisterRequest, LoginRequest, AuthResponse
from ..services.auth_service import authenticate_user, create_access_token as create_token, create_user, get_user_by_email, get_user_by_username
from ..database.session import get_async_session
from sqlmodel.ext.asyncio.session import AsyncSession
from ..utils.errors import DuplicateEmailException
from uuid import UUID


router = APIRouter()
security = HTTPBearer()


import logging

logger = logging.getLogger(__name__)

@router.post("/register", response_model=AuthResponse)
async def register_user(
    user_registration: RegisterRequest,
    session: AsyncSession = Depends(get_async_session)
):
    """
    Register a new user with username, email, and password.
    """
    logger.info(f"Registration attempt for email: {user_registration.email}, username: {user_registration.username}")

    try:
        # Check if user with this email already exists
        existing_user_by_email = await get_user_by_email(session, user_registration.email)
        if existing_user_by_email:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered"
            )

        # Check if user with this username already exists
        existing_user_by_username = await get_user_by_username(session, user_registration.username)
        if existing_user_by_username:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Username already taken"
            )

        print(f"Received registration data: {user_registration}")

        # Create new user using the auth service
        created_user = await create_user(session, user_registration)

        # Prepare user response data (without sensitive information)
        access_token_expires = timedelta(minutes=15)
        token_data = {"sub": str(created_user.id), "email": created_user.email}
        access_token = create_token(
            data=token_data, expires_delta=access_token_expires
        )

        # Log successful registration
        logger.info(f"Successfully registered user with ID: {created_user.id}, email: {created_user.email}")

        return AuthResponse(
            user={
                "id": str(created_user.id),  # Convert UUID to string
                "email": created_user.email,
                "name": created_user.username,  # Use username as name to match frontend expectations
                "created_at": created_user.created_at,
                "updated_at": created_user.updated_at,
                "is_active": created_user.is_active
            },
            token=access_token,
            message="Registration successful"
        )
    except HTTPException as http_err:
        # Log HTTP exceptions
        logger.error(f"HTTP error during registration for email {user_registration.email}: {http_err.detail}")
        # Re-raise HTTP exceptions
        raise

    except Exception as e:
        # Handle any other unexpected errors
        logger.error(f"Unexpected error during registration for email {user_registration.email}: {str(e)}")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during registration"
        )


@router.post("/login", response_model=AuthResponse)
async def login_user(
    login_request: LoginRequest,
    session: AsyncSession = Depends(get_async_session)
):
    """
    Login an existing user.
    """
    try:
        # Authenticate the user
        user = await authenticate_user(
            session, login_request.email, login_request.password
        )

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Create JWT token for the authenticated user
        access_token_expires = timedelta(minutes=35)  # 15 minutes for security
        token_data = {"sub": str(user.id), "email": user.email}
        access_token = create_token(
            data=token_data, expires_delta=access_token_expires
        )

        # Prepare user response data
        user_response = {
            "id": user.id,
            "email": user.email,
            "created_at": user.created_at,
            "updated_at": user.updated_at,
            "is_active": user.is_active
        }

        return AuthResponse(
            user=user_response,
            token=access_token,
            message="Login successful"
        )
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # Handle any other unexpected errors
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during login"
        )
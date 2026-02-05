"""Authentication models for the Todo application."""

from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from sqlmodel import SQLModel
import re


class RegisterRequest(BaseModel):
    """Request model for user registration."""
    username: str
    email: EmailStr
    password: str

    @validator('username')
    def validate_username(cls, v):
        """Validate username."""
        if len(v) < 3 or len(v) > 50:
            raise ValueError('Username must be between 3 and 50 characters')
        if not v.replace('_', '').replace('-', '').isalnum():
            raise ValueError('Username must be alphanumeric with underscores and hyphens only')
        return v

    @validator('password')
    def validate_password(cls, v):
        """Validate password strength."""
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')

        return v  # Simplified validation to match UserRegistration model


class LoginRequest(BaseModel):
    """Request model for user login."""
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    """Response model for authentication operations."""
    user: dict
    token: str
    message: str


class TokenData(BaseModel):
    """Model for token data."""
    email: Optional[str] = None


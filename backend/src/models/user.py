"""User model for the authentication system."""

from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime
from uuid import UUID, uuid4
from pydantic import BaseModel, field_validator
import uuid


class UserBase(SQLModel):
    """Base model for user with shared fields."""
    username: str = Field(unique=True, nullable=False, index=True, min_length=3, max_length=50)
    email: str = Field(unique=True, nullable=False, index=True)


class User(UserBase, table=True):
    """User model representing a registered user."""

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    username: str = Field(unique=True, nullable=False, index=True, min_length=3, max_length=50)
    email: str = Field(unique=True, nullable=False, index=True)
    hashed_password: str = Field(nullable=False)
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to todos
    todos: list["Todo"] = Relationship(back_populates="user")

    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        if '@' not in v or '.' not in v.split('@')[1]:
            raise ValueError('Invalid email format')
        return v

    @field_validator('username')
    @classmethod
    def validate_username(cls, v):
        if not v.replace('_', '').replace('-', '').isalnum():
            raise ValueError('Username must be alphanumeric with underscores and hyphens only')
        return v

    def __str__(self):
        return f"User(id={self.id}, username={self.username}, email={self.email})"

    def __repr__(self):
        return self.__str__()


class UserCreate(UserBase):
    """Schema for creating a new user."""
    username: str
    email: str
    password: str


class UserRead(UserBase):
    """Schema for reading user data."""
    id: UUID
    username: str
    email: str
    created_at: datetime
    updated_at: datetime


class UserUpdate(SQLModel):
    """Schema for updating user data."""
    username: Optional[str] = None
    email: Optional[str] = None


class UserLogin(SQLModel):
    """Schema for user login."""
    email: str
    password: str


class UserRegistration(BaseModel):
    """Schema for user registration."""
    username: str
    email: str
    password: str

    # @field_validator('username')
    # @classmethod
    # def validate_username(cls, v):
    #     if len(v) < 3 or len(v) > 50:
    #         raise ValueError('Username must be between 3 and 50 characters')
    #     if not v.replace('_', '').replace('-', '').isalnum():
    #         raise ValueError('Username must be alphanumeric with underscores and hyphens only')
    #     return v

    # @field_validator('email')
    # @classmethod
    # def validate_email(cls, v):
    #     if '@' not in v or '.' not in v.split('@')[1]:
    #         raise ValueError('Invalid email format')
    #     return v

    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        return v


class UserResponse(BaseModel):
    id: UUID
    username: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True    
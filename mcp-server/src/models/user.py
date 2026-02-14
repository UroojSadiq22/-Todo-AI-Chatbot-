"""User model for the authentication system."""

from sqlmodel import SQLModel, Field
from datetime import datetime
from uuid import UUID, uuid4




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
    # todos: list["Todo"] = Relationship(back_populates="user")


    def __str__(self):
        return f"User(id={self.id}, username={self.username}, email={self.email})"

    def __repr__(self):
        return self.__str__()

    id: UUID
    username: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True    
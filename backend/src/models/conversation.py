from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field
import uuid


class Conversation(SQLModel, table=True):
    """
    Represents a conversation thread between a user and the AI assistant.
    """
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    user_id: str = Field(index=True)  # Reference to the user who owns this conversation
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

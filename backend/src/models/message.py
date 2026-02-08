from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field
import uuid


class Message(SQLModel, table=True):
    """
    Represents a single message in a conversation, either from the user or the assistant.
    """
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    conversation_id: str = Field(index=True)  # Reference to the conversation this message belongs to
    user_id: str = Field(index=True)  # Reference to the user who sent the message
    role: str = Field(regex='^(user|assistant)$')  # Either 'user' or 'assistant' indicating the sender
    content: str = Field()  # The actual message content
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Validation would be handled at application level

from datetime import datetime
from typing import List, Optional
from sqlmodel import Session, select, func
from ..models.conversation import Conversation
from ..models.message import Message
import uuid


def truncate_conversation_history(messages: List[Message], max_messages: int = 20) -> List[Message]:
    """
    Truncates the conversation history to the most recent messages up to max_messages.
    """
    if len(messages) <= max_messages:
        return messages
    return messages[-max_messages:]


class ConversationService:
    def __init__(self, session: Session):
        self.session = session
    
    def create_conversation(self, user_id: str) -> Conversation:
        """
        Creates a new conversation for the given user.
        """
        conversation = Conversation(
            user_id=user_id,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        self.session.add(conversation)
        self.session.commit()
        self.session.refresh(conversation)
        return conversation
    
    def get_user_conversation(self, user_id: str) -> Optional[Conversation]:
        """
        Gets the most recent conversation for a user, or None if no conversation exists.
        """
        statement = select(Conversation).where(Conversation.user_id == user_id).order_by(Conversation.updated_at.desc()).limit(1)
        return self.session.exec(statement).first()
    
    def save_message(self, conversation_id: str, user_id: str, role: str, content: str) -> Message:
        """
        Saves a message to the specified conversation.
        """
        message = Message(
            conversation_id=conversation_id,
            user_id=user_id,
            role=role,
            content=content,
            created_at=datetime.utcnow()
        )
        self.session.add(message)
        self.session.commit()
        self.session.refresh(message)
        return message
    
    def get_conversation_history(self, conversation_id: str, limit: int = 20) -> List[Message]:
        """
        Gets the conversation history for the given conversation ID.
        Returns the most recent messages up to the limit.
        """
        statement = (
            select(Message)
            .where(Message.conversation_id == conversation_id)
            .order_by(Message.created_at.asc())
            .limit(limit)
        )
        return self.session.exec(statement).all()

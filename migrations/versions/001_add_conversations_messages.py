"""Add conversations and messages tables

Revision ID: 001
Revises:
Create Date: 2026-02-08

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    """Create conversations and messages tables with indexes."""

    # Create conversations table
    op.create_table(
        'conversations',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['user.id'], name='fk_conversations_user_id'),
        sa.PrimaryKeyConstraint('id', name='pk_conversations')
    )

    # Create indexes for conversations table
    op.create_index('idx_conversations_user_id', 'conversations', ['user_id'])
    op.create_index('idx_conversations_created_at', 'conversations', ['created_at'])

    # Create messages table
    op.create_table(
        'messages',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('conversation_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('role', sa.String(20), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.CheckConstraint("role IN ('user', 'assistant')", name='check_message_role'),
        sa.ForeignKeyConstraint(['conversation_id'], ['conversations.id'], name='fk_messages_conversation_id'),
        sa.ForeignKeyConstraint(['user_id'], ['user.id'], name='fk_messages_user_id'),
        sa.PrimaryKeyConstraint('id', name='pk_messages')
    )

    # Create indexes for messages table
    op.create_index('idx_messages_conversation_id', 'messages', ['conversation_id'])
    op.create_index('idx_messages_user_id', 'messages', ['user_id'])
    op.create_index('idx_messages_created_at', 'messages', ['created_at'])


def downgrade():
    """Drop messages and conversations tables."""

    # Drop messages table and its indexes
    op.drop_index('idx_messages_created_at', 'messages')
    op.drop_index('idx_messages_user_id', 'messages')
    op.drop_index('idx_messages_conversation_id', 'messages')
    op.drop_table('messages')

    # Drop conversations table and its indexes
    op.drop_index('idx_conversations_created_at', 'conversations')
    op.drop_index('idx_conversations_user_id', 'conversations')
    op.drop_table('conversations')

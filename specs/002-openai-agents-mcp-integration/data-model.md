# Data Model: OpenAI Agents SDK with MCP Tools Integration

## Overview
This document defines the data models required for the conversational task management system that integrates OpenAI Agents SDK with MCP tools.

## Entity Definitions

### Conversation
Represents a conversation thread between a user and the AI assistant.

**Fields:**
- id: UUID (Primary Key) - Unique identifier for the conversation
- user_id: String (Foreign Key) - Reference to the user who owns this conversation
- created_at: DateTime - Timestamp when the conversation was created
- updated_at: DateTime - Timestamp when the conversation was last updated

**Relationships:**
- One-to-many with Message (one conversation has many messages)
- Many-to-one with User (many conversations belong to one user)

**Validation:**
- user_id must reference an existing user
- created_at and updated_at are automatically managed by the system

### Message
Represents a single message in a conversation, either from the user or the assistant.

**Fields:**
- id: UUID (Primary Key) - Unique identifier for the message
- conversation_id: UUID (Foreign Key) - Reference to the conversation this message belongs to
- user_id: String (Foreign Key) - Reference to the user who sent the message
- role: String (Enum) - Either 'user' or 'assistant' indicating the sender
- content: Text - The actual message content
- created_at: DateTime - Timestamp when the message was created

**Relationships:**
- Many-to-one with Conversation (many messages belong to one conversation)
- Many-to-one with User (many messages belong to one user)

**Validation:**
- conversation_id must reference an existing conversation
- user_id must reference an existing user
- role must be either 'user' or 'assistant'
- content cannot be empty
- created_at is automatically managed by the system

### ConversationContext (Runtime Model)
Represents the contextual data assembled for an AI agent request.

**Fields:**
- conversation_id: UUID - Identifier for the conversation
- user_messages: List[Message] - Recent user messages in the conversation
- assistant_messages: List[Message] - Recent assistant messages in the conversation
- all_messages: List[Message] - Chronologically ordered list of all messages in context window

**Validation:**
- All referenced messages must belong to the same conversation
- Message count should be within OpenAI token limits (recommended max 20)

## State Transitions

### Conversation States
- **Active**: New conversation created, ready to receive messages
- **Inactive**: Conversation hasn't received messages for extended period (not actively managed by system)

### Message States
- **Pending**: Message received but not yet processed by AI agent (only applies to user messages)
- **Processed**: Message processed and response generated (only applies to user messages)
- **Generated**: Assistant message created as response to user input (only applies to assistant messages)

## Indexes

### Required Indexes
1. **messages.conversation_id_idx**: Index on conversation_id for efficient conversation retrieval
2. **messages.user_id_idx**: Index on user_id for efficient user-based queries
3. **messages.created_at_idx**: Index on created_at for chronological ordering
4. **conversations.user_id_idx**: Index on user_id for efficient user-based queries
5. **conversations.updated_at_idx**: Index on updated_at for conversation ordering

### Composite Indexes
1. **messages.conversation_created_idx**: Composite index on (conversation_id, created_at) for efficient chronological retrieval of conversation messages

## Validation Rules

### Business Logic Validation
1. A user cannot access messages from conversations they don't own
2. Only one active conversation per user at a time (if using single active conversation model)
3. Message content must be properly sanitized to prevent injection attacks
4. Conversation history length should be bounded to prevent token overflow

### Data Integrity Validation
1. Foreign key constraints must be enforced at database level
2. Required fields cannot be null
3. Role field must have valid values ('user', 'assistant')
4. Timestamps are immutable after creation (except updated_at in Conversation)

## Access Patterns

### Common Queries
1. **Get conversation history**: Retrieve last N messages for a conversation, ordered by created_at descending
2. **Create message**: Insert a new message associated with a specific conversation and user
3. **Get user conversations**: List all conversations for a specific user, ordered by updated_at
4. **Validate ownership**: Verify that a user owns a specific conversation

### Performance Considerations
1. Limit conversation history queries to last 20 messages to prevent token overflow
2. Use cursor-based pagination for conversations listing
3. Batch insert operations when saving multiple messages
4. Implement proper connection pooling for database operations

## Relationship Constraints

### Referential Integrity
- If a user is deleted, their conversations should be soft-deleted or anonymized
- If a conversation is deleted, all associated messages should be deleted
- Cascade delete operations should be handled carefully to maintain data consistency

### Data Lifecycle
- Messages are immutable once created (no updates allowed)
- Conversations may have their updated_at field modified when new messages are added
- Historical data should be preserved according to retention policy
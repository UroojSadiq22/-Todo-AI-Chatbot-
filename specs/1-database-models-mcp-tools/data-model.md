# Data Model: Database Models & MCP Tools Foundation

## Entities

### Conversation
Represents a user's conversation thread
- **id**: INTEGER (Primary Key, Auto-increment)
- **user_id**: STRING (Foreign Key to users.id, required)
- **created_at**: TIMESTAMP (required, defaults to now)
- **updated_at**: TIMESTAMP (required, defaults to now)

**Relationships**:
- One-to-many with Messages (conversation has many messages)
- Many-to-one with Users (belongs to one user)

### Message
Represents individual messages within a conversation
- **id**: INTEGER (Primary Key, Auto-increment)
- **conversation_id**: INTEGER (Foreign Key to conversations.id, required)
- **user_id**: STRING (Foreign Key to users.id, required)
- **role**: STRING (required, max length 20, values: 'user', 'assistant')
- **content**: TEXT (required)
- **created_at**: TIMESTAMP (required, defaults to now)

**Relationships**:
- Many-to-one with Conversations (belongs to one conversation)
- Many-to-one with Users (belongs to one user)

### Task (Existing)
Represents user's todo items (existing table, referenced for MCP tools)
- **id**: INTEGER (Primary Key, Auto-increment)
- **user_id**: STRING (Foreign Key to users.id, required)
- **title**: STRING (required)
- **description**: TEXT (optional)
- **status**: STRING (required, default 'pending')
- **created_at**: TIMESTAMP (required, defaults to now)
- **updated_at**: TIMESTAMP (required, defaults to now)

**Validation Rules**:
- All timestamps must be in ISO format
- Role in messages must be either 'user' or 'assistant'
- User_id must exist in users table
- Conversation_id must exist in conversations table
- Task user_id must match authenticated user for operations

## State Transitions

### Task Status
- **Initial**: 'pending'
- **Transition**: 'pending' → 'completed' via complete_task tool
- **Constraints**: Cannot transition from 'completed' back to 'pending' without update_tool

## Indexes

### Conversation Table
- Index on user_id for efficient user-specific queries
- Index on created_at for chronological ordering

### Message Table
- Index on conversation_id for efficient conversation retrieval
- Index on user_id for security validation
- Index on created_at for chronological ordering

### Task Table (Existing)
- Index on user_id for efficient user-specific queries
- Index on status for filtered queries
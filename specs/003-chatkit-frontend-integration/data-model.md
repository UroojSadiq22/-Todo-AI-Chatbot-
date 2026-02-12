# Data Model: OpenAI ChatKit Frontend Integration

**Feature**: 003-chatkit-frontend-integration
**Date**: 2026-02-09
**Status**: Draft

## Overview

This document defines the data structures and interfaces used in the ChatKit frontend integration. The frontend primarily consumes data from existing backend APIs and manages local UI state. No new database entities are created as part of this feature.

## Frontend Type Definitions

### 1. Chat Message

Represents a single message in the conversation (user or assistant).

**TypeScript Interface**:
```typescript
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string; // ISO 8601 format
}
```

**Field Descriptions**:
- `role`: Identifies the sender - either 'user' (human) or 'assistant' (AI)
- `content`: The actual message text content
- `timestamp`: When the message was created, in ISO 8601 format

**Validation Rules**:
- `role`: Must be exactly 'user' or 'assistant'
- `content`: Required, non-empty string, max length 5000 characters
- `timestamp`: Must be valid ISO 8601 datetime string

**State Transitions**: Messages are immutable once created

---

### 2. Conversation

Represents conversation metadata returned from backend.

**TypeScript Interface**:
```typescript
interface Conversation {
  id: string;
  user_id: string;
  created_at: string; // ISO 8601 format
  updated_at: string; // ISO 8601 format
}
```

**Field Descriptions**:
- `id`: Unique conversation identifier (UUID)
- `user_id`: ID of the user who owns the conversation
- `created_at`: When the conversation was created
- `updated_at`: When the conversation was last modified

**Validation Rules**:
- `id`: Required, non-empty string (UUID format)
- `user_id`: Required, non-empty string
- `created_at`, `updated_at`: Valid ISO 8601 datetime strings

---

### 3. Tool Call

Represents an MCP tool invocation by the AI assistant.

**TypeScript Interface**:
```typescript
interface ToolCall {
  name: string;
  arguments: Record<string, any>;
  result?: Record<string, any>;
}
```

**Field Descriptions**:
- `name`: Name of the MCP tool that was called (e.g., 'add_task', 'list_tasks')
- `arguments`: Input parameters passed to the tool
- `result`: Optional output returned by the tool

**Validation Rules**:
- `name`: Required, must match one of the 5 MCP tools (add_task, list_tasks, complete_task, update_task, delete_task)
- `arguments`: Required object, structure depends on tool
- `result`: Optional object

---

### 4. API Request/Response Models

#### Send Message Request

**TypeScript Interface**:
```typescript
interface SendMessageRequest {
  message: string;
  conversation_id?: string;
}
```

**Field Descriptions**:
- `message`: The user's message text
- `conversation_id`: Optional ID of existing conversation; omit to start new conversation

**Validation Rules**:
- `message`: Required, non-empty after trimming whitespace, max 5000 characters
- `conversation_id`: Optional string (UUID format if provided)

#### Send Message Response

**TypeScript Interface**:
```typescript
interface SendMessageResponse {
  conversation_id: string;
  response: string;
  tool_calls: ToolCall[];
}
```

**Field Descriptions**:
- `conversation_id`: ID of the conversation (new or existing)
- `response`: The AI assistant's text response
- `tool_calls`: Array of tools that were called during processing

**Validation Rules**:
- `conversation_id`: Required, non-empty string (UUID)
- `response`: Required, non-empty string
- `tool_calls`: Required array (may be empty)

---

### 5. Chat Error

Represents error states in the chat interface.

**TypeScript Enum & Interface**:
```typescript
enum ChatErrorType {
  AUTHENTICATION = 'authentication',
  NETWORK = 'network',
  RATE_LIMIT = 'rate_limit',
  SERVER_ERROR = 'server_error',
  VALIDATION = 'validation',
  TIMEOUT = 'timeout',
}

interface ChatError {
  type: ChatErrorType;
  message: string;
  details?: any;
  retryable: boolean;
}
```

**Field Descriptions**:
- `type`: Category of error for appropriate handling
- `message`: User-friendly error message to display
- `details`: Optional additional error information for debugging
- `retryable`: Whether the operation can be retried

**Error Type Mapping**:
- `AUTHENTICATION`: 401/403 HTTP errors → redirect to login
- `NETWORK`: No internet connection → show reconnect UI
- `RATE_LIMIT`: 429 HTTP error → show wait message
- `SERVER_ERROR`: 500/502/503 errors → show retry option
- `VALIDATION`: 422 HTTP error → show field-specific errors
- `TIMEOUT`: Request took too long → show retry option

---

### 6. Chat State

Local component state for managing chat UI.

**TypeScript Interface**:
```typescript
interface ChatState {
  messages: ChatMessage[];
  conversationId: string | null;
  isLoading: boolean;
  error: ChatError | null;
  inputValue: string;
}
```

**Field Descriptions**:
- `messages`: Array of all messages in current conversation
- `conversationId`: Current conversation ID or null for new conversation
- `isLoading`: Whether a message is currently being sent/received
- `error`: Current error state or null if no error
- `inputValue`: Current value of the message input field

**State Transitions**:
1. **Initial**: `{ messages: [], conversationId: null, isLoading: false, error: null, inputValue: '' }`
2. **Sending**: `isLoading: true`, user message appended to `messages`
3. **Success**: `isLoading: false`, assistant message appended, `conversationId` set, `inputValue` cleared
4. **Error**: `isLoading: false`, `error` set, optionally remove last user message

---

### 7. Authentication Context

User authentication data from Better Auth.

**TypeScript Interface**:
```typescript
interface AuthUser {
  id: string;
  email?: string;
  name?: string;
}

interface AuthContext {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

**Field Descriptions**:
- `user`: Current authenticated user or null if not logged in
- `token`: JWT token for API authentication or null
- `isAuthenticated`: Boolean flag for quick auth check
- `isLoading`: Whether auth state is still being determined

**Validation Rules**:
- `user.id`: Required when user is present
- `token`: Required when isAuthenticated is true
- `isAuthenticated`: Must be true if user and token are present

---

## Data Flow

### Message Send Flow

```
User types message
    ↓
Frontend validates input (non-empty, max length)
    ↓
Create ChatMessage (role: 'user')
    ↓
Append to messages array (optimistic update)
    ↓
POST /api/{user_id}/chat with JWT token
    ↓
Backend processes with OpenAI + MCP tools
    ↓
Receive SendMessageResponse
    ↓
Create ChatMessage (role: 'assistant')
    ↓
Append to messages array
    ↓
Update conversationId if new
    ↓
Clear input field
```

### Conversation Load Flow

```
User navigates to /chat
    ↓
Check authentication (redirect if not authenticated)
    ↓
Check for conversationId in URL/localStorage
    ↓
If conversationId exists:
    GET /api/{user_id}/conversations/{conversation_id}/messages
    ↓
    Load ChatMessage[] into state
    ↓
Otherwise: Start with empty messages array
```

### Error Handling Flow

```
API request fails
    ↓
Parse error response (status code, body)
    ↓
Create ChatError with appropriate type
    ↓
Update error state
    ↓
Display user-friendly error message
    ↓
If retryable: Show retry button
    ↓
If authentication error: Redirect to login
```

---

## Persistence Strategy

### Backend (Source of Truth)
- All conversations and messages persisted in Neon database
- Managed by existing `ConversationService` and `Message` model
- No changes required to backend persistence layer

### Frontend (Transient State)
- Messages stored in React component state (volatile)
- Reloaded from backend on page refresh
- **Optional Enhancement**: LocalStorage cache for last 100 messages per conversation

### Cache Strategy (Optional)
```typescript
// LocalStorage key pattern
chat_conversations = {
  "conv-uuid-1": {
    messages: ChatMessage[],
    lastUpdated: "2026-02-09T12:00:00Z"
  }
}

// Cache invalidation
- Clear on logout
- Refresh from backend if lastUpdated > 1 hour old
- Max 100 messages per conversation in cache
```

---

## Relationships

```
User (1) ──── (many) Conversation
Conversation (1) ──── (many) ChatMessage
ChatMessage (0..1) ──── (many) ToolCall (embedded in response)

Frontend manages:
- ChatMessage[] for display
- Current Conversation ID
- Chat UI state

Backend manages:
- Conversation persistence
- Message history
- User isolation
```

---

## Validation Summary

### Client-Side Validation
- Message content: non-empty, max 5000 characters, trim whitespace
- Input sanitization: remove control characters, prevent script injection
- Rate limiting: max 10 messages per minute (client-side guard)

### Server-Side Validation (Existing)
- JWT token validation on every request
- User ID authorization check
- Message sanitization and length limits
- Database transaction integrity

---

## Notes

1. **No New Database Entities**: This feature uses existing backend models (Conversation, Message) without modifications
2. **Frontend-Only Data Models**: All TypeScript interfaces are for frontend type safety and do not create new backend schemas
3. **Backward Compatibility**: All data structures align with existing backend API contracts
4. **Security**: All sensitive data (JWT tokens) stored in memory only, never persisted to localStorage
5. **Scalability**: Message arrays kept bounded (last 50-100 messages) to prevent memory issues with very long conversations

# API Contract: ChatKit Frontend Integration

**Feature**: 003-chatkit-frontend-integration
**Date**: 2026-02-09
**Backend Base URL**: `http://localhost:8000` (dev) / `https://api.yourdomain.com` (prod)

## Overview

This document specifies the API contract between the Next.js frontend and FastAPI backend for the chat functionality. The backend APIs already exist and are implemented in `backend/src/api/chat.py`. This contract serves as the frontend integration specification.

---

## Authentication

**All endpoints require JWT authentication via Better Auth.**

### Request Header Format
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Authentication Flow
1. User logs in via Better Auth
2. Frontend obtains JWT token from auth session
3. Token included in all API requests via Authorization header
4. Backend validates token and extracts user ID
5. Backend enforces user isolation (users can only access their own data)

### Error Responses
- `401 Unauthorized`: Missing or invalid JWT token → Redirect to login
- `403 Forbidden`: User attempting to access another user's data → Show error message

---

## Endpoint 1: Send Chat Message

**Purpose**: Send a user message and receive an AI-generated response.

### Request

```http
POST /api/{user_id}/chat
```

**Path Parameters**:
- `user_id` (string, required): The authenticated user's ID (must match JWT token)

**Request Body**:
```json
{
  "message": "Add a task to buy groceries",
  "conversation_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Body Schema**:
- `message` (string, required): User's message text
  - Min length: 1 character (after trimming)
  - Max length: 5000 characters
  - Sanitization: Applied server-side (removes control characters, null bytes)
- `conversation_id` (string, optional): UUID of existing conversation
  - If omitted: Creates new conversation
  - If provided: Continues existing conversation

### Response

**Success (200 OK)**:
```json
{
  "conversation_id": "550e8400-e29b-41d4-a716-446655440000",
  "response": "I've added 'Buy groceries' to your task list. Is there anything else you'd like me to help with?",
  "tool_calls": [
    {
      "name": "add_task",
      "arguments": {
        "user_id": "user-123",
        "title": "Buy groceries",
        "description": null
      },
      "result": {
        "success": true,
        "task_id": 42,
        "message": "Task created successfully"
      }
    }
  ]
}
```

**Response Schema**:
- `conversation_id` (string): UUID of the conversation (new or existing)
- `response` (string): AI assistant's text response to display to user
- `tool_calls` (array): List of MCP tools that were invoked
  - `name` (string): Tool name (add_task, list_tasks, complete_task, update_task, delete_task)
  - `arguments` (object): Input parameters passed to the tool
  - `result` (object, nullable): Output returned by the tool

### Error Responses

**400 Bad Request** - Invalid input:
```json
{
  "detail": "Message cannot be empty"
}
```

**401 Unauthorized** - Missing/invalid token:
```json
{
  "detail": "Could not validate credentials"
}
```

**403 Forbidden** - User ID mismatch:
```json
{
  "detail": "You can only access your own conversations"
}
```

**429 Too Many Requests** - Rate limit exceeded:
```json
{
  "detail": "Rate limit exceeded. Please wait before sending another message."
}
```

**500 Internal Server Error** - Server failure:
```json
{
  "detail": "Failed to process chat message: <error_details>"
}
```

**502 Bad Gateway** - MCP server unavailable:
```json
{
  "detail": "MCP tool add_task failed: Connection refused"
}
```

**504 Gateway Timeout** - Request timeout:
```json
{
  "detail": "MCP tool list_tasks timed out"
}
```

### Example Usage (TypeScript)

```typescript
// Using Axios with interceptors
import apiClient from '@/services/api';

async function sendMessage(userId: string, message: string, conversationId?: string) {
  try {
    const response = await apiClient.post(`/api/${userId}/chat`, {
      message,
      conversation_id: conversationId,
    });
    return response.data; // SendMessageResponse
  } catch (error) {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    throw error;
  }
}
```

### Performance Expectations
- **Latency**: < 5 seconds for typical requests
- **Timeout**: 30 seconds server-side timeout
- **Rate Limit**: 60 requests per minute per user (backend enforced)

---

## Endpoint 2: Get Conversation History (Future Enhancement)

**Purpose**: Retrieve message history for an existing conversation.

### Request

```http
GET /api/{user_id}/conversations/{conversation_id}/messages?limit=50&offset=0
```

**Path Parameters**:
- `user_id` (string, required): The authenticated user's ID
- `conversation_id` (string, required): UUID of the conversation

**Query Parameters**:
- `limit` (integer, optional): Max number of messages to return (default: 50, max: 100)
- `offset` (integer, optional): Number of messages to skip for pagination (default: 0)

### Response

**Success (200 OK)**:
```json
{
  "messages": [
    {
      "id": 1,
      "conversation_id": "550e8400-e29b-41d4-a716-446655440000",
      "user_id": "user-123",
      "role": "user",
      "content": "Show me my tasks",
      "created_at": "2026-02-09T10:00:00Z"
    },
    {
      "id": 2,
      "conversation_id": "550e8400-e29b-41d4-a716-446655440000",
      "user_id": "user-123",
      "role": "assistant",
      "content": "Here are your tasks: ...",
      "created_at": "2026-02-09T10:00:02Z"
    }
  ],
  "total": 24,
  "limit": 50,
  "offset": 0
}
```

**Response Schema**:
- `messages` (array): List of messages in chronological order (oldest first)
  - `id` (integer): Message ID
  - `conversation_id` (string): UUID of the conversation
  - `user_id` (string): User who owns the message
  - `role` (string): "user" or "assistant"
  - `content` (string): Message text
  - `created_at` (string): ISO 8601 timestamp
- `total` (integer): Total number of messages in the conversation
- `limit` (integer): Requested limit
- `offset` (integer): Requested offset

### Error Responses

**401/403**: Same as Endpoint 1
**404 Not Found**: Conversation doesn't exist or doesn't belong to user

### Example Usage

```typescript
async function loadConversationHistory(userId: string, conversationId: string) {
  const response = await apiClient.get(
    `/api/${userId}/conversations/${conversationId}/messages`,
    { params: { limit: 50, offset: 0 } }
  );
  return response.data.messages.map(msg => ({
    role: msg.role,
    content: msg.content,
    timestamp: msg.created_at,
  }));
}
```

---

## Endpoint 3: List User Conversations (Future Enhancement)

**Purpose**: Get all conversations for the authenticated user.

### Request

```http
GET /api/{user_id}/conversations?limit=20&offset=0
```

**Path Parameters**:
- `user_id` (string, required): The authenticated user's ID

**Query Parameters**:
- `limit` (integer, optional): Max conversations to return (default: 20, max: 50)
- `offset` (integer, optional): Pagination offset (default: 0)

### Response

**Success (200 OK)**:
```json
{
  "conversations": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "user_id": "user-123",
      "created_at": "2026-02-09T10:00:00Z",
      "updated_at": "2026-02-09T10:30:00Z",
      "message_count": 12
    }
  ],
  "total": 5,
  "limit": 20,
  "offset": 0
}
```

---

## CORS Configuration

**Backend CORS Settings** (required for frontend to make requests):

```python
# backend/src/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js dev
        "https://yourdomain.com",  # Production
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
```

---

## Rate Limiting

### Backend Rate Limits (per user)
- **Chat endpoint**: 60 requests per minute
- **History endpoint**: 120 requests per minute

### Frontend Rate Limiting Strategy
Implement client-side rate limiting to provide immediate feedback:

```typescript
class RateLimiter {
  private requests: number[] = [];

  canMakeRequest(maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    this.requests = this.requests.filter(t => now - t < windowMs);

    if (this.requests.length >= maxRequests) {
      return false;
    }

    this.requests.push(now);
    return true;
  }
}

// Usage: 10 messages per minute
const rateLimiter = new RateLimiter();
if (!rateLimiter.canMakeRequest(10, 60000)) {
  showError("Too many messages. Please wait a moment.");
  return;
}
```

---

## WebSocket Support (Not in MVP)

For future enhancement, consider WebSocket connection for real-time streaming responses:

```
WS /api/{user_id}/chat/stream
```

This would enable:
- Character-by-character streaming of AI responses
- Real-time typing indicators
- Lower perceived latency

**Not included in Phase 3 MVP** - HTTP polling sufficient for initial release.

---

## Security Considerations

### Input Sanitization
**Server-side** (already implemented in `backend/src/api/chat.py`):
- Remove null bytes and control characters
- Trim whitespace
- Enforce max length (5000 characters)

**Client-side** (to implement):
- Trim whitespace before sending
- Validate non-empty message
- Prevent XSS in message display (use React's built-in escaping)

### Authentication Security
- JWT tokens stored in memory only (never localStorage for security)
- Token expiration handled gracefully (redirect to login on 401)
- User ID in URL path validated against JWT claims server-side

### Rate Limiting
- Backend enforces per-user rate limits
- Frontend provides immediate feedback before hitting backend limits
- Exponential backoff on retries for 429 errors

---

## Error Handling Strategy

### Frontend Error Handling

```typescript
function parseApiError(error: AxiosError): ChatError {
  const status = error.response?.status;
  const detail = error.response?.data?.detail;

  switch (status) {
    case 401:
    case 403:
      return { type: 'AUTHENTICATION', message: 'Please log in', retryable: false };
    case 429:
      return { type: 'RATE_LIMIT', message: 'Too many requests', retryable: true };
    case 500:
    case 502:
    case 503:
      return { type: 'SERVER_ERROR', message: 'Server error', retryable: true };
    default:
      return { type: 'NETWORK', message: detail || 'Unknown error', retryable: false };
  }
}
```

### Retry Strategy
- **Retryable errors**: 429, 500, 502, 503, network errors
- **Non-retryable errors**: 400, 401, 403, 422
- **Retry logic**: Exponential backoff (1s, 2s, 4s)
- **Max retries**: 3 attempts

---

## Testing Contract Compliance

### Contract Tests (Frontend)

```typescript
describe('Chat API Contract', () => {
  it('should send message with correct schema', async () => {
    const request = {
      message: 'Test message',
      conversation_id: 'uuid-123',
    };

    const response = await sendMessage('user-123', request);

    expect(response).toHaveProperty('conversation_id');
    expect(response).toHaveProperty('response');
    expect(response).toHaveProperty('tool_calls');
    expect(Array.isArray(response.tool_calls)).toBe(true);
  });

  it('should handle 401 error correctly', async () => {
    // Mock 401 response
    mockAxios.onPost('/api/user-123/chat').reply(401);

    await expect(sendMessage('user-123', { message: 'test' }))
      .rejects.toThrow();

    // Verify redirect to login was triggered
    expect(window.location.href).toBe('/login');
  });
});
```

---

## Summary

### Endpoints Used by Frontend
1. ✅ **POST /api/{user_id}/chat** - Send message, get AI response (MVP)
2. 🔮 **GET /api/{user_id}/conversations/{conversation_id}/messages** - Load history (Future)
3. 🔮 **GET /api/{user_id}/conversations** - List conversations (Future)

### Authentication
- **Method**: JWT Bearer token in Authorization header
- **Source**: Better Auth session
- **Validation**: Backend validates on every request

### Error Handling
- **Client-side validation**: Input length, empty check
- **Server-side validation**: JWT, user isolation, sanitization
- **Retry strategy**: Exponential backoff for transient errors
- **User feedback**: Clear error messages with retry options

### Performance
- **Target latency**: < 5 seconds for chat responses
- **Rate limits**: 60 req/min per user (chat), 120 req/min (history)
- **Timeout**: 30 seconds server-side

This contract defines the integration layer between the Next.js frontend and existing FastAPI backend for the ChatKit feature.

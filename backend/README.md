# Todo App Backend - OpenAI Agents SDK with MCP Tools Integration

This backend implements a stateless chat endpoint that integrates OpenAI Agents SDK with MCP tools for conversational task management.

## Features

- **Conversational Task Management**: Natural language interface for managing tasks
- **OpenAI Agents SDK Integration**: Intelligent AI-powered task operations
- **MCP Tools**: Standardized tool calling for backend operations
- **Stateless Architecture**: All state stored in database, server restarts preserve data
- **JWT Authentication**: Secure user authentication and authorization
- **Type-Safe**: Full type hints throughout the codebase

## Prerequisites

- Python 3.11+
- PostgreSQL database (Neon DB)
- OpenAI API key
- MCP server running (from Part 1)

## Setup

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Set environment variables**:
   Create a `.env` file in the backend directory:
   ```
   OPENAI_API_KEY=your_openai_api_key
   DATABASE_URL=your_neondb_connection_string
   JWT_SECRET=your_jwt_secret
   MCP_SERVER_URL=http://localhost:5000
   ```

3. **Run the server**:
   ```bash
   uvicorn src.main:app --reload --port 8000
   ```

## API Endpoints

### Chat Endpoint

**POST** `/api/{user_id}/chat`

Send a chat message to the AI assistant for task management.

**Headers**:
- `Authorization: Bearer <JWT_TOKEN>`
- `Content-Type: application/json`

**Request Body**:
```json
{
  "message": "Add a task to buy groceries",
  "conversation_id": "optional-conversation-id"
}
```

**Response**:
```json
{
  "conversation_id": "conv_abc123",
  "response": "I've added the task 'buy groceries' to your list.",
  "tool_calls": [
    {
      "name": "add_task",
      "arguments": {
        "user_id": "user123",
        "title": "buy groceries"
      },
      "result": {
        "task_id": 1,
        "status": "created"
      }
    }
  ]
}
```

## Example Usage

### Using curl

```bash
# Create a task
curl -X POST "http://localhost:8000/api/user123/chat" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Add a task to buy groceries"}'

# List tasks
curl -X POST "http://localhost:8000/api/user123/chat" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Show me my tasks"}'

# Complete a task
curl -X POST "http://localhost:8000/api/user123/chat" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Mark task 1 as done"}'
```

### Using Python

```python
import requests

url = "http://localhost:8000/api/user123/chat"
headers = {
    "Authorization": "Bearer YOUR_JWT_TOKEN",
    "Content-Type": "application/json"
}

# Create a task
response = requests.post(url, headers=headers, json={
    "message": "Add a task to buy groceries"
})
print(response.json())
```

## Available MCP Tools

The AI assistant has access to the following MCP tools:

1. **add_task**: Create a new task
2. **list_tasks**: List all tasks (with optional status filter)
3. **complete_task**: Mark a task as completed
4. **update_task**: Update a task's title or description
5. **delete_task**: Remove a task

## Architecture

### Project Structure

```
backend/
├── src/
│   ├── models/           # SQLModel database models
│   │   ├── conversation.py
│   │   └── message.py
│   ├── services/         # Business logic services
│   │   └── conversation_service.py
│   ├── api/              # FastAPI routes
│   │   └── chat.py
│   ├── auth/             # Authentication middleware
│   ├── database/         # Database session management
│   └── main.py           # Application entry point
├── tests/                # Unit and integration tests
└── requirements.txt      # Python dependencies
```

### Request Flow

```
User → ChatKit → POST /api/{user_id}/chat
  → Validate JWT
  → Fetch history from DB
  → Save user message
  → OpenAI Agent + MCP tools
  → Save assistant message
  → Return response
  → Discard state (stateless!)
```

## Database Models

### Conversation
- `id`: UUID (Primary Key)
- `user_id`: String (Foreign Key)
- `created_at`: DateTime
- `updated_at`: DateTime

### Message
- `id`: UUID (Primary Key)
- `conversation_id`: UUID (Foreign Key)
- `user_id`: String (Foreign Key)
- `role`: String ('user' or 'assistant')
- `content`: Text
- `created_at`: DateTime

## Security

- **JWT Authentication**: Required on all chat endpoints
- **User Isolation**: Users can only access their own conversations
- **Input Sanitization**: All user input is sanitized to prevent injection attacks
- **Parameterized Queries**: SQL injection prevention
- **Error Handling**: Graceful error handling with appropriate HTTP status codes

## Development

### Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=src

# Run specific test file
pytest tests/unit/test_conversation.py
```

### Type Checking

```bash
mypy src/
```

### Code Style

Follow PEP 8 and use type hints throughout the codebase.

## Troubleshooting

### MCP Server Unavailable
- Ensure the MCP server from Part 1 is running
- Check the `MCP_SERVER_URL` environment variable
- Verify network connectivity

### OpenAI API Errors
- Confirm API key is valid and has sufficient quota
- Check for rate limiting issues
- Verify model availability

### Database Connection Issues
- Verify `DATABASE_URL` is correctly formatted
- Check database service is running
- Confirm proper network connectivity

### JWT Validation Failures
- Ensure JWT secret matches between services
- Verify token format and expiration
- Check user_id in path matches token

## Performance

- Response time target: <3 seconds for typical requests
- Conversation history limited to last 20 messages to prevent token overflow
- Database queries optimized with proper indexing
- Async/await patterns for non-blocking operations

## License

See LICENSE file for details.

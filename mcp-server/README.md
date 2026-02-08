# MCP Server - Todo App Phase 3

**Model Context Protocol (MCP) Server for AI-Powered Task Management**

This is a stateless MCP tool server that provides conversational task management capabilities through 5 MCP tools. The server exposes task operations (create, list, complete, update, delete) via the MCP protocol for AI agent integration.

## Architecture

- **Stateless**: Zero server memory between requests
- **Database-Driven**: All state persisted in Neon PostgreSQL
- **Security-First**: User ID validation on every tool call
- **Type-Safe**: Full type hinting and Pydantic validation
- **Protocol**: Official MCP SDK (Python)

## Prerequisites

- Python 3.11+
- Neon PostgreSQL database instance
- Backend API running (for database connection)

## Setup

### 1. Install Dependencies

```bash
cd mcp-server
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your database connection string
```

**Required Environment Variables**:

```bash
# Database Configuration
DATABASE_URL=postgresql+asyncpg://username:password@host:5432/database
# Example: postgresql+asyncpg://user:pass@localhost:5432/todo_app

# MCP Server Configuration
MCP_SERVER_PORT=5000
# Port number for the MCP server (default: 5000)

# Logging Configuration
LOG_LEVEL=INFO
# Options: DEBUG, INFO, WARNING, ERROR, CRITICAL (default: INFO)

# Environment
ENVIRONMENT=development
# Options: development, staging, production (default: development)
```

**Configuration Notes**:
- `DATABASE_URL` must use `postgresql+asyncpg://` scheme for async support
- Ensure the database user has CREATE, SELECT, INSERT, UPDATE, DELETE permissions
- For production, set `LOG_LEVEL=WARNING` to reduce log volume
- The `ENVIRONMENT` variable is informational and affects logging behavior

### 3. Run Database Migrations

Ensure the backend database has the required tables (users, tasks, conversations, messages).

## Running the Server

### Development

```bash
cd mcp-server
uvicorn src.main:app --reload --port 5000
```

### Production

```bash
cd mcp-server
gunicorn -w 4 -k uvicorn.workers.UvicornWorker src.main:app --bind 0.0.0.0:5000
```

## Available MCP Tools

### 1. add_task

Create a new task for the user.

**Parameters**:
- `user_id` (str): User's unique identifier
- `title` (str): Task title (required, 1-200 chars)
- `description` (str, optional): Task description (max 1000 chars)

**Response**:
```json
{
  "status": "success",
  "data": {
    "task_id": "uuid",
    "title": "Task title",
    "created_at": "2026-02-08T10:30:00"
  },
  "message": "Task 'Task title' created successfully"
}
```

### 2. list_tasks

Retrieve tasks for the user with optional status filtering.

**Parameters**:
- `user_id` (str): User's unique identifier
- `status` (str, optional): Filter by status ("pending" or "completed")

**Response**:
```json
{
  "status": "success",
  "data": {
    "tasks": [
      {
        "id": "uuid",
        "title": "Task title",
        "description": "Task description",
        "completed": false,
        "created_at": "2026-02-08T10:30:00"
      }
    ]
  },
  "message": "Found 1 task(s)"
}
```

### 3. complete_task

Mark a task as completed.

**Parameters**:
- `user_id` (str): User's unique identifier
- `task_id` (int): Task identifier

**Response**:
```json
{
  "status": "success",
  "data": {
    "task_id": "uuid",
    "updated_at": "2026-02-08T10:35:00"
  },
  "message": "Task marked as completed"
}
```

### 4. update_task

Update task details (title and/or description).

**Parameters**:
- `user_id` (str): User's unique identifier
- `task_id` (int): Task identifier
- `title` (str, optional): New task title
- `description` (str, optional): New task description

**Response**:
```json
{
  "status": "success",
  "data": {
    "task_id": "uuid",
    "updated_fields": ["title", "description"]
  },
  "message": "Task updated successfully"
}
```

### 5. delete_task

Remove a task permanently.

**Parameters**:
- `user_id` (str): User's unique identifier
- `task_id` (int): Task identifier

**Response**:
```json
{
  "status": "success",
  "data": {
    "task_id": "uuid"
  },
  "message": "Task deleted successfully"
}
```

## Testing

### Manual Testing (Direct HTTP Calls)

The MCP server can be tested directly without an AI agent:

```bash
# Test add_task - Create a new task
curl -X POST http://localhost:5000/tools/add_task \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test_user", "title": "Buy groceries", "description": "Milk and eggs"}'

# Expected Response:
# {
#   "status": "success",
#   "data": {
#     "task_id": "uuid-here",
#     "title": "Buy groceries",
#     "created_at": "2026-02-08T10:30:00"
#   },
#   "message": "Task 'Buy groceries' created successfully"
# }

# Test list_tasks - Get all tasks
curl -X POST http://localhost:5000/tools/list_tasks \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test_user"}'

# Test list_tasks with status filter
curl -X POST http://localhost:5000/tools/list_tasks \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test_user", "status": "pending"}'

# Test complete_task - Mark task as done
curl -X POST http://localhost:5000/tools/complete_task \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test_user", "task_id": 123}'

# Test update_task - Modify task details
curl -X POST http://localhost:5000/tools/update_task \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test_user", "task_id": 123, "title": "Buy groceries and supplies", "description": "Milk, eggs, and bread"}'

# Test delete_task - Remove a task
curl -X POST http://localhost:5000/tools/delete_task \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test_user", "task_id": 123}'

# Test error handling - Invalid user
curl -X POST http://localhost:5000/tools/add_task \
  -H "Content-Type: application/json" \
  -d '{"user_id": "invalid_user", "title": "Test"}'

# Expected Error Response:
# {
#   "status": "error",
#   "data": {"error_code": 404},
#   "message": "User invalid_user not found"
# }
```

### Unit Tests

```bash
pytest tests/unit/ -v
```

### Integration Tests

```bash
pytest tests/integration/ -v
```

## Security

- **User Validation**: All tools validate user_id exists in the database
- **Ownership Verification**: Operations on existing tasks verify user ownership
- **Query Filtering**: All database queries filtered by user_id
- **Parameterized Queries**: SQLModel binding prevents SQL injection
- **No Cross-User Access**: Users cannot access or modify other users' tasks

## Response Format

All MCP tools return structured responses:

```json
{
  "status": "success" | "error",
  "data": {
    // Tool-specific payload
  },
  "message": "Human-readable status message"
}
```

## Error Handling

Tools return appropriate error responses:

```json
{
  "status": "error",
  "data": {
    "error_code": 404
  },
  "message": "Task not found or access denied"
}
```

## Project Structure

```
mcp-server/
├── src/
│   ├── main.py              # MCP server entry point
│   ├── tools/               # MCP tool implementations
│   │   ├── add_task.py
│   │   ├── list_tasks.py
│   │   ├── complete_task.py
│   │   ├── update_task.py
│   │   └── delete_task.py
│   ├── schemas/             # Pydantic schemas
│   │   └── tool_schemas.py
│   └── utils/               # Shared utilities
│       ├── db_utils.py
│       └── response_utils.py
└── tests/
    ├── unit/                # Unit tests with mocked DB
    └── integration/         # Integration tests with real DB
```

## Contributing

1. Follow PEP 8 style guidelines
2. Add type hints to all functions
3. Include docstrings for all tools
4. Validate user_id on all operations
5. Use parameterized queries only
6. Return structured responses
7. Add comprehensive error handling

## License

Part of the Todo App Phase 3 project.

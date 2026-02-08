# Quickstart: Database Models & MCP Tools Foundation

## Prerequisites

- Python 3.11+
- Neon PostgreSQL database instance
- FastAPI and SQLModel dependencies
- Official MCP SDK for Python

## Setup

### 1. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Configure database connection
DATABASE_URL=postgresql://username:password@neon-host/db-name
```

### 2. Install Dependencies
```bash
pip install fastapi sqlmodel python-mcp-sdk pytest uvicorn
```

### 3. Database Setup
```bash
# Create the new tables (conversations, messages)
# The existing users and tasks tables remain unchanged
```

## Running the MCP Server

### Development
```bash
# Start MCP server on port 5000
uvicorn mcp-server.src.main:app --reload --port 5000
```

### Production
```bash
# Run with gunicorn for production
gunicorn -w 4 -k uvicorn.workers.UvicornWorker mcp-server.src.main:app --bind 0.0.0.0:5000
```

## Testing

### Unit Tests
```bash
# Run unit tests for each MCP tool
pytest tests/unit/
```

### Integration Tests
```bash
# Run integration tests with real database
pytest tests/integration/
```

## Available MCP Tools

### 1. add_task
```python
# Creates a new task for the user
add_task(user_id: str, title: str, description: Optional[str] = None)
```

### 2. list_tasks
```python
# Lists tasks for the user with optional status filter
list_tasks(user_id: str, status: Optional[str] = None)
```

### 3. complete_task
```python
# Marks a task as completed
complete_task(user_id: str, task_id: int)
```

### 4. delete_task
```python
# Deletes a task
delete_task(user_id: str, task_id: int)
```

### 5. update_task
```python
# Updates task details
update_task(user_id: str, task_id: int, title: Optional[str] = None, description: Optional[str] = None)
```

## Architecture Overview

- **Stateless**: No server-side session memory between requests
- **Database-Driven**: All state stored in Neon PostgreSQL
- **Security**: User ID validation on every tool call
- **Type-Safe**: Full type hinting and Pydantic validation
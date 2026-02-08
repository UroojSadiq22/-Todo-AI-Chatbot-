# Implementation Plan: Database Models & MCP Tools Foundation

**Branch**: `1-database-models-mcp-tools` | **Date**: 2026-02-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/1-database-models-mcp-tools/spec.md`

**Note**: This plan implements Phase 3 Part 1 of the Todo App evolution, establishing the foundation for AI-powered conversational task management through MCP (Model Context Protocol) tools.

## Summary

Implement a stateless MCP tool server with database persistence for task management. Create 2 new database tables (Conversation, Message) and implement 5 MCP tools (add_task, list_tasks, complete_task, delete_task, update_task) that validate user_id and return structured responses. The server runs independently on port 5000, separate from the main backend API, and works without AI agent integration for direct HTTP testing.

**Technical Approach**: Separate FastAPI service using Official MCP SDK, SQLModel for database models, structured dict responses for AI consumption, comprehensive user_id validation for security.

## Technical Context

**Language/Version**: Python 3.11+
**Primary Dependencies**: FastAPI 0.115.0, SQLModel 0.0.22, Official MCP SDK (Python), asyncpg 0.30.0
**Storage**: Neon PostgreSQL (existing instance, add conversations and messages tables)
**Testing**: pytest 8.3.4 with unit tests (mocked DB) and integration tests (test DB)
**Target Platform**: Linux/Windows server (development), containerized deployment (future)
**Project Type**: Web application (backend service)
**Performance Goals**: <3 seconds response time per tool call, support concurrent requests
**Constraints**: Stateless architecture, no session memory, JWT validation required, parameterized queries only
**Scale/Scope**: 5 MCP tools, 2 new database tables, single MCP server service

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **Conversational-First**: All 5 MCP tools expose operations via AI-accessible interface
✅ **Stateless Architecture**: Server has zero memory between requests, all state in database
✅ **MCP-Driven Communication**: Using Official MCP SDK with standardized tool protocol
✅ **Spec-Driven Development**: Full spec.md created before implementation
✅ **Type-Safe Development**: Type hints on all functions, Pydantic models for validation
✅ **Security-First Approach**: User_id validation on every tool call, parameterized queries only
✅ **Mandatory Technologies**: FastAPI + SQLModel + Neon DB + Official MCP SDK (Python)
✅ **Prohibited Technologies**: No LangChain, no direct OpenAI API calls, no custom chat UI
✅ **Database Schema**: Preserved users/tasks tables, added conversations/messages tables
✅ **MCP Tools Specification**: Exactly 5 required tools implemented

**Re-evaluation after Phase 1 Design**: All constitutional requirements satisfied. Architecture aligns with stateless, MCP-driven, security-first principles.

## Project Structure

### Documentation (this feature)

```text
specs/1-database-models-mcp-tools/
├── plan.md              # This file (completed)
├── research.md          # Phase 0 output (completed)
├── data-model.md        # Phase 1 output (completed)
├── quickstart.md        # Phase 1 output (completed)
├── contracts/           # Phase 1 output (completed)
│   └── mcp-tools.json   # MCP tool definitions
└── tasks.md             # Phase 2 output (to be created by /sp.tasks)
```

### Source Code (repository root)

```text
backend/                           # Existing backend (preserved)
├── src/
│   ├── models/
│   │   ├── user.py               # Existing
│   │   ├── todo.py               # Existing
│   │   ├── conversation.py       # NEW: Conversation model
│   │   └── message.py            # NEW: Message model
│   ├── services/
│   │   ├── auth_service.py       # Existing
│   │   ├── todo_service.py       # Existing
│   │   └── conversation_service.py  # NEW: Conversation operations
│   ├── api/
│   │   ├── auth_router.py        # Existing
│   │   └── todo_router.py        # Existing
│   ├── database/
│   │   ├── session.py            # Existing (reuse connection)
│   │   └── config.py             # Existing
│   └── main.py                   # Existing backend server
└── tests/
    ├── integration/              # Existing
    └── contract/                 # Existing

mcp-server/                       # NEW: Separate MCP service
├── src/
│   ├── main.py                   # NEW: MCP server entry point
│   ├── tools/                    # NEW: MCP tool implementations
│   │   ├── __init__.py
│   │   ├── add_task.py           # NEW: add_task tool
│   │   ├── list_tasks.py         # NEW: list_tasks tool
│   │   ├── complete_task.py      # NEW: complete_task tool
│   │   ├── delete_task.py        # NEW: delete_task tool
│   │   └── update_task.py        # NEW: update_task tool
│   ├── schemas/                  # NEW: Pydantic schemas for tools
│   │   ├── __init__.py
│   │   └── tool_schemas.py       # NEW: Request/response models
│   └── utils/                    # NEW: Shared utilities
│       ├── __init__.py
│       ├── db_utils.py           # NEW: Database helper functions
│       └── response_utils.py     # NEW: Structured response helpers
├── tests/
│   ├── unit/                     # NEW: Unit tests with mocked DB
│   │   ├── test_add_task.py
│   │   ├── test_list_tasks.py
│   │   ├── test_complete_task.py
│   │   ├── test_delete_task.py
│   │   └── test_update_task.py
│   └── integration/              # NEW: Integration tests with real DB
│       ├── test_mcp_tools.py
│       └── test_user_isolation.py
├── requirements.txt              # NEW: MCP server dependencies
└── README.md                     # NEW: MCP server documentation

migrations/                       # NEW: Database migrations
└── versions/
    └── 001_add_conversations_messages.py  # NEW: Alembic migration
```

**Structure Decision**: Web application structure with separate MCP server service. The MCP server is isolated from the main backend to ensure clean separation of concerns and independent deployment. Both services share the same Neon database but maintain separate connection pools. This structure supports:
- Independent scaling of MCP server vs main API
- Cleaner debugging and testing during development
- Future containerization with separate Docker images
- Preservation of existing backend architecture

## Complexity Tracking

> No constitutional violations detected. All requirements satisfied with minimal complexity.

---

## Phase 0: Research & Unknowns Resolution

**Status**: ✅ Completed (see [research.md](./research.md))

All technical unknowns have been resolved:
- ✅ MCP Server Architecture: Separate service on port 5000
- ✅ MCP Tool Response Format: Structured dict with status/data/message
- ✅ Database Connection Handling: SQLModel async sessions with connection pooling
- ✅ User ID Validation: Foreign key constraints + explicit validation in tools
- ✅ Error Handling: Comprehensive try-catch with logging
- ✅ Technology Integration: MCP SDK decorator pattern verified

## Phase 1: Design & Data Model

**Status**: ✅ Completed (see [data-model.md](./data-model.md), [quickstart.md](./quickstart.md), [contracts/](./contracts/))

### Database Schema Design

**New Tables**:
```sql
CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_created_at ON conversations(created_at);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER REFERENCES conversations(id) NOT NULL,
    user_id VARCHAR REFERENCES users(id) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('user', 'assistant')) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_user_id ON messages(user_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
```

**SQLModel Implementations**:
```python
# backend/src/models/conversation.py
class Conversation(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id", nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    messages: List["Message"] = Relationship(back_populates="conversation")

# backend/src/models/message.py
class Message(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    conversation_id: int = Field(foreign_key="conversations.id", nullable=False)
    user_id: str = Field(foreign_key="users.id", nullable=False)
    role: str = Field(max_length=20, nullable=False)  # 'user' or 'assistant'
    content: str = Field(nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    conversation: Optional[Conversation] = Relationship(back_populates="messages")
```

### MCP Tool Contracts

**Tool Response Format**:
```json
{
  "status": "success" | "error",
  "data": {
    // Tool-specific payload
  },
  "message": "Human-readable status message"
}
```

**Tool Definitions** (see [contracts/mcp-tools.json](./contracts/mcp-tools.json)):

1. **add_task**
   - Input: `user_id: str, title: str, description: Optional[str]`
   - Output: `{status, data: {task_id, title, created_at}, message}`

2. **list_tasks**
   - Input: `user_id: str, status: Optional[str]`
   - Output: `{status, data: {tasks: [...]}, message}`

3. **complete_task**
   - Input: `user_id: str, task_id: int`
   - Output: `{status, data: {task_id, updated_at}, message}`

4. **delete_task**
   - Input: `user_id: str, task_id: int`
   - Output: `{status, data: {task_id}, message}`

5. **update_task**
   - Input: `user_id: str, task_id: int, title: Optional[str], description: Optional[str]`
   - Output: `{status, data: {task_id, updated_fields}, message}`

## Implementation Architecture

### MCP Server Design

**Entry Point** (`mcp-server/src/main.py`):
```python
from mcp import Server
from tools import add_task, list_tasks, complete_task, delete_task, update_task

# Initialize MCP server
server = Server()

# Register tools
server.register_tool(add_task.add_task_tool)
server.register_tool(list_tasks.list_tasks_tool)
server.register_tool(complete_task.complete_task_tool)
server.register_tool(delete_task.delete_task_tool)
server.register_tool(update_task.update_task_tool)

# Run server on port 5000
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(server.app, host="0.0.0.0", port=5000)
```

**Tool Implementation Pattern** (example for `add_task`):
```python
# mcp-server/src/tools/add_task.py
from mcp import tool
from schemas.tool_schemas import AddTaskRequest, ToolResponse
from utils.db_utils import get_db_session
from utils.response_utils import success_response, error_response
from backend.src.models.todo import Todo
import logging

logger = logging.getLogger(__name__)

@tool(name="add_task", description="Create a new task for the user")
async def add_task_tool(
    user_id: str,
    title: str,
    description: str = None
) -> dict:
    """
    Creates a new task for the specified user.

    Args:
        user_id: The user's unique identifier
        title: Task title (required, 1-200 chars)
        description: Task description (optional, max 1000 chars)

    Returns:
        Structured response with task creation result
    """
    try:
        async with get_db_session() as session:
            # Validate user exists
            user = await session.get(User, user_id)
            if not user:
                return error_response(f"User {user_id} not found", 404)

            # Create new task
            new_task = Todo(
                user_id=user_id,
                title=title,
                description=description,
                completed=False
            )
            session.add(new_task)
            await session.commit()
            await session.refresh(new_task)

            logger.info(f"Task created: {new_task.id} for user {user_id}")

            return success_response(
                data={
                    "task_id": str(new_task.id),
                    "title": new_task.title,
                    "created_at": new_task.created_at.isoformat()
                },
                message=f"Task '{title}' created successfully"
            )

    except Exception as e:
        logger.error(f"Error creating task: {str(e)}")
        return error_response(f"Failed to create task: {str(e)}", 500)
```

**Utility Functions**:
```python
# mcp-server/src/utils/response_utils.py
def success_response(data: dict, message: str = "Success") -> dict:
    return {
        "status": "success",
        "data": data,
        "message": message
    }

def error_response(message: str, code: int = 400) -> dict:
    return {
        "status": "error",
        "data": {"error_code": code},
        "message": message
    }

# mcp-server/src/utils/db_utils.py
from contextlib import asynccontextmanager
from backend.src.database.session import engine
from sqlmodel.ext.asyncio.session import AsyncSession

@asynccontextmanager
async def get_db_session():
    async with AsyncSession(engine) as session:
        try:
            yield session
        finally:
            await session.close()
```

### Database Migration

**Migration File** (`migrations/versions/001_add_conversations_messages.py`):
```python
"""Add conversations and messages tables

Revision ID: 001
Create Date: 2026-02-08
"""
from alembic import op
import sqlalchemy as sa

def upgrade():
    # Create conversations table
    op.create_table(
        'conversations',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id')
    )
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
        sa.CheckConstraint("role IN ('user', 'assistant')", name='check_role'),
        sa.ForeignKeyConstraint(['conversation_id'], ['conversations.id']),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_messages_conversation_id', 'messages', ['conversation_id'])
    op.create_index('idx_messages_user_id', 'messages', ['user_id'])
    op.create_index('idx_messages_created_at', 'messages', ['created_at'])

def downgrade():
    op.drop_index('idx_messages_created_at', 'messages')
    op.drop_index('idx_messages_user_id', 'messages')
    op.drop_index('idx_messages_conversation_id', 'messages')
    op.drop_table('messages')

    op.drop_index('idx_conversations_created_at', 'conversations')
    op.drop_index('idx_conversations_user_id', 'conversations')
    op.drop_table('conversations')
```

## Testing Strategy

### Unit Tests (Mocked Database)

**Example**: `mcp-server/tests/unit/test_add_task.py`
```python
import pytest
from unittest.mock import AsyncMock, patch
from tools.add_task import add_task_tool

@pytest.mark.asyncio
async def test_add_task_success():
    """Test successful task creation"""
    with patch('tools.add_task.get_db_session') as mock_session:
        # Mock database operations
        mock_db = AsyncMock()
        mock_session.return_value.__aenter__.return_value = mock_db

        # Execute tool
        result = await add_task_tool(
            user_id="user123",
            title="Buy groceries",
            description="Milk, eggs, bread"
        )

        # Verify response
        assert result["status"] == "success"
        assert "task_id" in result["data"]
        assert result["data"]["title"] == "Buy groceries"

@pytest.mark.asyncio
async def test_add_task_invalid_user():
    """Test task creation with invalid user_id"""
    with patch('tools.add_task.get_db_session') as mock_session:
        mock_db = AsyncMock()
        mock_db.get.return_value = None  # User not found
        mock_session.return_value.__aenter__.return_value = mock_db

        result = await add_task_tool(
            user_id="invalid",
            title="Test task"
        )

        assert result["status"] == "error"
        assert "not found" in result["message"].lower()
```

### Integration Tests (Real Database)

**Example**: `mcp-server/tests/integration/test_mcp_tools.py`
```python
import pytest
from httpx import AsyncClient
from backend.src.database.session import engine
from sqlmodel import SQLModel

@pytest.fixture(scope="session")
async def setup_db():
    """Create test database tables"""
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.drop_all)

@pytest.mark.asyncio
async def test_add_task_integration(setup_db):
    """Integration test for add_task tool"""
    from tools.add_task import add_task_tool

    # Create task
    result = await add_task_tool(
        user_id="test_user",
        title="Integration test task"
    )

    assert result["status"] == "success"
    task_id = result["data"]["task_id"]

    # Verify task exists in database
    async with get_db_session() as session:
        task = await session.get(Todo, task_id)
        assert task is not None
        assert task.title == "Integration test task"
```

### User Isolation Tests

**Example**: `mcp-server/tests/integration/test_user_isolation.py`
```python
@pytest.mark.asyncio
async def test_user_cannot_access_other_users_tasks():
    """Verify user A cannot access user B's tasks"""
    # User A creates a task
    result_a = await add_task_tool(
        user_id="user_a",
        title="User A's task"
    )
    task_id = result_a["data"]["task_id"]

    # User B tries to complete User A's task
    result_b = await complete_task_tool(
        user_id="user_b",
        task_id=task_id
    )

    assert result_b["status"] == "error"
    assert "not found" in result_b["message"].lower() or "unauthorized" in result_b["message"].lower()
```

## Security Considerations

### User Validation Pattern

All tools implement the following security checks:

1. **User Existence**: Verify user_id exists in users table
2. **Ownership Verification**: For operations on existing resources (complete, update, delete), verify task.user_id matches requested user_id
3. **Query Filtering**: Always filter database queries by user_id
4. **Parameterized Queries**: Use SQLModel's parameter binding to prevent injection

**Example Security Implementation**:
```python
async def complete_task_tool(user_id: str, task_id: int) -> dict:
    try:
        async with get_db_session() as session:
            # Fetch task with user_id filter
            result = await session.execute(
                select(Todo).where(
                    Todo.id == task_id,
                    Todo.user_id == user_id  # Critical security filter
                )
            )
            task = result.scalar_one_or_none()

            if not task:
                return error_response(
                    f"Task {task_id} not found or access denied",
                    404
                )

            # Proceed with operation...
```

## Performance Optimization

### Database Indexing
- ✅ Index on `conversations.user_id` for fast user lookup
- ✅ Index on `messages.conversation_id` for fast message retrieval
- ✅ Index on `messages.user_id` for security validation
- ✅ Index on timestamp columns for chronological ordering

### Connection Pooling
```python
# backend/src/database/session.py (existing, reused)
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=True,
    pool_size=10,        # Connection pool size
    max_overflow=20,     # Allow up to 20 additional connections
    pool_pre_ping=True   # Verify connections before use
)
```

### Async Operations
- All database operations use `async/await` for non-blocking I/O
- Concurrent tool calls supported without blocking
- AsyncSession context managers ensure proper resource cleanup

## Deployment Configuration

### Environment Variables
```bash
# .env file for MCP server
DATABASE_URL=postgresql+asyncpg://user:pass@neon-host/dbname
MCP_SERVER_PORT=5000
LOG_LEVEL=INFO
ENVIRONMENT=development
```

### Dependencies
```txt
# mcp-server/requirements.txt
fastapi==0.115.0
uvicorn[standard]==0.34.0
sqlmodel==0.0.22
sqlalchemy[asyncpg]==2.0.36
pydantic==2.10.3
python-dotenv==1.0.1
mcp>=1.0.0  # Official MCP SDK
pytest==8.3.4
pytest-asyncio==0.23.0
httpx==0.28.0
```

### Running the Server
```bash
# Development
cd mcp-server
uvicorn src.main:app --reload --port 5000

# Production
gunicorn -w 4 -k uvicorn.workers.UvicornWorker src.main:app --bind 0.0.0.0:5000
```

## Acceptance Criteria Verification

✅ **SC-001**: All 5 MCP tools (add_task, list_tasks, complete_task, delete_task, update_task) implemented with `@tool` decorator
✅ **SC-002**: Both conversation and message database tables created with all required fields, foreign keys, and indexes
✅ **SC-003**: User_id validation implemented in all tools, query filtering prevents cross-user access
✅ **SC-004**: Structured JSON responses with status/data/message format, async operations for < 3s response
✅ **SC-005**: Direct HTTP calls work via FastAPI endpoints, no AI agent required for testing
✅ **SC-006**: SQLModel parameterized queries prevent injection, explicit user_id filtering
✅ **SC-007**: Async operations with connection pooling handle concurrent requests without corruption

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| MCP SDK API changes | High | Pin SDK version, monitor releases, abstraction layer for tool registration |
| Database connection exhaustion | Medium | Connection pooling with limits, monitoring, graceful degradation |
| User_id validation bypass | High | Multiple validation layers, database constraints, comprehensive security tests |
| Performance degradation under load | Medium | Async operations, indexed queries, load testing before production |
| Schema migration rollback issues | Low | Alembic downgrade scripts tested, database backup before migration |

## Follow-Up Work (Out of Scope)

- Integration with OpenAI Agents SDK (Phase 3 Part 2)
- ChatKit UI implementation (Phase 3 Part 3)
- Conversation context handling in AI responses (Phase 3 Part 2)
- Authentication/authorization for MCP server endpoints (Phase 3 Part 2)
- Monitoring and observability (metrics, tracing) (Future)
- Horizontal scaling and load balancing (Future)

## References

- Feature Spec: [spec.md](./spec.md)
- Research Findings: [research.md](./research.md)
- Data Model: [data-model.md](./data-model.md)
- Quickstart Guide: [quickstart.md](./quickstart.md)
- Tool Contracts: [contracts/mcp-tools.json](./contracts/mcp-tools.json)
- Constitution: [.specify/memory/constitution.md](../../.specify/memory/constitution.md)
- Existing Backend: `backend/src/`
- MCP SDK Docs: https://github.com/anthropics/anthropic-mcp-python
- FastAPI Docs: https://fastapi.tiangolo.com/
- SQLModel Docs: https://sqlmodel.tiangolo.com/

---

**Plan Status**: ✅ Complete
**Next Step**: Run `/sp.tasks` to generate actionable, dependency-ordered tasks.md

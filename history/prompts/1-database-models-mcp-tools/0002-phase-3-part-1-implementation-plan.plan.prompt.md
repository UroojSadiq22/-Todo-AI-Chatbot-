---
id: 0002
title: Phase 3 Part 1 Implementation Plan
stage: plan
date: 2026-02-08
surface: agent
model: claude-sonnet-4-5-20250929
feature: 1-database-models-mcp-tools
branch: 1-database-models-mcp-tools
user: LAPTOP
command: /sp.plan
labels: ["plan", "mcp", "database", "architecture", "research"]
links:
  spec: specs/1-database-models-mcp-tools/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/1-database-models-mcp-tools/plan.md
 - specs/1-database-models-mcp-tools/research.md
 - specs/1-database-models-mcp-tools/data-model.md
 - specs/1-database-models-mcp-tools/quickstart.md
 - specs/1-database-models-mcp-tools/contracts/mcp-tools.json
 - CLAUDE.md
tests:
 - none (planning phase)
---

## Prompt

Phase 3 Part 1

## Architecture Sketch
```
┌──────────────┐
│  MCP Server  │ (Port 5000)
│  (FastAPI)   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Neon DB    │
│ - conversations
│ - messages
│ - tasks (existing)
│ - users (existing)
└──────────────┘
```

## Database Schema
```sql
-- New tables
CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR REFERENCES users(id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    conversation_id INT REFERENCES conversations(id),
    user_id VARCHAR REFERENCES users(id),
    role VARCHAR(20),
    content TEXT,
    created_at TIMESTAMP
);
```

## MCP Tools Structure
1. **add_task** - Create new task
2. **list_tasks** - Retrieve tasks (with filter)
3. **complete_task** - Mark task done
4. **delete_task** - Remove task
5. **update_task** - Modify task

## Implementation Approach
- Phase: Database models → MCP server setup → Tool endpoints → Testing
- Use FastAPI for MCP server (separate from main backend)
- Each tool = independent function with Pydantic schemas

## Decisions Needing Documentation
**MCP Server Location:**
- Option A: Separate service (Port 5000) - Better isolation
- Option B: Same FastAPI app - Simpler deployment
- **Choice: Option A** - Cleaner separation, easier debugging

**Tool Response Format:**
- Option A: Raw database objects
- Option B: Structured dict with status
- **Choice: Option B** - AI-friendly, explicit confirmation

## Testing Strategy
- Unit test each tool with mock database
- Integration test with real Neon DB
- Validate user_id isolation (user A can't access user B's tasks)
- Test error cases (task not found, invalid user_id)

## Technical Details
- Use MCP SDK's `@server.tool()` decorator
- Database connection via existing SQLModel engine
- Pydantic models for request/response validation
- Error handling with try-except blocks and logging

## Response snapshot

Created a comprehensive implementation plan for Phase 3 Part 1 (Database Models & MCP Tools Foundation) including:
- Technical context with Python 3.11+, FastAPI, SQLModel, Official MCP SDK
- Constitution check confirming alignment with all project principles
- Detailed project structure showing separate MCP server service and new database models
- Complete Phase 0 research resolving all technical unknowns (MCP architecture, response format, security, testing)
- Complete Phase 1 design with database schemas, SQLModel implementations, and MCP tool contracts
- Implementation architecture with code examples for MCP server, tool pattern, utility functions
- Database migration script for Alembic
- Comprehensive testing strategy with unit tests, integration tests, and user isolation tests
- Security considerations with user validation patterns
- Performance optimizations (indexes, connection pooling, async operations)
- Deployment configuration and acceptance criteria verification

## Outcome

- ✅ Impact: Complete implementation plan ready for /sp.tasks command - all design decisions documented, architecture defined, security verified
- 🧪 Tests: Testing strategy defined (unit tests with mocked DB, integration tests with real DB, user isolation tests)
- 📁 Files: Updated plan.md with full architecture, research.md verified, data-model.md verified, quickstart.md verified, contracts verified, CLAUDE.md updated with new technologies
- 🔁 Next prompts: Run /sp.tasks to generate actionable, dependency-ordered tasks.md
- 🧠 Reflection: Plan provides clear separation between MCP server and main backend, emphasizes stateless architecture and security-first approach. All constitutional requirements satisfied. Ready for task generation and implementation.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): Constitution Check: PASS (all requirements satisfied)
- Prompt variant (if applicable): Standard /sp.plan workflow with user-provided architecture sketch and schema
- Next experiment (smallest change to try): none

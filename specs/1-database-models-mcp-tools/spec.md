# Feature Specification: Database Models & MCP Tools Foundation

**Feature Branch**: `1-database-models-mcp-tools`
**Created**: 2026-02-08
**Status**: Draft
**Input**: User description: "Phase 3 Part 1

Database Models & MCP Tools Foundation

Target audience: Claude Code for implementation
Focus: Stateless MCP tool server with database persistence

Success criteria:
- 2 new database tables (Conversation, Message) created
- 5 MCP tools implemented and tested independently
- Tools validate user_id and return structured responses
- All tools work without AI agent (direct HTTP calls)

Constraints:
- Technology: FastAPI, SQLModel, Official MCP SDK (Python)
- Database: Neon PostgreSQL (existing instance)
- Timeline: 2-3 days
- No frontend changes yet

Not building:
- OpenAI Agents integration (Part 2)
- ChatKit UI (Part 3)
- Conversation context handling (Part 2)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create Task via MCP Tool (Priority: P1)

A user wants to create a new task in their todo list using a conversational interface connected to MCP tools. The user sends a command like "Add a new task: Buy groceries", which gets processed by an MCP tool that creates the task in the database.

**Why this priority**: This is the core functionality that enables users to add tasks, which is fundamental to the todo app.

**Independent Test**: Can be fully tested by calling the add_task MCP tool directly with user_id and task details, and verifying the task is persisted in the database.

**Acceptance Scenarios**:

1. **Given** a valid user exists in the system, **When** the add_task MCP tool is called with valid user_id, title, and optional description, **Then** a new task is created and stored in the database with correct user association
2. **Given** an invalid user_id is provided, **When** the add_task MCP tool is called, **Then** the tool returns an appropriate error response

---

### User Story 2 - List Tasks via MCP Tool (Priority: P1)

A user wants to view their tasks using a conversational interface. The user sends a command like "Show my tasks", which triggers an MCP tool that retrieves tasks from the database.

**Why this priority**: Essential for users to view and manage their tasks.

**Independent Test**: Can be fully tested by calling the list_tasks MCP tool with a valid user_id and verifying it returns the correct list of tasks.

**Acceptance Scenarios**:

1. **Given** a user has multiple tasks in the database, **When** the list_tasks MCP tool is called with the user's user_id, **Then** the tool returns all tasks associated with that user
2. **Given** a user has tasks with different statuses, **When** the list_tasks MCP tool is called with a status filter, **Then** only tasks matching the specified status are returned

---

### User Story 3 - Complete Task via MCP Tool (Priority: P2)

A user wants to mark a task as complete using a conversational interface. The user sends a command like "Complete task #5", which calls an MCP tool to update the task status.

**Why this priority**: Critical for task management workflow allowing users to mark completed items.

**Independent Test**: Can be fully tested by calling the complete_task MCP tool with a valid user_id and task_id, and verifying the task status is updated.

**Acceptance Scenarios**:

1. **Given** a user owns a task with ID 123, **When** the complete_task MCP tool is called with user_id and task_id 123, **Then** the task's status is updated to completed in the database

---

### User Story 4 - Update Task via MCP Tool (Priority: P2)

A user wants to modify an existing task using a conversational interface. The user sends a command like "Update task #5 to have a new title", which calls an MCP tool to modify the task.

**Why this priority**: Allows users to refine their tasks after creation.

**Independent Test**: Can be fully tested by calling the update_task MCP tool with valid user_id, task_id, and updated fields, and verifying the changes are persisted.

**Acceptance Scenarios**:

1. **Given** a user owns a task with ID 123, **When** the update_task MCP tool is called with user_id, task_id 123, and new title, **Then** the task's title is updated in the database

---

### User Story 5 - Delete Task via MCP Tool (Priority: P2)

A user wants to remove a task using a conversational interface. The user sends a command like "Delete task #5", which calls an MCP tool to remove the task.

**Why this priority**: Essential for task management allowing users to remove unwanted tasks.

**Independent Test**: Can be fully tested by calling the delete_task MCP tool with valid user_id and task_id, and verifying the task is removed from the database.

**Acceptance Scenarios**:

1. **Given** a user owns a task with ID 123, **When** the delete_task MCP tool is called with user_id and task_id 123, **Then** the task is removed from the database

---

### User Story 6 - Conversation History Persistence (Priority: P3)

A user engages in a conversation with an AI assistant that uses the MCP tools. Both the user's messages and the assistant's responses need to be stored persistently to maintain conversation context.

**Why this priority**: Enables persistent conversation context across sessions, though not essential for basic task operations.

**Independent Test**: Can be tested by calling the message storage functions and verifying conversations and messages are stored and retrieved correctly.

**Acceptance Scenarios**:

1. **Given** a user initiates a conversation, **When** user and assistant messages are saved, **Then** the conversation and its messages are persisted in the database with proper user association

---

### Edge Cases

- What happens when a user attempts to access or modify another user's tasks?
- How does the system handle database connection failures during MCP tool operations?
- What occurs when invalid data types are passed to MCP tools?
- How does the system handle requests with expired or invalid user authentication?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide an add_task MCP tool that accepts user_id, title, and optional description parameters
- **FR-002**: System MUST provide a list_tasks MCP tool that accepts user_id and optional status filter parameters
- **FR-003**: System MUST provide a complete_task MCP tool that accepts user_id and task_id parameters
- **FR-004**: System MUST provide an update_task MCP tool that accepts user_id, task_id, and optional title/description parameters
- **FR-005**: System MUST provide a delete_task MCP tool that accepts user_id and task_id parameters
- **FR-006**: All MCP tools MUST validate that the user_id in the request matches the authenticated user identity
- **FR-007**: All MCP tools MUST return structured JSON responses with appropriate status codes
- **FR-008**: System MUST persist conversations in a conversations table with id, user_id, created_at, and updated_at fields
- **FR-009**: System MUST persist messages in a messages table with id, conversation_id, user_id, role, content, and created_at fields
- **FR-010**: System MUST validate all database operations using parameterized queries to prevent injection
- **FR-011**: System MUST implement proper error handling and logging for all MCP tool operations

### Key Entities *(include if feature involves data)*

- **Conversation**: Represents a user's conversation thread, containing id, user_id, created_at, updated_at attributes
- **Message**: Represents individual messages within a conversation, containing id, conversation_id, user_id, role, content, created_at attributes
- **Task**: Represents user's todo items, containing id, user_id, title, description, status, created_at, updated_at attributes

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 5 MCP tools (add_task, list_tasks, complete_task, delete_task, update_task) are implemented and tested independently
- **SC-002**: Both conversation and message database tables are created with all required fields and relationships
- **SC-003**: MCP tools validate user_id successfully and prevent cross-user data access
- **SC-004**: All tools return structured JSON responses consistently within 3 seconds
- **SC-005**: Direct HTTP calls to MCP tools work without requiring AI agent integration
- **SC-006**: Database operations use parameterized queries preventing injection vulnerabilities
- **SC-007**: System handles simultaneous requests to MCP tools without data corruption
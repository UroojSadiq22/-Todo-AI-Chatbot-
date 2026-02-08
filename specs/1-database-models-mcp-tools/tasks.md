---
description: "Task list for Database Models & MCP Tools Foundation implementation"
---

# Tasks: Database Models & MCP Tools Foundation

**Input**: Design documents from `/specs/1-database-models-mcp-tools/`
**Prerequisites**: plan.md (complete), spec.md (complete), research.md (complete), data-model.md (complete)

**Tests**: Test tasks are NOT included as testing was not explicitly requested in the feature specification. Focus is on implementation and manual/direct HTTP validation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story. The 5 MCP tools are distributed across user stories based on their priority.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

This project uses **web app structure**:
- Backend: `backend/src/` for existing API
- MCP Server: `mcp-server/src/` for new MCP service
- Migrations: `migrations/versions/` for database changes

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and MCP server structure

- [x] T001 Create mcp-server directory structure per plan.md (mcp-server/src/, mcp-server/tests/)
- [x] T002 Create mcp-server/requirements.txt with dependencies (fastapi, uvicorn, sqlmodel, mcp, pytest, pytest-asyncio)
- [x] T003 [P] Create mcp-server/src/__init__.py and subdirectories (tools/, schemas/, utils/)
- [x] T004 [P] Create mcp-server/.env.example with DATABASE_URL, MCP_SERVER_PORT, LOG_LEVEL
- [x] T005 [P] Create mcp-server/README.md with setup instructions and tool descriptions

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Create Conversation model in backend/src/models/conversation.py with SQLModel schema (id, user_id, created_at, updated_at, relationships)
- [x] T007 Create Message model in backend/src/models/message.py with SQLModel schema (id, conversation_id, user_id, role, content, created_at, relationships)
- [x] T008 Update backend/src/models/__init__.py to export Conversation and Message models
- [x] T009 Create Alembic migration script in migrations/versions/001_add_conversations_messages.py with upgrade/downgrade functions for conversations and messages tables including indexes
- [x] T010 [P] Create response utility functions in mcp-server/src/utils/response_utils.py (success_response, error_response)
- [x] T011 [P] Create database utility functions in mcp-server/src/utils/db_utils.py (get_db_session async context manager)
- [x] T012 [P] Create tool schemas in mcp-server/src/schemas/tool_schemas.py (Pydantic models for tool requests/responses)
- [x] T013 Create MCP server main entry point in mcp-server/src/main.py with FastAPI/MCP SDK initialization and tool registration structure
- [x] T014 Apply database migration using Alembic to create conversations and messages tables in Neon database (COMPLETED - migration 6da3d94121e6 applied)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create Task via MCP Tool (Priority: P1) 🎯 MVP

**Goal**: Enable users to create new tasks via the add_task MCP tool with proper validation and database persistence

**Independent Test**: Call add_task MCP tool directly with valid user_id and title, verify task is created in database with correct user association. Test with invalid user_id to verify error response.

### Implementation for User Story 1

- [x] T015 [US1] Implement add_task tool in mcp-server/src/tools/add_task.py using @tool decorator, with user validation, task creation, and structured response
- [x] T016 [US1] Create __init__.py in mcp-server/src/tools/ and export add_task_tool
- [x] T017 [US1] Register add_task tool in mcp-server/src/main.py server initialization
- [x] T018 [US1] Add error handling and logging for add_task tool operations
- [x] T019 [US1] Manually test add_task tool with direct HTTP calls (valid user, invalid user, missing parameters)

**Checkpoint**: At this point, User Story 1 should be fully functional - tasks can be created via MCP tool and persisted in database

---

## Phase 4: User Story 2 - List Tasks via MCP Tool (Priority: P1)

**Goal**: Enable users to retrieve their tasks via the list_tasks MCP tool with optional status filtering

**Independent Test**: Call list_tasks MCP tool with valid user_id and verify it returns only that user's tasks. Test with status filter to verify filtering works correctly.

### Implementation for User Story 2

- [x] T020 [US2] Implement list_tasks tool in mcp-server/src/tools/list_tasks.py using @tool decorator, with user validation, task querying with optional status filter, and structured response
- [x] T021 [US2] Update mcp-server/src/tools/__init__.py to export list_tasks_tool
- [x] T022 [US2] Register list_tasks tool in mcp-server/src/main.py server initialization
- [x] T023 [US2] Add error handling and logging for list_tasks tool operations
- [x] T024 [US2] Manually test list_tasks tool with direct HTTP calls (all tasks, filtered by status, empty results, invalid user)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - tasks can be created and listed

---

## Phase 5: User Story 3 - Complete Task via MCP Tool (Priority: P2)

**Goal**: Enable users to mark tasks as completed via the complete_task MCP tool with ownership validation

**Independent Test**: Call complete_task MCP tool with valid user_id and task_id, verify task status is updated to completed. Test with another user's task_id to verify access denial.

### Implementation for User Story 3

- [x] T025 [US3] Implement complete_task tool in mcp-server/src/tools/complete_task.py using @tool decorator, with user and ownership validation, task status update, and structured response
- [x] T026 [US3] Update mcp-server/src/tools/__init__.py to export complete_task_tool
- [x] T027 [US3] Register complete_task tool in mcp-server/src/main.py server initialization
- [x] T028 [US3] Add error handling and logging for complete_task tool operations
- [x] T029 [US3] Manually test complete_task tool with direct HTTP calls (valid task, invalid task_id, unauthorized access attempt)

**Checkpoint**: User Stories 1, 2, and 3 are functional - tasks can be created, listed, and completed

---

## Phase 6: User Story 4 - Update Task via MCP Tool (Priority: P2)

**Goal**: Enable users to modify existing task details via the update_task MCP tool with ownership validation

**Independent Test**: Call update_task MCP tool with valid user_id, task_id, and updated fields, verify changes are persisted. Test with another user's task to verify access denial.

### Implementation for User Story 4

- [x] T030 [US4] Implement update_task tool in mcp-server/src/tools/update_task.py using @tool decorator, with user and ownership validation, task field updates (title, description), and structured response
- [x] T031 [US4] Update mcp-server/src/tools/__init__.py to export update_task_tool
- [x] T032 [US4] Register update_task tool in mcp-server/src/main.py server initialization
- [x] T033 [US4] Add error handling and logging for update_task tool operations
- [x] T034 [US4] Manually test update_task tool with direct HTTP calls (update title, update description, update both, invalid task, unauthorized access)

**Checkpoint**: User Stories 1-4 are functional - full CRUD except delete

---

## Phase 7: User Story 5 - Delete Task via MCP Tool (Priority: P2)

**Goal**: Enable users to remove tasks via the delete_task MCP tool with ownership validation

**Independent Test**: Call delete_task MCP tool with valid user_id and task_id, verify task is removed from database. Test with another user's task to verify access denial.

### Implementation for User Story 5

- [x] T035 [US5] Implement delete_task tool in mcp-server/src/tools/delete_task.py using @tool decorator, with user and ownership validation, task deletion, and structured response
- [x] T036 [US5] Update mcp-server/src/tools/__init__.py to export delete_task_tool
- [x] T037 [US5] Register delete_task tool in mcp-server/src/main.py server initialization
- [x] T038 [US5] Add error handling and logging for delete_task tool operations
- [x] T039 [US5] Manually test delete_task tool with direct HTTP calls (valid delete, invalid task_id, unauthorized access attempt, verify task is gone)

**Checkpoint**: All 5 MCP tools are functional - complete task management via MCP tools

---

## Phase 8: User Story 6 - Conversation History Persistence (Priority: P3)

**Goal**: Enable persistent storage and retrieval of conversation messages to maintain context across sessions

**Independent Test**: Create conversation service functions that save user and assistant messages, then retrieve conversation history and verify all messages are returned in correct order.

### Implementation for User Story 6

- [x] T040 [US6] Implement ConversationService in backend/src/services/conversation_service.py with methods: create_conversation, save_message, get_conversation_history, get_user_conversations
- [x] T041 [US6] Add user validation and query filtering by user_id in all ConversationService methods
- [x] T042 [US6] Add error handling and logging for conversation service operations
- [x] T043 [US6] Update backend/src/services/__init__.py to export ConversationService
- [x] T044 [US6] Manually test conversation persistence (create conversation, save messages, retrieve history, verify user isolation)

**Checkpoint**: All user stories complete - conversation history can be persisted and retrieved

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and production readiness

- [x] T045 [P] Update mcp-server/README.md with complete usage examples for all 5 MCP tools
- [x] T046 [P] Add comprehensive docstrings to all MCP tool functions with parameter descriptions and return value documentation
- [x] T047 [P] Verify all database queries use parameterized queries (SQLModel binding) to prevent SQL injection
- [x] T048 [P] Verify all MCP tools include proper user_id validation and ownership checks for security
- [x] T049 Run quickstart.md validation - manually execute all setup steps and tool examples
- [x] T050 [P] Add logging configuration to mcp-server/src/main.py (INFO level, structured format)
- [x] T051 Document environment variables needed in mcp-server/README.md (.env file format and values)
- [x] T052 Create startup script for MCP server (e.g., mcp-server/start.sh or start.bat with uvicorn command)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - User stories CAN proceed in parallel if staffed
  - Or sequentially in priority order: US1 → US2 → US3 → US4 → US5 → US6
  - US1 and US2 are highest priority (both P1) - complete these first for MVP
- **Polish (Phase 9)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Independent but logically follows US1
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Independent but requires tasks to exist (US1)
- **User Story 5 (P2)**: Can start after Foundational (Phase 2) - Independent but requires tasks to exist (US1)
- **User Story 6 (P3)**: Can start after Foundational (Phase 2) - Completely independent, uses separate tables

### Within Each User Story

- MCP tool implementation before registration
- Tool registration before testing
- Error handling and logging as part of implementation
- Manual testing to verify independent story completion

### Parallel Opportunities

- Phase 1: All [P] tasks (T003, T004, T005) can run in parallel
- Phase 2: Tasks T010, T011, T012 can run in parallel (different utility files)
- After Phase 2 completes:
  - US1 (add_task) can run in parallel with US2 (list_tasks)
  - US3, US4, US5 (complete, update, delete) can run in parallel after US1 completes (need tasks to exist)
  - US6 (conversation history) can run in parallel with any task story (uses different tables)
- Phase 9: All [P] tasks (T045, T046, T047, T048, T050) can run in parallel

---

## Parallel Example: Foundational Phase

```bash
# After T009 completes, these can run together:
Task: "Create response utility functions in mcp-server/src/utils/response_utils.py"
Task: "Create database utility functions in mcp-server/src/utils/db_utils.py"
Task: "Create tool schemas in mcp-server/src/schemas/tool_schemas.py"
```

## Parallel Example: After Foundation Complete

```bash
# US1 and US2 can run in parallel:
Task: "Implement add_task tool in mcp-server/src/tools/add_task.py"
Task: "Implement list_tasks tool in mcp-server/src/tools/list_tasks.py"

# After US1 completes, US3/US4/US5 can run in parallel:
Task: "Implement complete_task tool in mcp-server/src/tools/complete_task.py"
Task: "Implement update_task tool in mcp-server/src/tools/update_task.py"
Task: "Implement delete_task tool in mcp-server/src/tools/delete_task.py"

# US6 can run in parallel with any other user story:
Task: "Implement ConversationService in backend/src/services/conversation_service.py"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only - Both P1)

1. Complete Phase 1: Setup → MCP server structure ready
2. Complete Phase 2: Foundational → Database models and utilities ready (CRITICAL)
3. Complete Phase 3: User Story 1 → Can create tasks
4. Complete Phase 4: User Story 2 → Can list tasks
5. **STOP and VALIDATE**: Test US1 and US2 independently with direct HTTP calls
6. Deploy/demo if ready → Users can add and view tasks conversationally

This is the **minimum viable product** - users can create and view tasks via MCP tools.

### Incremental Delivery

1. **Foundation** (Phase 1-2) → Database and utilities ready
2. **MVP** (Phase 3-4: US1 + US2) → Add and list tasks → Deploy/Demo ✅
3. **Task Completion** (Phase 5: US3) → Mark tasks done → Deploy/Demo ✅
4. **Task Editing** (Phase 6-7: US4 + US5) → Update and delete tasks → Deploy/Demo ✅
5. **Conversation History** (Phase 8: US6) → Persistent context → Deploy/Demo ✅
6. **Production Ready** (Phase 9) → Documentation and polish → Final Deploy ✅

Each increment adds value without breaking previous functionality.

### Parallel Team Strategy

With multiple developers (after Foundational phase completes):

1. **Team completes Setup + Foundational together** (critical path)
2. Once Foundational is done:
   - **Developer A**: User Story 1 (add_task)
   - **Developer B**: User Story 2 (list_tasks)
   - **Developer C**: User Story 6 (conversation history - independent)
3. After US1 completes:
   - **Developer A**: User Story 3 (complete_task)
   - **Developer D**: User Story 4 (update_task)
   - **Developer E**: User Story 5 (delete_task)
4. All stories integrate and test independently

---

## Task Count Summary

- **Total Tasks**: 52
- **Phase 1 (Setup)**: 5 tasks
- **Phase 2 (Foundational)**: 9 tasks (BLOCKING - must complete first)
- **Phase 3 (US1 - add_task)**: 5 tasks
- **Phase 4 (US2 - list_tasks)**: 5 tasks
- **Phase 5 (US3 - complete_task)**: 5 tasks
- **Phase 6 (US4 - update_task)**: 5 tasks
- **Phase 7 (US5 - delete_task)**: 5 tasks
- **Phase 8 (US6 - conversation history)**: 5 tasks
- **Phase 9 (Polish)**: 8 tasks

**Parallel Opportunities**: 15 tasks marked [P] can run in parallel with others in their phase

**MVP Scope** (recommended first delivery): Phase 1 + Phase 2 + Phase 3 + Phase 4 = 24 tasks → Users can create and list tasks via MCP tools

---

## Notes

- [P] tasks = different files, no dependencies within their phase
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable via direct HTTP calls
- Manual testing via direct HTTP calls replaces automated test suite (tests not requested in spec)
- Commit after each task or logical user story completion
- Stop at any checkpoint to validate story works independently
- All MCP tools MUST validate user_id and filter queries by user_id for security
- All database operations MUST use SQLModel parameterized queries (no string concatenation)
- Response format for all tools: `{status: "success|error", data: {...}, message: "..."}`

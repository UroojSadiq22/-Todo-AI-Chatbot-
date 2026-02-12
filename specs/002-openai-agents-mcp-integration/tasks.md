# Implementation Tasks: OpenAI Agents SDK with MCP Tools Integration

**Feature**: OpenAI Agents SDK with MCP Tools Integration | **Branch**: 002-openai-agents-mcp-integration | **Date**: 2026-02-08

## Phase 1: Setup

### Goal
Initialize the project structure and dependencies for the OpenAI Agents SDK with MCP Tools Integration.

### Tasks

- [X] T001 Create backend directory structure with src/models, src/services, src/api, and tests directories
- [X] T002 Install required dependencies: openai, fastapi, uvicorn, sqlmodel, python-multipart, pytest
- [X] T003 Create requirements.txt with all necessary packages for the feature
- [X] T004 Initialize backend/src/__init__.py and backend/tests/__init__.py files

## Phase 2: Foundational Components

### Goal
Create the foundational database models and services that will be used by all user stories.

### Tasks

- [X] T005 [P] Create Conversation model in backend/src/models/conversation.py with id, user_id, created_at, updated_at fields
- [X] T006 [P] Create Message model in backend/src/models/message.py with id, conversation_id, user_id, role, content, created_at fields
- [X] T007 [P] Create __init__.py in backend/src/models to export models
- [X] T008 [P] Create ConversationService in backend/src/services/conversation_service.py with create_conversation method
- [X] T009 [P] Add save_message method to ConversationService in backend/src/services/conversation_service.py
- [X] T010 [P] Add get_conversation_history method to ConversationService in backend/src/services/conversation_service.py
- [X] T011 [P] Create __init__.py in backend/src/services to export services
- [X] T012 [P] Create helper function to truncate conversation history in backend/src/services/conversation_service.py

## Phase 3: User Story 1 - Basic Chat Message with Task Creation (P1)

### Goal
Implement the core functionality to send a chat message that creates a task through the chat endpoint. The system should interpret "Add a task to buy groceries", call the add_task MCP tool, and return a confirmation.

### Independent Test Criteria
Send a POST request to /api/{user_id}/chat with a task creation message, verify the AI agent calls add_task tool, and confirm the response includes task creation confirmation.

### Tasks

- [X] T013 [US1] Create chat endpoint in backend/src/api/chat.py with POST /api/{user_id}/chat route
- [X] T014 [US1] Add logic to fetch conversation history from database in the chat endpoint
- [X] T015 [US1] Add logic to create a new conversation if none exists for the user
- [X] T016 [US1] Save the incoming user message to the messages table in the chat endpoint
- [X] T017 [US1] Configure OpenAI Assistant with MCP tools in the chat endpoint
- [X] T018 [US1] Implement OpenAI Assistant call with conversation history as context
- [X] T019 [US1] Save the assistant's response to the messages table
- [X] T020 [US1] Return the AI agent's response with conversation_id and tool_calls in the response
- [X] T021 [US1] Create initial OpenAI Assistant configuration in backend/src/api/chat.py
- [ ] T022 [US1] Test with sample task creation message to verify add_task MCP tool is called

## Phase 4: User Story 2 - Chat Message with Task Listing (P1)

### Goal
Enable users to send natural language messages to view their tasks through the chat endpoint. The system should interpret "Show me my tasks", call the list_tasks MCP tool, and return a formatted list.

### Independent Test Criteria
Send a POST request to /api/{user_id}/chat with a list request message, verify the AI agent calls list_tasks tool, and confirm the response includes the formatted task list.

### Tasks

- [X] T023 [US2] Update OpenAI Assistant tools configuration to include list_tasks MCP tool
- [ ] T024 [US2] Test with sample task listing message to verify list_tasks MCP tool is called
- [ ] T025 [US2] Verify that the response properly formats the list of tasks from MCP tool
- [ ] T026 [US2] Test scenario where user asks for completed tasks specifically

## Phase 5: User Story 3 - Chat Message for Task Operations (P2)

### Goal
Enable users to send natural language commands to complete, update, or delete tasks through the chat endpoint. Messages like "Mark task 5 as done" should be interpreted and routed to appropriate MCP tools.

### Independent Test Criteria
Send various task operation commands via chat endpoint and verify the AI agent correctly identifies the intent and calls the appropriate MCP tool (complete_task, update_task, or delete_task).

### Tasks

- [X] T027 [US3] Update OpenAI Assistant tools configuration to include complete_task MCP tool
- [X] T028 [US3] Update OpenAI Assistant tools configuration to include update_task MCP tool
- [X] T029 [US3] Update OpenAI Assistant tools configuration to include delete_task MCP tool
- [ ] T030 [US3] Test with sample task completion message to verify complete_task MCP tool is called
- [ ] T031 [US3] Test with sample task update message to verify update_task MCP tool is called
- [ ] T032 [US3] Test with sample task deletion message to verify delete_task MCP tool is called
- [X] T033 [US3] Handle errors when MCP tools fail and communicate to the user appropriately

## Phase 6: User Story 4 - Conversation Context Awareness (P2)

### Goal
Enable the AI agent to maintain context from previous messages in multi-turn conversations, allowing users to reference prior tasks without repeating full details.

### Independent Test Criteria
Send multiple sequential chat messages and verify the AI agent's responses demonstrate awareness of previous exchanges (e.g., user says "Add a task to buy milk", then "Mark it as done" and agent knows which task).

### Tasks

- [X] T034 [US4] Enhance conversation history retrieval to include more context for the AI agent
- [X] T035 [US4] Implement conversation history truncation to prevent token overflow (max 20 messages)
- [ ] T036 [US4] Test multi-turn conversation where user creates task and then references it as "it"
- [ ] T037 [US4] Test conversation continuity where user can reference previous tasks without repeating details

## Phase 7: Error Handling and Edge Cases

### Goal
Handle various error conditions and edge cases to ensure robust operation.

### Tasks

- [X] T038 Implement error handling for MCP server unavailability in the chat endpoint
- [X] T039 Handle malformed or ambiguous user messages gracefully in the chat endpoint
- [X] T040 Implement timeout handling for MCP tool calls
- [ ] T041 Handle database save failures gracefully after AI agent response
- [ ] T042 Handle OpenAI API errors and timeouts with appropriate fallback messages
- [X] T043 Validate that conversation history is properly truncated when approaching token limits
- [X] T044 Add validation to prevent users from accessing other users' conversations
- [ ] T045 Handle requests for non-existent tasks gracefully

## Phase 8: Security and Validation

### Goal
Implement security measures and validation to ensure proper user isolation and data integrity.

### Tasks

- [X] T046 Add user_id validation to ensure users can only access their own conversations
- [X] T047 Implement JWT validation middleware for the chat endpoint
- [X] T048 Validate user_id parameter matches authenticated user in the JWT token
- [X] T049 Add proper parameterized queries to prevent SQL injection in all database operations
- [X] T050 Add input sanitization for user messages to prevent injection attacks

## Phase 9: Polish & Cross-Cutting Concerns

### Goal
Complete the implementation with proper logging, performance optimization, and testing.

### Tasks

- [X] T051 Add comprehensive logging to track user requests, AI responses, and tool calls
- [X] T052 Add type hints to all functions in the chat endpoint and services
- [X] T053 Optimize database queries with proper indexing (covered in schema definition)
- [ ] T054 Create integration tests for the chat endpoint in backend/tests/integration/test_chat_endpoint.py
- [ ] T055 Create unit tests for the ConversationService in backend/tests/unit/test_conversation.py
- [ ] T056 Performance test to ensure responses come within 5 seconds
- [X] T057 Update main.py to include the chat API routes
- [X] T058 Add proper error responses with appropriate HTTP status codes
- [ ] T059 Document the API endpoints with OpenAPI/Swagger documentation
- [X] T060 Update README with instructions for running the chat endpoint

## Dependencies

### User Story Completion Order
1. US1 (Basic Chat Message with Task Creation) - Foundation for all other stories
2. US2 (Chat Message with Task Listing) - Builds on US1 foundation
3. US3 (Chat Message for Task Operations) - Builds on US1 foundation
4. US4 (Conversation Context Awareness) - Depends on all previous stories

### Blocking Relationships
- T005-T009 must complete before T013 (Models needed for services and API)
- T013-T016 must complete before T017-T022 (API foundation needed before OpenAI integration)
- All foundational tasks must complete before user story tasks

## Parallel Execution Opportunities

### Within Each User Story
- Model creation [P] can run in parallel with service creation [P]
- Multiple MCP tool configurations [P] can run simultaneously (US3 tasks)
- Testing of different scenarios [P] can run in parallel after implementation

### Across User Stories
- US2 implementation can run in parallel with US3 implementation after US1 completion
- Unit and integration tests [P] can be developed in parallel with implementation

## Implementation Strategy

### MVP Scope (US1 Only)
1. Implement basic chat endpoint that receives messages and returns AI responses
2. Connect to MCP tools to enable task creation
3. Persist conversations and messages to database
4. Enable basic functionality for "Add a task..." commands

### Incremental Delivery
1. **Week 1**: Complete Phase 1-3 (MVP with task creation)
2. **Week 2**: Complete remaining phases (full functionality)

## Success Criteria Verification

### Measurable Outcomes
- SC-001: Measure response times for API calls to ensure <5 seconds
- SC-002: Track task creation success rates for well-formed messages (target: 95%)
- SC-003: Verify correct tool routing for different operation types
- SC-004: Test multi-turn conversations for context awareness
- SC-005: Verify API works with direct HTTP requests (Postman/curl)
- SC-006: Confirm all messages are persisted and retrievable
- SC-007: Test error handling scenarios for graceful degradation
- SC-008: Verify conversation history management with 50+ messages
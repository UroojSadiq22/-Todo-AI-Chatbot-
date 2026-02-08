# Feature Specification: OpenAI Agents SDK with MCP Tools Integration

**Feature Branch**: `002-openai-agents-mcp-integration`
**Created**: 2026-02-08
**Status**: Draft
**Input**: User description: "Phase 3 Part 2

OpenAI Agents SDK with MCP Tools Integration

Target audience: Claude Code for implementation
Focus: Stateless chat endpoint that routes to MCP tools via AI agent

Success criteria:
- POST /api/{user_id}/chat endpoint working
- OpenAI Agent correctly calls MCP tools based on user message
- Conversation history fetched from DB before each request
- Agent responses saved to messages table
- Works with direct HTTP requests (Postman/curl)

Constraints:
- Technology: OpenAI Agents SDK, FastAPI
- MCP server from Part 1 must be running
- Timeline: 2 days
- No frontend yet (test with curl/Postman)

Not building:
- ChatKit UI (Part 3)
- Multi-turn conversation UI
- Authentication (use hardcoded user_id for testing)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Basic Chat Message with Task Creation (Priority: P1)

A user sends a natural language message to create a task through the chat endpoint. The message "Add a task to buy groceries" is sent via HTTP POST to the chat endpoint, the AI agent interprets this intent, calls the add_task MCP tool, and returns a confirmation response.

**Why this priority**: This is the core MVP functionality that demonstrates end-to-end integration between the chat interface, AI agent, and MCP tools. Without this, there is no conversational task management capability.

**Independent Test**: Can be fully tested by sending a POST request to /api/{user_id}/chat with a task creation message, verifying the AI agent calls add_task tool, and confirming the response includes task creation confirmation.

**Acceptance Scenarios**:

1. **Given** a user with a valid user_id and no existing conversation, **When** they send a chat message "Add a task to buy groceries", **Then** the system creates a new conversation, saves the user message, calls the add_task MCP tool, saves the assistant response, and returns the task creation confirmation
2. **Given** a user with an existing conversation, **When** they send a chat message to create a task, **Then** the system loads the conversation history, includes context in the AI agent request, creates the task via MCP tool, and saves both messages
3. **Given** a user sends a vague message like "add something", **When** the AI agent cannot determine task details, **Then** the agent responds asking for clarification without calling any MCP tool

---

### User Story 2 - Chat Message with Task Listing (Priority: P1)

A user sends a natural language message to view their tasks through the chat endpoint. The message "Show me my tasks" is sent to the chat endpoint, the AI agent interprets this intent, calls the list_tasks MCP tool, and returns a formatted list of tasks.

**Why this priority**: Essential for users to view their tasks conversationally. Combined with US1, this provides MVP functionality for task creation and viewing.

**Independent Test**: Can be fully tested by sending a POST request to /api/{user_id}/chat with a list request message, verifying the AI agent calls list_tasks tool, and confirming the response includes the formatted task list.

**Acceptance Scenarios**:

1. **Given** a user has multiple tasks in the database, **When** they send a chat message "Show my tasks", **Then** the AI agent calls list_tasks MCP tool and returns a formatted list of all tasks
2. **Given** a user asks "Show me my completed tasks", **When** the AI agent processes this, **Then** it calls list_tasks with status filter and returns only completed tasks
3. **Given** a user has no tasks, **When** they ask to see their tasks, **Then** the agent returns a friendly message indicating no tasks exist

---

### User Story 3 - Chat Message for Task Operations (Priority: P2)

A user sends natural language commands to complete, update, or delete tasks through the chat endpoint. Messages like "Mark task 5 as done", "Update task 3 to say 'Buy milk'", or "Delete task 7" are interpreted by the AI agent and routed to the appropriate MCP tools.

**Why this priority**: Enables full task management capabilities through conversation, completing the CRUD operations suite.

**Independent Test**: Can be fully tested by sending various task operation commands via chat endpoint and verifying the AI agent correctly identifies the intent and calls the appropriate MCP tool (complete_task, update_task, or delete_task).

**Acceptance Scenarios**:

1. **Given** a user owns task ID 5, **When** they send "Mark task 5 as done", **Then** the AI agent calls complete_task MCP tool with task_id=5 and returns confirmation
2. **Given** a user owns task ID 3, **When** they send "Update task 3 to say 'Buy milk'", **Then** the AI agent calls update_task MCP tool with the new title and returns confirmation
3. **Given** a user owns task ID 7, **When** they send "Delete task 7", **Then** the AI agent calls delete_task MCP tool and returns confirmation
4. **Given** a user tries to modify a task they don't own, **When** they send the command, **Then** the AI agent attempts the operation, MCP tool returns error, and agent communicates the failure to the user

---

### User Story 4 - Conversation Context Awareness (Priority: P2)

A user engages in a multi-turn conversation where the AI agent maintains context from previous messages. The user can reference prior tasks or conversations naturally without repeating full details.

**Why this priority**: Enables natural conversation flow where users don't need to repeat context, making the experience more intuitive and efficient.

**Independent Test**: Can be fully tested by sending multiple sequential chat messages and verifying the AI agent's responses demonstrate awareness of previous exchanges (e.g., user says "Add a task to buy milk", then "Mark it as done" and agent knows which task).

**Acceptance Scenarios**:

1. **Given** a user just created a task via chat, **When** they send "Mark it as done" without specifying task ID, **Then** the AI agent uses conversation context to identify the recently created task and marks it complete
2. **Given** a user discussed task details in previous messages, **When** they reference "that task" or "the one I mentioned", **Then** the AI agent correctly identifies the task from conversation history
3. **Given** a user starts a new conversation session, **When** they send a message, **Then** the system fetches their previous conversation history and provides it to the AI agent for context

---

### Edge Cases

- What happens when the MCP server is unavailable or not responding?
- How does the system handle malformed or ambiguous user messages that don't map to any MCP tool?
- What occurs when conversation history is very long (100+ messages) and needs truncation?
- How does the agent handle requests for tasks that don't exist (invalid task IDs)?
- What happens when a user's message could map to multiple tools (e.g., "Do something with task 5")?
- How does the system behave when database save fails after AI agent has already responded?
- What occurs when OpenAI API returns an error or times out?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a POST /api/{user_id}/chat endpoint that accepts user messages as JSON requests
- **FR-002**: System MUST initialize an AI agent using OpenAI Agents SDK that can interpret natural language task management commands
- **FR-003**: System MUST configure the AI agent with access to all 5 MCP tools (add_task, list_tasks, complete_task, update_task, delete_task) from Part 1
- **FR-004**: System MUST fetch conversation history from the messages table before processing each chat request to provide context to the AI agent
- **FR-005**: System MUST save the user's incoming message to the messages table before AI processing
- **FR-006**: System MUST save the AI agent's response to the messages table after processing completes
- **FR-007**: System MUST create a new conversation record if the user doesn't have an existing active conversation
- **FR-008**: System MUST ensure the AI agent correctly routes user intents to the appropriate MCP tools
- **FR-009**: System MUST handle cases where the AI agent calls multiple MCP tools in sequence to fulfill a request
- **FR-010**: System MUST return the AI agent's response to the user via the HTTP response
- **FR-011**: System MUST maintain stateless operation - no server-side session state between requests
- **FR-012**: System MUST validate that the user_id in the URL matches the authenticated user (for testing phase, user_id can be hardcoded)
- **FR-013**: System MUST handle errors from the MCP server gracefully and return appropriate error messages to users
- **FR-014**: System MUST handle OpenAI API failures and timeouts with appropriate fallback messages
- **FR-015**: System MUST truncate conversation history if it exceeds OpenAI context window limits (assume 4000 tokens as reasonable default, keep most recent messages)

### Key Entities *(include if feature involves data)*

- **Chat Request**: Represents an incoming message from a user, containing user_id from URL path and message content from request body
- **Chat Response**: Represents the system's response, containing the AI agent's generated message and any tool call results
- **Conversation Context**: Represents the historical messages loaded from database to provide context to the AI agent, including both user and assistant messages in chronological order

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can send task management commands via chat and receive appropriate responses within 5 seconds
- **SC-002**: The AI agent correctly interprets task creation requests and successfully creates tasks in 95% of clear, well-formed messages
- **SC-003**: The AI agent correctly routes different task operations (create, list, complete, update, delete) to the appropriate tools based on user intent
- **SC-004**: Conversation context is maintained across requests - users can reference previous tasks without repeating details
- **SC-005**: The chat endpoint works reliably with direct HTTP requests from tools like Postman or curl without requiring a web interface
- **SC-006**: All user messages and AI responses are persisted in the database and retrievable in subsequent conversations
- **SC-007**: The system handles errors gracefully - when MCP tools fail or AI agent encounters issues, users receive helpful error messages rather than technical failures
- **SC-008**: The system supports at least 50 messages of conversation history before requiring truncation for context window limits

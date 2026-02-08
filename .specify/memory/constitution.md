<!-- SYNC IMPACT REPORT
Version change: 1.0.0 → 1.1.0
Modified principles: None (new principles added)
Added sections: Core Principles (conversational-first, stateless, MCP-driven, spec-driven)
Removed sections: None
Templates requiring updates:
- ✅ .specify/templates/plan-template.md (updated)
- ✅ .specify/templates/spec-template.md (updated)
- ✅ .specify/templates/tasks-template.md (updated)
- ✅ .specify/templates/commands/sp.constitution.md (updated)
Added new section: Technology Stack and Constraints
Follow-up TODOs: None
-->
# Todo App Phase 3 - AI Chatbot Constitution

## Core Principles

### Conversational-First
Natural language interaction over traditional UI controls; All features must be accessible via conversational commands; Design for chat-first experiences where buttons are fallback, not primary interface.

### Stateless Architecture
Zero server memory between requests; Database stores all application state; Server restarts must preserve all user data and conversation history without loss.

### MCP-Driven Communication
Standardized tools for AI-to-app communication using official MCP SDK; All backend operations exposed as MCP tools; Strict adherence to MCP specifications and protocols.

### Spec-Driven Development
Write specifications first, then implement; All features documented before coding begins; Implementation must match spec exactly, spec changes require approval.

### Type-Safe Development
Type hints required on all Python functions; Static type checking enforced; Error handling with try-except on all database and AI operations; Comprehensive logging for debugging and monitoring.

### Security-First Approach
JWT validation required on every request; User ID validation to prevent cross-user data access; Parameterized queries only to prevent injection; API keys stored in environment variables exclusively.

## Technology Stack and Constraints

### Mandatory Technologies
**Frontend**: OpenAI ChatKit only (no custom chat UI)
**AI**: OpenAI Agents SDK only (no direct API calls)
**Tools**: Official MCP SDK (Python) only (no LangChain)
**Backend**: FastAPI + SQLModel + Neon DB only
**Authentication**: Better Auth JWT (leverage existing)

### Prohibited Technologies
- Custom chat interfaces (must use ChatKit)
- LangChain or alternative AI frameworks
- Direct OpenAI API calls (must use Agents SDK)
- Stateful session management
- Hardcoded credentials or secrets

### Database Schema Requirements
**Preserved Tables**: users, tasks (never modify)
**New Required Tables**:
- conversations (id, user_id, created_at, updated_at)
- messages (id, conversation_id, user_id, role, content, created_at)

### MCP Tools Specification (Exactly 5 Required)
1. add_task(user_id, title, description?) - Create new tasks
2. list_tasks(user_id, status?) - Retrieve task lists
3. complete_task(user_id, task_id) - Mark tasks as complete
4. delete_task(user_id, task_id) - Remove tasks
5. update_task(user_id, task_id, title?, description?) - Modify existing tasks

### Immutable Request Flow
```
User → ChatKit → POST /api/{user_id}/chat
→ Validate JWT → Fetch history from DB
→ Save user message → OpenAI Agent + MCP tools
→ Save assistant message → Return response
→ Discard state (stateless!)
```

## Development Standards

### Code Quality Requirements
- Type hints: Required on all Python functions
- Error handling: Try-except blocks on all DB/AI operations
- Logging: INFO level for actions, ERROR for failures
- Testing: At least one unit test per MCP tool
- Documentation: Inline comments for complex logic

### Performance Standards
- Response time: Less than 3 seconds for typical requests
- Command interpretation: 90%+ accuracy rate
- Database operations: Optimized with proper indexing
- Memory usage: Minimal during request processing

### Success Criteria
- Task operations via chat: Add/list/complete/delete/update
- Conversation context: Maintained across requests
- Data persistence: Survives server restarts
- Authentication: Validated on every request
- Performance: Meets response time requirements
- Documentation: Complete README, CLAUDE.md, and templates

## Governance

All development must comply with these constitutional principles. Amendments require explicit approval and migration planning. Code reviews must verify compliance with all technology stack constraints and architectural decisions. Any deviation from mandated technologies or prohibited tools requires constitutional amendment first.

Version control must track all changes to ensure reproducible builds. Automated testing must cover all MCP tools before merging. Security validation must occur on every deployment to verify JWT compliance and user isolation.

**Version**: 1.1.0 | **Ratified**: 2026-02-08 | **Last Amended**: 2026-02-08
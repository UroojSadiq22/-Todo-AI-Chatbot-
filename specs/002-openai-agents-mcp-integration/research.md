# Research Findings: OpenAI Agents SDK with MCP Tools Integration

## Overview
This document captures research findings for implementing a stateless chat endpoint that integrates OpenAI Agents SDK with MCP tools for conversational task management in the todo app.

## Key Decisions Made

### 1. OpenAI Agents SDK Configuration
- **Decision**: Use OpenAI Assistant API with tools configuration
- **Rationale**: The Agents SDK provides better orchestration of tool calls compared to raw API, with automatic tool calling capabilities
- **Alternatives considered**:
  - Raw OpenAI API with manual tool calling - rejected due to complexity
  - LangChain agents - rejected due to constitution prohibition
- **Implementation approach**: Create an Assistant with tool definitions that reference our MCP tools

### 2. MCP Tools Integration Strategy
- **Decision**: Register MCP tools as function tools in the OpenAI Assistant
- **Rationale**: MCP tools already exist from Part 1, we need to adapt them for OpenAI's function calling interface
- **Alternatives considered**:
  - Building separate function tools - rejected as it duplicates functionality
  - Proxy MCP tools through custom API - rejected as unnecessarily complex
- **Implementation approach**: Create function definitions that wrap existing MCP tools

### 3. Conversation History Management
- **Decision**: Load last N messages (20) from database before each request
- **Rationale**: Prevents token overflow while maintaining sufficient context for conversation continuity
- **Alternatives considered**:
  - Load full conversation history - rejected due to token limit concerns
  - Client-side history management - rejected due to stateless requirement
- **Implementation approach**: Query messages table by conversation_id, order by timestamp, limit to 20 most recent

### 4. Conversation Creation Strategy
- **Decision**: Auto-create conversation on first message if none exists
- **Rationale**: Provides better user experience with simpler API - no need to manage conversation_ids externally
- **Alternatives considered**:
  - Require explicit conversation_id in request - rejected as it adds complexity for clients
  - Create conversation per request - rejected as it breaks continuity
- **Implementation approach**: Check for existing conversation, create new one if not found

### 5. Message Persistence Strategy
- **Decision**: Save user message first, then assistant response
- **Rationale**: Ensures audit trail even if assistant fails to respond, maintains consistent message ordering
- **Alternatives considered**:
  - Batch save both messages - rejected as it could lead to orphaned messages if one fails
  - Save only on success - rejected as it loses user input on failures
- **Implementation approach**: Two-step process - save user message, call agent, save assistant response

### 6. Error Handling Approach
- **Decision**: Graceful degradation with informative error messages
- **Rationale**: Maintain system availability when individual components fail, provide helpful feedback to users
- **Alternatives considered**:
  - Fail fast on any error - rejected as it reduces reliability
  - Silent error handling - rejected as it hides problems from users
- **Implementation approach**: Try-catch blocks around all operations with appropriate fallbacks

## Technical Challenges Identified

### Token Limit Management
- **Challenge**: Long conversation histories can exceed OpenAI's token limits
- **Solution**: Implement truncation strategy that keeps recent messages while discarding older ones
- **Implementation**: Limit to last 20 messages, configurable parameter

### MCP Server Availability
- **Challenge**: MCP server may be down or slow to respond
- **Solution**: Implement timeout and retry mechanisms with graceful fallback messages
- **Implementation**: Use asyncio with timeout wrappers around MCP calls

### Type Safety for MCP Tool Parameters
- **Challenge**: Ensuring proper typing between OpenAI function calls and MCP tool parameters
- **Solution**: Define Pydantic models that match MCP tool signatures
- **Implementation**: Create BaseModel subclasses that mirror MCP tool function signatures

## Best Practices Applied

### Security Considerations
- JWT validation on every request
- User ID validation to prevent cross-user data access
- Parameterized queries to prevent SQL injection
- Input sanitization for user messages

### Performance Optimization
- Efficient database queries with proper indexing
- Async/await patterns for non-blocking operations
- Connection pooling for database operations
- Caching strategies for frequently accessed data

### Error Handling Patterns
- Comprehensive exception handling around all external calls
- Structured logging for debugging and monitoring
- Circuit breaker patterns for external service calls
- Graceful degradation when components fail

## Technology Stack Alignment
All decisions align with the constitutional requirements:
- Uses OpenAI Agents SDK (not raw API)
- MCP tools implemented with official SDK (not LangChain)
- Stateless architecture with database as source of truth
- Type-safe Python with proper error handling
- JWT validation on every request
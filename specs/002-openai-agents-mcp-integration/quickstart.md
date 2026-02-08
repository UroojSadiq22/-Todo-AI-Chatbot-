# Quickstart Guide: OpenAI Agents SDK with MCP Tools Integration

## Overview
This guide provides a quick setup and development workflow for the conversational task management system that integrates OpenAI Agents SDK with MCP tools.

## Prerequisites
- Python 3.11+
- pip package manager
- Running MCP server from Part 1
- OpenAI API key
- NeonDB connection string
- Running backend server

## Environment Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set environment variables:
```bash
export OPENAI_API_KEY="your_openai_api_key"
export DATABASE_URL="your_neondb_connection_string"
export JWT_SECRET="your_jwt_secret"
```

3. Ensure MCP server is running on the expected port (typically localhost:8080)

## Development Workflow

### 1. Running the Backend Server
```bash
cd backend
uvicorn src.main:app --reload --port 8000
```

### 2. Testing the Chat Endpoint
Use curl or Postman to test the endpoint:

```bash
curl -X POST "http://localhost:8000/api/test_user_id/chat" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TEST_JWT" \
  -d '{"message": "Add a task to buy groceries"}'
```

### 3. Running Tests
```bash
# Run all tests
pytest

# Run specific test file
pytest tests/unit/test_conversation.py

# Run with coverage
pytest --cov=src
```

## Key Components

### Models
- `src/models/conversation.py`: Defines the Conversation entity
- `src/models/message.py`: Defines the Message entity

### Services
- `src/services/conversation_service.py`: Contains conversation and message operations

### API Endpoints
- `src/api/chat.py`: Implements the chat endpoint logic

### Main Application
- `src/main.py`: Application entry point and configuration

## Database Migrations
```bash
# Apply migrations
alembic upgrade head

# Create new migration
alembic revision --autogenerate -m "Description of change"
```

## Common Development Tasks

### Adding a New MCP Tool
1. Ensure the tool exists in your MCP server
2. Update the assistant configuration to include the new tool
3. Test that the AI correctly recognizes and uses the tool

### Updating Conversation Context Window
1. Modify the limit in the conversation service (currently 20 messages)
2. Consider the impact on token usage and response times
3. Update tests to reflect the new limit

### Modifying Message Persistence
1. Update the data models if changing the schema
2. Adjust the save logic in the conversation service
3. Update any affected tests

## Troubleshooting

### Common Issues

#### MCP Server Unavailable
- Ensure the MCP server is running and accessible
- Check that the connection details match configuration
- Verify the MCP tools are correctly exposed

#### OpenAI API Errors
- Confirm your API key is valid and has sufficient quota
- Check for rate limiting issues
- Verify the assistant configuration is correct

#### JWT Validation Failures
- Ensure the JWT secret matches between services
- Verify the token format and expiration
- Check that the user_id in the path matches the token

#### Database Connection Issues
- Verify the database URL is correctly formatted
- Check that the database service is running
- Confirm proper network connectivity

## Testing Strategies

### Unit Tests
Test individual components in isolation:
- Conversation service methods
- Message persistence logic
- Helper functions

### Integration Tests
Test the full chat flow:
- End-to-end chat endpoint calls
- MCP tool interactions
- Database persistence verification

### Manual Testing
Use Postman or curl to test various conversation flows:
- Basic task creation: "Add a task to buy groceries"
- Task listing: "Show me my tasks"
- Task operations: "Complete task 1", "Update task 2"
- Conversation continuity: Multiple messages in sequence

## Deployment Notes

### Environment Variables Required
- `OPENAI_API_KEY`: OpenAI API key for agent operations
- `DATABASE_URL`: Connection string for NeonDB
- `JWT_SECRET`: Secret for JWT token validation
- `MCP_SERVER_URL`: URL for MCP server connection
- `ENVIRONMENT`: Production/development mode setting

### Scaling Considerations
- Conversation history truncation to manage token usage
- Database indexing for efficient message retrieval
- Rate limiting to prevent API abuse
- Connection pooling for database operations
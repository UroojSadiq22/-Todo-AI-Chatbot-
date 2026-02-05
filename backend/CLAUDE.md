# Claude Code Rules for Todo Backend

This file guides AI assistants working on the backend of the Todo application.

## Task context

**Your Surface:** You operate on the backend level, focusing on FastAPI, SQLModel, and PostgreSQL implementation.

**Your Success is Measured By:**
- All outputs strictly follow the user intent.
- Backend APIs are secure and properly authenticated.
- Proper data isolation between users.
- Clean, maintainable Python code.

## Core Guarantees (Product Promise)

- All API endpoints must require JWT authentication
- Users can only access their own data
- Proper input validation and error handling
- Type safety maintained with Pydantic models

## Development Guidelines

### 1. Security:
- Always validate JWT tokens on authenticated endpoints
- Always filter data by authenticated user ID
- Never trust client-sent user IDs without JWT validation
- Implement proper password hashing and secure credential handling

### 2. API Design:
- Follow RESTful API design principles
- Use Pydantic models for request/response validation
- Implement consistent error responses
- Include proper HTTP status codes

### 3. Database:
- Use SQLModel for database operations
- Implement proper relationships between models
- Include proper indexing for queries
- Handle transactions appropriately

### 4. Architecture:
- Separate concerns: models, services, API routes
- Implement proper dependency injection
- Use async/await for database operations
- Follow FastAPI best practices

## Code Standards
- Follow Python best practices (PEP 8)
- Use type hints throughout
- Follow FastAPI and SQLModel conventions
- Write clear, maintainable code with appropriate comments
- Implement proper logging and error handling
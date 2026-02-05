# Implementation Plan: User Authentication with BetterAuth

**Feature**: User Authentication with BetterAuth
**Branch**: 1-auth
**Created**: 2026-01-11
**Status**: Draft

## Technical Context

This plan outlines the implementation of user authentication using BetterAuth with JWT tokens, secure password hashing, and NeonDB storage. The implementation will cover:

- Backend authentication endpoints (register, login)
- JWT token generation and validation
- NeonDB connection and user data storage
- Protected todos endpoints with authorization
- Frontend integration with JWT tokens

**Technical Context:**
- Backend uses FastAPI framework with SQLModel ORM
- NeonDB connection configured via DATABASE_URL environment variable
- JWT-based authentication implemented with python-jose and passlib
- User isolation enforced through user_id foreign keys and authentication middleware

## Constitution Check

This implementation must comply with the project constitution:

✅ **Security First**: JWT validation on all protected endpoints, user isolation
✅ **Clean Architecture**: Clear separation between frontend/backend
✅ **API Rules**: All endpoints RESTful and JWT-protected
✅ **Security Standards**: JWT validation, user identity from token, 401 for unauthorized
✅ **Implementation Constraints**: Backend filters by authenticated user

## Gates

- [x] **Dependencies Resolved**: NeonDB connection and JWT integration confirmed
- [x] **Architecture Compliant**: Solution follows monorepo structure with clear separation
- [x] **Security Verified**: JWT validation implemented on all protected endpoints
- [x] **Data Isolation**: Users can only access their own data

## Phase 0: Research & Unknown Resolution

### Research Tasks

1. **Backend Structure Analysis**: Understand current backend architecture and dependencies
2. **NeonDB Configuration**: Research NeonDB connection setup for FastAPI application
3. **BetterAuth Integration**: Investigate BetterAuth integration patterns with FastAPI
4. **JWT Implementation**: Study JWT token handling in FastAPI applications

### Expected Outcomes

- Clear understanding of backend structure and dependencies
- NeonDB connection configuration approach
- BetterAuth integration strategy with FastAPI
- JWT token handling implementation plan

## Phase 1: Design & Contracts

### Data Model

#### User Entity
- id: UUID (primary key)
- email: String (unique, indexed)
- password_hash: String (securely hashed)
- created_at: DateTime
- updated_at: DateTime
- is_active: Boolean (default: true)

#### Todo Entity
- id: UUID (primary key)
- title: String
- description: Text (optional)
- completed: Boolean (default: false)
- user_id: UUID (foreign key to User)
- created_at: DateTime
- updated_at: DateTime

### API Contracts

#### Authentication Endpoints

**POST /api/auth/register**
- Request: `{email: string, password: string}`
- Response: `{user: {id, email}, token: string, message: string}`
- Status Codes: 201 (success), 400 (validation error), 409 (email exists)

**POST /api/auth/login**
- Request: `{email: string, password: string}`
- Response: `{user: {id, email}, token: string, message: string}`
- Status Codes: 200 (success), 400 (validation error), 401 (invalid credentials)

#### Protected Todo Endpoints

**GET /api/todos**
- Headers: `Authorization: Bearer {token}`
- Response: `{todos: Array<Todo>}`
- Status Codes: 200 (success), 401 (unauthorized)

**POST /api/todos**
- Headers: `Authorization: Bearer {token}`
- Request: `{title: string, description?: string}`
- Response: `{todo: Todo}`
- Status Codes: 201 (created), 401 (unauthorized)

**PUT /api/todos/{id}**
- Headers: `Authorization: Bearer {token}`
- Request: `{title?: string, description?: string, completed?: boolean}`
- Response: `{todo: Todo}`
- Status Codes: 200 (updated), 401 (unauthorized), 403 (not owner)

**DELETE /api/todos/{id}**
- Headers: `Authorization: Bearer {token}`
- Response: `{message: string}`
- Status Codes: 200 (deleted), 401 (unauthorized), 403 (not owner)

### Authentication Middleware Contract

Middleware function that:
- Extracts JWT token from Authorization header
- Validates token signature and expiration
- Verifies user identity from token
- Attaches user information to request context
- Returns 401 for invalid/missing tokens

## Phase 2: Implementation Steps

### Step 1: Update Backend Dependencies
- Add NeonDB drivers and connection libraries
- Add JWT handling libraries
- Add BetterAuth-compatible authentication libraries
- Update requirements.txt with new dependencies

### Step 2: Configure NeonDB Connection
- Set up database configuration with NeonDB connection string
- Create database models for User and Todo entities
- Implement database initialization and migration
- Test database connectivity

### Step 3: Implement Registration Endpoint
- Create POST /api/auth/register endpoint
- Validate email format and password strength
- Hash password using secure algorithm (bcrypt)
- Save user to NeonDB
- Generate JWT token for authenticated session
- Return user info and token

### Step 4: Implement Login Endpoint
- Create POST /api/auth/login endpoint
- Verify user credentials against stored hash
- Generate JWT token upon successful authentication
- Return user info and token

### Step 5: Create JWT Authentication Middleware
- Implement middleware to validate JWT tokens
- Extract user information from token
- Attach user context to requests
- Return 401 for invalid/missing tokens

### Step 6: Protect Todos Endpoints
- Apply JWT middleware to all todo endpoints
- Add user ID filtering to GET /api/todos
- Add ownership verification to PUT/DELETE operations
- Return 403 for unauthorized access attempts

### Step 7: Update Frontend for JWT Integration
- Modify frontend to store JWT tokens securely
- Add Authorization header to all protected API calls
- Handle 401/403 responses appropriately
- Implement token refresh or re-authentication flow

### Step 8: Testing and Validation
- Test complete user flow: register → login → todos → logout
- Verify user isolation (users can't access others' data)
- Test error scenarios and edge cases
- Validate security measures are effective

## Risks & Mitigations

- **Risk**: JWT token security vulnerabilities
  - **Mitigation**: Use strong signing algorithm, proper expiration, secure storage

- **Risk**: Password storage security issues
  - **Mitigation**: Use bcrypt or similar for password hashing, enforce strong password policies

- **Risk**: User data isolation failures
  - **Mitigation**: Implement strict user ID filtering on all database queries

- **Risk**: Database connection issues
  - **Mitigation**: Implement proper error handling and connection pooling

## Success Criteria

- [ ] Users can register and login successfully
- [ ] JWT tokens are properly generated and validated
- [ ] Users can only access their own todo items
- [ ] All protected endpoints reject unauthorized requests
- [ ] Frontend properly sends JWT tokens in headers
- [ ] Complete user flow works end-to-end
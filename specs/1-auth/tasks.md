# Tasks: User Authentication with BetterAuth

**Feature**: User Authentication with BetterAuth
**Branch**: 1-auth
**Created**: 2026-01-11
**Status**: Draft

## Phase 1: Setup

### Goal
Initialize project with required dependencies and configurations for authentication system.

### Tasks
- [x] T001 Update backend dependencies with JWT and password hashing libraries in backend/requirements.txt
- [x] T002 Configure NeonDB connection in backend/src/config.py with proper DATABASE_URL handling
- [x] T003 [P] Create authentication utility module in backend/src/auth/jwt_handler.py
- [x] T004 [P] Create authentication middleware in backend/src/auth/middleware.py
- [x] T005 [P] Create database models for User and Todo entities in backend/src/models/

## Phase 2: Foundational

### Goal
Implement core authentication infrastructure that all user stories depend on.

### Tasks
- [x] T006 Implement password hashing functions in backend/src/auth/jwt_handler.py
- [x] T007 Create JWT token generation and verification functions in backend/src/auth/jwt_handler.py
- [x] T008 [P] Create User model with proper fields and constraints in backend/src/models/user.py
- [x] T009 [P] Create Todo model with proper fields and user relationship in backend/src/models/todo.py
- [x] T010 Implement authentication middleware with token validation in backend/src/auth/middleware.py
- [x] T011 [P] Update existing todos endpoints to accept user_id parameter in backend/src/api/todos.py

## Phase 3: User Story 1 - New User Registration (P1)

### Goal
Enable new users to create accounts with secure registration process that stores their data safely in NeonDB.

### Independent Test Criteria
Can be fully tested by creating a new user account and verifying the user data is stored in the database, delivering the ability for new users to join the platform.

### Acceptance Scenarios
1. Given a visitor is on the registration page, When they submit valid registration details (email, password), Then a new user account is created with secure password hashing and the user is logged in.
2. Given a visitor enters invalid registration details, When they submit the form, Then appropriate validation errors are shown without creating an account.

### Tasks
- [x] T012 [US1] Create registration request/response models in backend/src/models/auth.py
- [x] T013 [US1] Implement email validation logic in backend/src/services/user_service.py
- [x] T014 [US1] Create POST /api/auth/register endpoint in backend/src/api/auth.py
- [x] T015 [US1] Implement password validation and hashing in registration endpoint
- [x] T016 [US1] Implement user creation in NeonDB with proper error handling in registration endpoint
- [x] T017 [US1] Generate JWT token upon successful registration in registration endpoint
- [x] T018 [US1] Return user info and token in registration response
- [x] T019 [US1] Add validation for duplicate email handling in registration endpoint

## Phase 4: User Story 2 - User Login and Authentication (P1)

### Goal
Allow existing users to securely log into the application using their credentials and maintain a valid session.

### Independent Test Criteria
Can be fully tested by logging in with valid credentials and accessing protected resources, delivering secure access to user-specific functionality.

### Acceptance Scenarios
1. Given a user has registered an account, When they enter correct login credentials, Then they are authenticated and receive a valid JWT token for session management.
2. Given a user enters incorrect login credentials, When they attempt to log in, Then authentication fails with appropriate error messaging.

### Tasks
- [x] T020 [US2] Create login request/response models in backend/src/models/auth.py
- [x] T021 [US2] Implement password verification logic in backend/src/services/user_service.py
- [x] T022 [US2] Create POST /api/auth/login endpoint in backend/src/api/auth.py
- [x] T023 [US2] Implement user credential validation in login endpoint
- [x] T024 [US2] Generate JWT token upon successful login in login endpoint
- [x] T025 [US2] Return user info and token in login response
- [x] T026 [US2] Add proper error handling for invalid credentials in login endpoint

## Phase 5: User Story 3 - Todos CRUD Operations with Authorization (P2)

### Goal
Enable authenticated users to create, read, update, and delete their personal todo items with proper authorization controls.

### Independent Test Criteria
Can be fully tested by performing all CRUD operations on todo items as an authenticated user, delivering the core todo management functionality.

### Acceptance Scenarios
1. Given a user is authenticated, When they create a new todo item, Then the item is stored in NeonDB linked to their user account and accessible only to them.
2. Given a user has created todo items, When they request their todo list, Then they receive only their own items filtered by their user ID.
3. Given a user owns a todo item, When they update or delete it, Then the operation succeeds and affects only their data.

### Tasks
- [x] T027 [US3] Update GET /api/todos endpoint to filter by authenticated user in backend/src/api/todos.py
- [x] T028 [US3] Update POST /api/todos endpoint to associate todo with authenticated user in backend/src/api/todos.py
- [x] T029 [US3] Update PUT /api/todos/{id} endpoint to verify todo ownership in backend/src/api/todos.py
- [x] T030 [US3] Update DELETE /api/todos/{id} endpoint to verify todo ownership in backend/src/api/todos.py
- [x] T031 [US3] Apply JWT authentication middleware to all todo endpoints in backend/src/api/todos.py
- [x] T032 [US3] Implement user ID extraction from JWT token in todo endpoints
- [x] T033 [US3] Add authorization checks to prevent cross-user data access in todo endpoints

## Phase 6: Frontend Integration

### Goal
Integrate authentication functionality with frontend to provide complete user experience.

### Tasks
- [x] T034 Create authentication service in frontend/src/services/auth.ts
- [x] T035 Implement JWT token storage and retrieval in frontend authentication service
- [x] T036 Update frontend API service to include Authorization header in frontend/src/services/api.ts
- [x] T037 Create registration form component in frontend/src/components/Auth/Register.tsx
- [x] T038 Create login form component in frontend/src/components/Auth/Login.tsx
- [x] T039 Update navigation to show/hide auth links based on authentication status in frontend/src/components/Navbar.tsx
- [x] T040 Implement protected route handling in frontend/src/components/Routes/ProtectedRoute.tsx

## Phase 7: Polish & Cross-Cutting Concerns

### Goal
Complete the implementation with proper error handling, security measures, and testing.

### Tasks
- [x] T041 Add comprehensive error handling to all authentication endpoints
- [x] T042 Implement proper logging for authentication events
- [x] T043 Add input validation and sanitization to all endpoints
- [x] T044 Update environment variables documentation with authentication settings
- [x] T045 Test complete user flow: register → login → todos → logout
- [x] T046 Verify user isolation (users can't access others' data)
- [x] T047 Test error scenarios and edge cases
- [x] T048 Update README with authentication setup instructions

## Dependencies

### User Story Completion Order
1. User Story 1 (Registration) - Foundation for all other stories
2. User Story 2 (Login) - Builds on registration
3. User Story 3 (Todos CRUD) - Depends on authentication from stories 1 & 2
4. Frontend Integration - Can be done in parallel after backend is complete

### Blocking Dependencies
- Phase 1 (Setup) must complete before any user story
- Phase 2 (Foundational) must complete before any user story

## Parallel Execution Examples

### Per User Story
- **User Story 1**: Models (T008) and Services (T013) can be developed in parallel
- **User Story 2**: Login models (T020) and services (T021) can be developed in parallel with registration
- **User Story 3**: All todo endpoints (T027-T030) can be worked on in parallel after authentication middleware is ready

## Implementation Strategy

### MVP First Approach
1. Complete Phase 1 & 2 (Setup and Foundational)
2. Complete User Story 1 (Registration) - Minimum viable for user creation
3. Complete User Story 2 (Login) - Enables user access
4. Complete core User Story 3 (Basic todos with auth) - Provides value to users
5. Complete remaining phases for full functionality

### Incremental Delivery
- **MVP**: Registration + Login + Basic todo access for authenticated users
- **Increment 1**: Full CRUD with authorization checks
- **Increment 2**: Frontend integration
- **Increment 3**: Error handling, testing, and polish
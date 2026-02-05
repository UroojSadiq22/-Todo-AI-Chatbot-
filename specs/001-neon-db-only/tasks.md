# Implementation Tasks: Convert Backend to Neon PostgreSQL Only

## Feature Overview
Refactor the backend to use Neon PostgreSQL as the single and only database, removing all local or alternative database configurations.

## Implementation Strategy
- Start with foundational configuration changes (Phase 1-2)
- Implement user stories in priority order (P1, P2, P3)
- Each phase delivers independently testable functionality
- Focus on MVP first (System startup with Neon PostgreSQL connection)

## Dependencies
- User Story 1 (P1) must complete before User Story 2 (P2)
- User Story 2 (P2) must complete before User Story 3 (P3)

## Parallel Execution Examples
- [P] tasks can be executed in parallel with other [P] tasks
- Database configuration tasks can run in parallel with API endpoint tasks within each story

---

## Phase 1: Setup

- [X] T001 Create/update .env file with Neon PostgreSQL DATABASE_URL at repository root
- [X] T002 Install required dependencies (sqlalchemy, asyncpg, psycopg2-binary) in backend requirements.txt
- [X] T003 Verify backend project structure exists as planned in implementation plan

## Phase 2: Foundational Configuration

- [X] T004 [P] Clean up legacy database configuration code from backend/src/config.py (remove commented sections)
- [X] T005 [P] Update backend/src/config.py to enforce single DATABASE_URL with proper validation
- [X] T006 [P] Verify backend/src/database/session.py is properly configured for async operations
- [X] T007 [P] Update backend/src/database/__init__.py to export proper database components
- [X] T008 [P] Verify Pydantic settings configuration follows "extra = allow" approach

## Phase 3: User Story 1 - System Startup with Neon PostgreSQL Connection (Priority: P1)

**Story Goal**: As a system administrator, I want the application to connect reliably to Neon PostgreSQL database upon startup, so that users can access the application without database connection errors.

**Independent Test**: Can be fully tested by starting the application and verifying it connects to the Neon PostgreSQL database without errors, delivering a functional backend that can serve requests.

**Acceptance Scenarios**:
1. Given Neon PostgreSQL database is accessible via DATABASE_URL, When the application starts, Then the application connects successfully to the Neon database without startup errors
2. Given The application has valid Neon PostgreSQL credentials, When the application attempts to initialize the database connection pool, Then the connection pool is established successfully

- [X] T009 [P] [US1] Update backend/src/config.py to validate Neon PostgreSQL connection string format
- [X] T010 [P] [US1] Implement database connection validation in backend/src/main.py at startup
- [X] T011 [P] [US1] Add connection pool configuration optimized for Neon's serverless architecture
- [X] T012 [US1] Implement fail-fast mechanism in backend/src/main.py if database connection fails
- [X] T013 [US1] Add startup logging to confirm successful database connection
- [ ] T014 [US1] Test application startup with valid Neon PostgreSQL credentials
- [ ] T015 [US1] Test application fails gracefully with clear error if Neon credentials are invalid

## Phase 4: User Story 2 - User Registration with Neon PostgreSQL Storage (Priority: P2)

**Story Goal**: As a new user, I want to register for an account and have my user data saved in the Neon PostgreSQL database, so that I can access the application with my credentials.

**Independent Test**: Can be fully tested by registering a new user and verifying the user data is stored in Neon PostgreSQL, delivering the ability to persist user identities.

**Acceptance Scenario**:
1. Given I am a new user attempting to register, When I submit valid registration data, Then my user record is successfully created in the Neon PostgreSQL database

- [X] T016 [P] [US2] Verify User model in backend/src/models/user.py is compatible with Neon PostgreSQL
- [X] T017 [P] [US2] Update User model to use UUID primary key as specified in data model
- [X] T018 [P] [US2] Ensure User model has proper validation rules for email and username uniqueness
- [X] T019 [P] [US2] Implement user registration service in backend/src/services/auth_service.py
- [X] T020 [P] [US2] Update auth router to handle user registration in backend/src/api/auth_router.py
- [X] T021 [US2] Create API endpoint for user registration following OpenAPI contract
- [X] T022 [US2] Implement password hashing for user registration
- [ ] T023 [US2] Test user registration creates records in Neon DB
- [ ] T024 [US2] Verify user registration follows Neon PostgreSQL-specific validation rules

## Phase 5: User Story 3 - All Database Operations Use Neon PostgreSQL (Priority: P3)

**Story Goal**: As an existing user, I want all application data operations (read, write, update, delete) to use Neon PostgreSQL, so that the database is centralized and consistent.

**Independent Test**: Can be fully tested by performing CRUD operations and verifying all data interactions occur with Neon PostgreSQL, delivering a unified data persistence layer.

**Acceptance Scenario**:
1. Given User data exists in Neon PostgreSQL, When I perform any data operation (read, write, update, delete), Then all operations are executed against the Neon PostgreSQL database

- [X] T025 [P] [US3] Verify Todo model in backend/src/models/todo.py is compatible with Neon PostgreSQL
- [X] T026 [P] [US3] Update Todo model to use UUID primary key and proper foreign key relationship to User
- [X] T027 [P] [US3] Implement Todo service in backend/src/services/todo_service.py with Neon-compatible operations
- [X] T028 [P] [US3] Update todo router to handle CRUD operations in backend/src/api/todo_router.py
- [X] T029 [US3] Create API endpoints for Todo operations (GET, POST, PUT, DELETE)
- [X] T030 [US3] Ensure all database operations use async SQLAlchemy with asyncpg
- [ ] T031 [US3] Test all CRUD operations work with Neon DB
- [X] T032 [US3] Verify proper foreign key constraints and relationships work in Neon PostgreSQL
- [ ] T033 [US3] Test connection pooling works correctly during multiple concurrent operations

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T034 Remove any duplicate or unused database configuration variables from .env file
- [ ] T035 Update documentation to reflect Neon PostgreSQL-only configuration
- [X] T036 Verify all database operations route through Neon PostgreSQL exclusively (no alternatives)
- [ ] T037 Test application maintains stable connection to Neon PostgreSQL during extended operation
- [ ] T038 Update README.md with Neon PostgreSQL setup instructions
- [ ] T039 Run complete integration test of all user stories together
- [X] T040 Verify no local or alternative database configurations remain in the codebase
# Data Model: Neon PostgreSQL Conversion

## Overview
This document defines the data entities and relationships for the Neon PostgreSQL-only backend implementation.

## Entity Definitions

### User Entity
**Name**: User
**Fields**:
- id: UUID (primary key, auto-generated)
- username: String (unique, required, max_length=50)
- email: String (unique, required, valid email format)
- hashed_password: String (required, encrypted)
- created_at: DateTime (auto-generated timestamp)
- updated_at: DateTime (auto-generated timestamp, updates on change)

**Relationships**:
- One-to-Many: User → Todos (user can have multiple todos)
- Validation: Email must be unique across all users

**State Transitions**:
- Created: When user registers successfully
- Updated: When user updates profile information
- Active: Default state after creation

### Todo Entity
**Name**: Todo
**Fields**:
- id: UUID (primary key, auto-generated)
- title: String (required, max_length=200)
- description: Text (optional)
- completed: Boolean (default: False)
- user_id: UUID (foreign key, references User.id)
- created_at: DateTime (auto-generated timestamp)
- updated_at: DateTime (auto-generated timestamp, updates on change)

**Relationships**:
- Many-to-One: Todo → User (todo belongs to one user)
- Validation: Todo can only be accessed by the owning user

**State Transitions**:
- Created: When todo is added by user
- Updated: When todo properties are changed
- Completed: When completed field is set to True
- Deleted: When todo is removed

## Database Schema Requirements

### Neon PostgreSQL Specifics
- Use UUID extension for primary keys
- Proper indexing on foreign keys (user_id in todos table)
- Timestamps with timezone awareness
- Connection pooling optimized for Neon's serverless architecture

### Validation Rules
- User.email: Must be unique and valid email format
- User.username: Must be unique and alphanumeric with underscores/hyphens
- Todo.user_id: Foreign key constraint to users table
- Access control: Users can only access their own todos

## API Contract Implications

### User Creation
- POST /api/users - Creates a new user record in Neon DB
- Requires: username, email, password
- Response: User object without sensitive fields

### Todo Operations
- GET /api/todos - Retrieve user's todos from Neon DB
- POST /api/todos - Create a new todo for user in Neon DB
- PUT /api/todos/{id} - Update user's todo in Neon DB
- DELETE /api/todos/{id} - Delete user's todo from Neon DB

## Migration Considerations

### Zero Downtime Requirements
- Existing data (if any) must be compatible with new schema
- Connection strings must be updated atomically
- No schema changes required (using existing SQLModel structure)

### Neon-Specific Optimizations
- Connection pooling settings optimized for Neon's serverless nature
- Proper SSL configuration for Neon connections
- Query optimization for Neon's distributed architecture
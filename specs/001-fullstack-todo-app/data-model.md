# Data Model: Full-Stack Todo Web Application

## Entity Definitions

### User
Represents a registered user of the system

**Fields**:
- `id`: UUID (Primary Key) - Unique identifier for the user
- `email`: String (Unique, Indexed) - User's email address for login
- `name`: String - User's display name
- `password_hash`: String - Hashed password for authentication
- `created_at`: DateTime - Timestamp of account creation
- `updated_at`: DateTime - Timestamp of last update

**Validation Rules**:
- Email must be valid email format
- Email must be unique across all users
- Name must be 1-100 characters
- Password must meet security requirements

**Relationships**:
- One-to-Many with Todo (one user has many todos)

### Todo
Represents a task item owned by a user

**Fields**:
- `id`: UUID (Primary Key) - Unique identifier for the todo
- `title`: String - Title of the todo task (required)
- `description`: Text - Optional detailed description of the task
- `completed`: Boolean - Whether the task is completed (default: false)
- `user_id`: UUID (Foreign Key) - Reference to the owning user
- `created_at`: DateTime - Timestamp of creation
- `updated_at`: DateTime - Timestamp of last update

**Validation Rules**:
- Title must be 1-200 characters
- User_id must reference an existing user
- Only the owner can modify/delete the todo

**State Transitions**:
- `incomplete` → `completed` (when marked as done)
- `completed` → `incomplete` (when unmarked)

**Relationships**:
- Many-to-One with User (many todos belong to one user)

## Database Schema

### Tables

#### users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

#### todos
```sql
CREATE TABLE todos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_todos_user_id ON todos(user_id);
CREATE INDEX idx_todos_completed ON todos(completed);
```

## Access Patterns

### User-Specific Queries
- Retrieve all todos for a specific user
- Count completed vs incomplete todos for a user
- Search/filter todos by title for a user

### Authentication Queries
- Find user by email for login
- Verify password hash during authentication

## Security Considerations

### Data Isolation
- All todo queries must be filtered by authenticated user ID
- Foreign key constraint ensures referential integrity
- Cascade delete removes user's todos when account is deleted

### Indexing Strategy
- Index on user_id for efficient filtering
- Index on email for fast authentication lookups
- Composite indexes for complex queries if needed
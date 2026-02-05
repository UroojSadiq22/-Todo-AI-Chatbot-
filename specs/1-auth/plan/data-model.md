# Data Model: User Authentication System

## User Entity

### Fields
- `id`: UUID (Primary Key, Auto-generated)
  - Unique identifier for each user
  - Generated as UUID4 on creation
- `email`: String (Unique, Indexed, Required)
  - User's email address for login
  - Must be valid email format
  - Case-insensitive uniqueness constraint
- `password_hash`: String (Required)
  - Securely hashed password using bcrypt
  - Never store plain text passwords
  - Minimum length after hashing validation
- `created_at`: DateTime (Auto-generated)
  - Timestamp when user account was created
  - UTC timezone
- `updated_at`: DateTime (Auto-generated, Auto-updated)
  - Timestamp when user account was last updated
  - Automatically updated on any changes
  - UTC timezone
- `is_active`: Boolean (Default: True)
  - Indicates if the user account is active
  - Can be set to False for deactivated accounts

### Validation Rules
- Email must match standard email format
- Email must be unique across all users
- Password must meet security requirements (min 8 chars, complexity)
- Email cannot be changed after account creation

### Relationships
- One-to-Many: User → Todos (user_id foreign key in todos table)

## Todo Entity

### Fields
- `id`: UUID (Primary Key, Auto-generated)
  - Unique identifier for each todo item
  - Generated as UUID4 on creation
- `title`: String (Required, Max 200 chars)
  - Title/description of the todo item
  - Cannot be empty
- `description`: Text (Optional)
  - Detailed description of the todo item
  - Can be null/empty
- `completed`: Boolean (Default: False)
  - Indicates if the todo item is completed
  - Allows for task tracking
- `user_id`: UUID (Foreign Key, Required)
  - Links the todo to the owning user
  - Enforces data isolation between users
- `created_at`: DateTime (Auto-generated)
  - Timestamp when todo was created
  - UTC timezone
- `updated_at`: DateTime (Auto-generated, Auto-updated)
  - Timestamp when todo was last updated
  - Automatically updated on any changes
  - UTC timezone

### Validation Rules
- Title must be provided and not empty
- Title must be 200 characters or less
- Only the owning user can modify the todo
- User_id must reference an existing active user

### Relationships
- Many-to-One: Todo → User (via user_id foreign key)

## JWT Token Structure

### Access Token Payload
- `sub`: User ID (UUID string)
- `email`: User email address
- `exp`: Expiration timestamp (typically 15 minutes)
- `iat`: Issued at timestamp
- `jti`: JWT ID for token tracking (optional)

### Refresh Token Payload
- `sub`: User ID (UUID string)
- `exp`: Expiration timestamp (typically 7 days)
- `iat`: Issued at timestamp
- `jti`: JWT ID for token tracking

## Database Indexes

### User Table
- Primary: id (UUID)
- Unique: email (case-insensitive)
- Index: is_active

### Todo Table
- Primary: id (UUID)
- Foreign Key: user_id (references User.id)
- Index: user_id
- Index: completed
- Composite: (user_id, completed) for efficient queries

## State Transitions

### User Account States
- Active (default): Can log in and access services
- Deactivated: Cannot log in, data remains
- Deleted: Account marked for deletion (soft delete approach)

### Todo Item States
- Pending (default): Created but not completed
- Completed: Task marked as done
- Archived: Completed task moved to archive (future extension)
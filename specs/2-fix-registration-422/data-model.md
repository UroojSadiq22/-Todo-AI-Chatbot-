# Data Model: User Registration

## Entities

### User
Represents a registered user with authentication credentials.

**Fields**:
- `id`: Unique identifier for the user (auto-generated)
- `email`: User's email address (required, validated)
- `username`: User's chosen username (required, unique)
- `password_hash`: Hashed password for authentication (required)
- `created_at`: Timestamp when account was created (auto-generated)
- `updated_at`: Timestamp when account was last modified (auto-generated)

**Validation Rules**:
- Email must be a valid email format
- Username must be unique across all users
- Password must meet minimum length requirements (8 characters)
- All required fields must be present

### Registration Request
Data structure for incoming registration requests.

**Fields**:
- `email`: User's email address (required)
- `username`: User's chosen username (required)
- `password`: User's chosen password (required, will be hashed)

**Validation Rules**:
- Email must be a valid email format
- Username must not already exist in the system
- Password must meet minimum length requirements
- All fields must be present and non-empty

### Registration Response
Data structure for registration response.

**Fields** (Success):
- `id`: The created user's unique identifier
- `email`: The user's email address
- `username`: The user's username
- `success`: Boolean indicating successful registration

**Fields** (Error):
- `error`: Error message describing the validation failure
- `field_errors`: Specific field validation errors (optional)

## Relationships
- One Registration Request maps to one User creation
- User entity persists in Neon PostgreSQL database

## State Transitions
- Registration Request (valid) → User (created) → Authentication Token (generated)
- Registration Request (invalid) → Error Response (returned)
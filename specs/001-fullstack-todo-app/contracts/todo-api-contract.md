# API Contracts: Full-Stack Todo Web Application

## Authentication API

### Register User
- **Endpoint**: `POST /api/auth/register`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "name": "John Doe",
    "password": "securePassword123"
  }
  ```
- **Response (201)**:
  ```json
  {
    "id": "uuid-string",
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2026-01-08T12:00:00Z"
  }
  ```
- **Response (400)**: Invalid input
- **Response (409)**: Email already exists

### Login User
- **Endpoint**: `POST /api/auth/login`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123"
  }
  ```
- **Response (200)**:
  ```json
  {
    "access_token": "jwt-token-string",
    "token_type": "bearer",
    "user": {
      "id": "uuid-string",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
  ```
- **Response (401)**: Invalid credentials

### Logout User
- **Endpoint**: `POST /api/auth/logout`
- **Headers**: `Authorization: Bearer <token>`
- **Response (200)**: Empty response

## Todo API

### Get User's Todos
- **Endpoint**: `GET /api/todos`
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `completed` (optional): boolean to filter by completion status
  - `limit` (optional): number to limit results
  - `offset` (optional): number for pagination
- **Response (200)**:
  ```json
  [
    {
      "id": "uuid-string",
      "title": "Complete project",
      "description": "Finish the todo application",
      "completed": false,
      "user_id": "user-uuid",
      "created_at": "2026-01-08T12:00:00Z",
      "updated_at": "2026-01-08T12:00:00Z"
    }
  ]
  ```

### Create Todo
- **Endpoint**: `POST /api/todos`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "title": "New task",
    "description": "Task description (optional)"
  }
  ```
- **Response (201)**:
  ```json
  {
    "id": "uuid-string",
    "title": "New task",
    "description": "Task description (optional)",
    "completed": false,
    "user_id": "user-uuid",
    "created_at": "2026-01-08T12:00:00Z",
    "updated_at": "2026-01-08T12:00:00Z"
  }
  ```
- **Response (400)**: Invalid input

### Get Specific Todo
- **Endpoint**: `GET /api/todos/{id}`
- **Headers**: `Authorization: Bearer <token>`
- **Response (200)**:
  ```json
  {
    "id": "uuid-string",
    "title": "Existing task",
    "description": "Task description",
    "completed": false,
    "user_id": "user-uuid",
    "created_at": "2026-01-08T12:00:00Z",
    "updated_at": "2026-01-08T12:00:00Z"
  }
  ```
- **Response (404)**: Todo not found or not owned by user
- **Response (401)**: Invalid token

### Update Todo
- **Endpoint**: `PUT /api/todos/{id}`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "title": "Updated task",
    "description": "Updated description (optional)",
    "completed": true
  }
  ```
- **Response (200)**:
  ```json
  {
    "id": "uuid-string",
    "title": "Updated task",
    "description": "Updated description (optional)",
    "completed": true,
    "user_id": "user-uuid",
    "created_at": "2026-01-08T12:00:00Z",
    "updated_at": "2026-01-08T13:00:00Z"
  }
  ```
- **Response (400)**: Invalid input
- **Response (404)**: Todo not found or not owned by user

### Toggle Todo Completion
- **Endpoint**: `PATCH /api/todos/{id}/toggle`
- **Headers**: `Authorization: Bearer <token>`
- **Response (200)**:
  ```json
  {
    "id": "uuid-string",
    "title": "Task title",
    "description": "Task description",
    "completed": true,
    "user_id": "user-uuid",
    "created_at": "2026-01-08T12:00:00Z",
    "updated_at": "2026-01-08T13:00:00Z"
  }
  ```
- **Response (404)**: Todo not found or not owned by user

### Delete Todo
- **Endpoint**: `DELETE /api/todos/{id}`
- **Headers**: `Authorization: Bearer <token>`
- **Response (204)**: Empty response
- **Response (404)**: Todo not found or not owned by user
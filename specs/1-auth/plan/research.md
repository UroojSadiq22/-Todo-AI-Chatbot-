# Research Findings: User Authentication Implementation

## Current Backend Structure Analysis

Based on the project files, the backend is structured as follows:
- Located in `backend/src/`
- Uses FastAPI framework
- Has configuration in `backend/src/config.py`
- Database models likely in `backend/src/models/`
- API routes in `backend/src/api/`

## NeonDB Configuration Approach

NeonDB can be configured as a PostgreSQL connection using:
- Environment variables for connection string
- Standard PostgreSQL drivers (asyncpg for async operations)
- Connection pooling for production use

Configuration typically involves:
- DATABASE_URL environment variable
- SQLModel/SQLAlchemy engine setup
- Connection string format: postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require

## BetterAuth Integration Strategy

BetterAuth is typically a frontend-focused authentication solution. For FastAPI backend integration, we'll need to implement a compatible JWT-based authentication system that works with BetterAuth's frontend expectations. The approach will be:
- Create custom JWT authentication in FastAPI
- Match token structure that BetterAuth expects
- Implement registration/login endpoints that generate compatible tokens
- Use standard JWT practices for security

## JWT Token Handling in FastAPI

Implementation approach:
- Use python-jose for JWT encoding/decoding
- Create authentication dependency for route protection
- Store secret key in environment variables
- Set appropriate expiration times (e.g., 15 min access tokens, 7 days refresh tokens)

## Recommended Libraries

- `fastapi`: Web framework
- `python-jose[cryptography]`: JWT handling
- `passlib[bcrypt]`: Password hashing
- `sqlmodel`: ORM (already in project)
- `asyncpg`: Async PostgreSQL driver
- `pydantic`: Data validation

## Implementation Path

1. Update dependencies with required packages
2. Configure database connection for NeonDB
3. Create User model with proper password hashing
4. Implement authentication endpoints
5. Create JWT middleware for route protection
6. Update existing todos endpoints with authorization
7. Integrate with frontend authentication flow
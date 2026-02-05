# Quickstart Guide: Neon PostgreSQL Backend

## Overview
This guide explains how to set up and run the backend with Neon PostgreSQL as the only database.

## Prerequisites
- Python 3.13+
- Neon PostgreSQL account and database
- pip package manager

## Setup Instructions

### 1. Get Neon PostgreSQL Connection String
1. Log in to your Neon Console
2. Select your project
3. Go to Project Settings → Connection Details
4. Copy the connection string in the format: `postgresql+asyncpg://username:password@ep-xxxxxx.us-east-1.aws.neon.tech/dbname?sslmode=require`

### 2. Configure Environment
Create/update the `.env` file in the repository root:

```bash
DATABASE_URL="postgresql+asyncpg://username:password@ep-xxxxxx.us-east-1.aws.neon.tech/dbname?sslmode=require"
SECRET_KEY="your-super-secret-key-change-this-in-production"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=15
DB_ECHO=false
```

### 3. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 4. Run the Application
```bash
cd backend/src
python main.py
```

## Key Configuration Points

### Single Database Approach
- Only `DATABASE_URL` is used (no alternatives)
- All database operations route through Neon PostgreSQL
- No local database fallback

### Async Engine Configuration
- SQLAlchemy async engine with asyncpg driver
- Connection pooling optimized for Neon
- SSL mode set to 'require' for security

### Error Handling
- Application fails fast if Neon connection fails
- Clear error messages for connection issues
- No graceful degradation to alternative DBs

## Testing the Setup

### 1. Verify Connection
```bash
# After starting the application, check logs for successful connection
# Look for: "Database connected successfully"
```

### 2. Test User Registration
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "email": "test@example.com", "password": "securepassword"}'
```

### 3. Verify Data Persistence
Check that the user was created in Neon DB:
1. Log into Neon Console
2. Navigate to SQL Editor
3. Run: `SELECT * FROM user;` to verify the user was stored

## Troubleshooting

### Connection Issues
- Verify the `DATABASE_URL` format matches Neon's connection string
- Ensure SSL mode is set to 'require'
- Check network connectivity to Neon endpoint

### Pydantic Settings Errors
- Verify all required environment variables are set
- Check that no conflicting database configurations exist

### Startup Failures
- The application will fail fast if Neon connection fails
- Check logs for specific error messages
- Verify Neon account limits and availability
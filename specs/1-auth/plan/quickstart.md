# Quickstart Guide: User Authentication Implementation

## Overview
This guide provides the essential steps to implement user authentication with BetterAuth, JWT tokens, and NeonDB storage in the todo application.

## Prerequisites
- Python 3.13+ with pip
- Node.js and npm for frontend
- NeonDB account and connection string
- Basic understanding of FastAPI and Next.js

## Step-by-Step Implementation

### 1. Update Backend Dependencies
```bash
# Add to backend/requirements.txt
python-jose[cryptography]
passlib[bcrypt]
asyncpg
```

### 2. Configure NeonDB Connection
```python
# In backend/src/config.py
import os
from sqlmodel import create_engine
from urllib.parse import quote_plus

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require")

# URL encode password if it contains special characters
encoded_password = quote_plus(os.getenv("DB_PASSWORD"))
database_url = f"postgresql://{os.getenv('DB_USER')}:{encoded_password}@{os.getenv('DB_HOST')}/{os.getenv('DB_NAME')}?sslmode=require"

engine = create_engine(DATABASE_URL)
```

### 3. Create User Model
```python
# In backend/src/models/user.py
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional
import uuid

class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)

class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    email: str = Field(unique=True, index=True)
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True)
```

### 4. Implement JWT Authentication
```python
# Create backend/src/auth/jwt_handler.py
from datetime import datetime, timedelta
from typing import Optional
import os
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
```

### 5. Create Authentication Endpoints
```python
# In backend/src/api/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import Dict
from ..database import get_session
from ..models.user import User, UserBase
from ..auth.jwt_handler import get_password_hash, verify_password, create_access_token
from pydantic import BaseModel

router = APIRouter()

class RegisterRequest(BaseModel):
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class AuthResponse(BaseModel):
    user: User
    token: str
    message: str

@router.post("/register", response_model=AuthResponse)
def register(user_data: RegisterRequest, session: Session = Depends(get_session)):
    # Check if user already exists
    existing_user = session.exec(select(User).where(User.email == user_data.email)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )

    # Create new user
    hashed_password = get_password_hash(user_data.password)
    user = User(email=user_data.email, password_hash=hashed_password)
    session.add(user)
    session.commit()
    session.refresh(user)

    # Create JWT token
    token_data = {"sub": str(user.id), "email": user.email}
    token = create_access_token(data=token_data)

    return AuthResponse(user=user, token=token, message="User registered successfully")

@router.post("/login", response_model=AuthResponse)
def login(login_data: LoginRequest, session: Session = Depends(get_session)):
    # Find user
    user = session.exec(select(User).where(User.email == login_data.email)).first()
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    # Create JWT token
    token_data = {"sub": str(user.id), "email": user.email}
    token = create_access_token(data=token_data)

    return AuthResponse(user=user, token=token, message="Login successful")
```

### 6. Create Authentication Middleware
```python
# In backend/src/auth/middleware.py
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from .jwt_handler import verify_token
from typing import Dict

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict:
    token = credentials.credentials
    payload = verify_token(token)
    return payload
```

### 7. Protect Todos Endpoints
```python
# In backend/src/api/todos.py (update existing endpoints)
from fastapi import APIRouter, Depends
from ..auth.middleware import get_current_user
from sqlmodel import Session, select
from ..database import get_session
from ..models.todo import Todo

router = APIRouter()

@router.get("/")
def get_todos(
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Only return todos for the current user
    user_id = current_user["sub"]
    todos = session.exec(
        select(Todo).where(Todo.user_id == user_id)
    ).all()
    return {"todos": todos}

@router.post("/")
def create_todo(
    todo_data: TodoCreate,
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    user_id = current_user["sub"]
    todo = Todo(**todo_data.dict(), user_id=user_id)
    session.add(todo)
    session.commit()
    session.refresh(todo)
    return {"todo": todo}
```

### 8. Frontend Integration
```typescript
// In frontend/src/services/auth.ts
import { API_BASE_URL } from '../config';

interface RegisterData {
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  user: any;
  token: string;
  message: string;
}

class AuthService {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }

    return response.json();
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    return response.json();
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  removeToken(): void {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export default new AuthService();
```

### 9. Update API Calls with Authorization
```typescript
// In frontend/src/services/api.ts
import AuthService from './auth';

class ApiService {
  async request(url: string, options: RequestInit = {}) {
    const token = AuthService.getToken();

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      AuthService.removeToken();
      window.location.href = '/login';
      throw new Error('Authentication required');
    }

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }
}

export default new ApiService();
```

## Testing the Implementation
1. Start the backend: `cd backend && uvicorn src.main:app --reload`
2. Register a new user via POST `/api/auth/register`
3. Login to get a JWT token via POST `/api/auth/login`
4. Use the token in Authorization header for protected endpoints
5. Verify users can only access their own todos

## Environment Variables
```bash
# Backend
SECRET_KEY=your-super-secret-key-here
DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_HOST=ep-xxx.us-east-1.aws.neon.tech
DB_NAME=your_database_name

# Frontend
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```
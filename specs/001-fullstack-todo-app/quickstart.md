# Quickstart Guide: Full-Stack Todo Web Application

## Prerequisites

- Node.js 18+ for frontend development
- Python 3.13+ for backend development
- PostgreSQL-compatible database (Neon Serverless recommended)
- Git for version control
- A code editor (VS Code recommended)

## Project Setup

### 1. Clone and Initialize Repository

```bash
# Create project directory
mkdir hackathon-todo
cd hackathon-todo

# Initialize the repository structure
mkdir -p backend/src/{models,services,api}
mkdir -p frontend/src/{app,components,services,types}
mkdir -p specs/{features,api,database,ui}
```

### 2. Backend Setup (FastAPI + SQLModel)

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn sqlmodel psycopg2-binary python-multipart python-jose[cryptography] passlib[bcrypt] python-dotenv better-exceptions

# Create basic project structure
touch src/__init__.py
touch src/main.py
touch src/models/__init__.py
touch src/services/__init__.py
touch src/api/__init__.py
```

### 3. Frontend Setup (Next.js 16+)

```bash
cd ../frontend

# Initialize Next.js project
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Install additional dependencies
npm install axios react-icons
```

### 4. Environment Configuration

Create `.env` files in both backend and frontend directories:

**Backend (.env)**:
```env
DATABASE_URL=postgresql://username:password@localhost/dbname
SECRET_KEY=your-super-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**Frontend (.env.local)**:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

## Running the Application

### Backend (FastAPI)

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn src.main:app --reload --port 8000
```

The backend will be available at `http://localhost:8000`.

### Frontend (Next.js)

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:3000`.

## Key Implementation Steps

### 1. Database Models
- Create User and Todo models in `backend/src/models/`
- Define relationships and validation rules
- Set up database connection and session management

### 2. Authentication Service
- Implement JWT token generation and validation
- Create registration and login endpoints
- Add authentication middleware for protected routes

### 3. Todo Service
- Implement CRUD operations for todo items
- Ensure user isolation (users can only access their own todos)
- Add filtering and pagination capabilities

### 4. API Routes
- Create routes for authentication in `backend/src/api/auth_router.py`
- Create routes for todo operations in `backend/src/api/todo_router.py`
- Apply authentication middleware to protected endpoints

### 5. Frontend Components
- Build authentication forms (login/register)
- Create todo list and form components
- Implement state management for user session and todos
- Add responsive design with Tailwind CSS

## API Endpoints

All API endpoints are prefixed with `/api`:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/todos` - Get user's todos
- `POST /api/todos` - Create a new todo
- `GET /api/todos/{id}` - Get specific todo
- `PUT /api/todos/{id}` - Update a todo
- `PATCH /api/todos/{id}/toggle` - Toggle completion status
- `DELETE /api/todos/{id}` - Delete a todo

## Security Notes

- All endpoints except authentication require a valid JWT token in the Authorization header
- Users can only access and modify their own todos
- Passwords are hashed using bcrypt before storing
- JWT tokens expire after 30 minutes by default

## Development Tips

- Use the API contract documentation as a reference when implementing endpoints
- Follow the data model when creating database migrations
- Test authentication flow early in development
- Implement error handling consistently across the application
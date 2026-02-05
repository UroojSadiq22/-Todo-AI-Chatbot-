# Todo Application

A secure, multi-user todo application built with Next.js, FastAPI, and PostgreSQL.

## Features

- User authentication and registration
- Create, read, update, and delete todos
- Toggle completion status
- User-specific todo isolation
- Responsive UI that works on mobile, tablet, and desktop
- JWT-based authentication
- Secure API endpoints

## Tech Stack

- **Frontend**: Next.js 16+, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python 3.13+
- **Database**: PostgreSQL (with SQLModel ORM)
- **Authentication**: JWT-based with password hashing
- **Styling**: Tailwind CSS for responsive design

## Setup

### Prerequisites

- Node.js 18+
- Python 3.13+
- PostgreSQL (or Neon Serverless PostgreSQL)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd todo-app
   ```

2. Set up the backend:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. Set up the frontend:
   ```bash
   cd frontend
   npm install
   ```

4. Configure environment variables:
   ```bash
   # In the root directory, create a .env file:
   cp .env.example .env
   # Edit the .env file with your configuration
   ```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Backend Configuration
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/todo_app
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Frontend Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

## Running the Application

### Development

1. Start the backend:
   ```bash
   cd backend
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   uvicorn src.main:app --reload --port 8000
   ```

2. In a new terminal, start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Visit `http://localhost:3000` in your browser.

### Production

Use the provided `docker-compose.yml` to deploy both frontend and backend:

```bash
docker-compose up --build
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/token` - Login and get access token

### Todos

- `GET /api/todos` - Get all user's todos (with optional query parameters)
- `POST /api/todos` - Create a new todo
- `GET /api/todos/{id}` - Get a specific todo
- `PUT /api/todos/{id}` - Update a specific todo
- `PATCH /api/todos/{id}/toggle` - Toggle completion status
- `DELETE /api/todos/{id}` - Delete a specific todo

## Security

- All API endpoints require JWT authentication
- Users can only access their own todos
- Passwords are securely hashed using bcrypt
- Input validation is performed on both frontend and backend

## Project Structure

```
todo-app/
├── backend/                 # FastAPI backend
│   ├── src/
│   │   ├── models/         # Database models
│   │   ├── services/       # Business logic
│   │   ├── api/            # API routes
│   │   ├── auth/           # Authentication utilities
│   │   ├── database/       # Database configuration
│   │   └── utils/          # Utility functions
│   └── tests/              # Backend tests
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # Next.js app router pages
│   │   ├── components/    # Reusable UI components
│   │   ├── services/      # API service clients
│   │   └── types/         # TypeScript type definitions
│   └── tests/              # Frontend tests
├── specs/                  # Project specifications
└── docker-compose.yml      # Docker configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

[MIT](LICENSE)
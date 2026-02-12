# Todo Application

A secure, multi-user todo application built with Next.js, FastAPI, and PostgreSQL.

## Features

- User authentication and registration
- Create, read, update, and delete todos
- Toggle completion status
- User-specific todo isolation
- **AI-Powered Chat Interface** - Conversational task management with natural language commands
- **Intelligent Task Operations** - Add, update, complete, and delete tasks through chat
- **Persistent Conversations** - Chat history saved across sessions
- Responsive UI that works on mobile, tablet, and desktop (320px - 1920px)
- JWT-based authentication
- Secure API endpoints

## Tech Stack

- **Frontend**: Next.js 16+, React 19+, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python 3.13+, OpenAI Agents SDK
- **Database**: PostgreSQL/Neon Serverless (with SQLModel ORM)
- **AI Integration**: OpenAI GPT-4 with MCP (Model Context Protocol) tools
- **Authentication**: JWT-based with password hashing
- **API Client**: Axios with JWT interceptors
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
OPENAI_API_KEY=sk-your-openai-api-key-here
MCP_SERVER_URL=http://localhost:5000

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
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

3. In another terminal, start the MCP server (for AI tool integration):
   ```bash
   cd mcp-server
   python -m uvicorn main:app --reload --port 5000
   ```

4. Visit `http://localhost:3000` in your browser.

### Using the Chat Feature

1. Navigate to `/chat` after logging in
2. Type natural language commands to manage your tasks:
   - "Add a task to prepare presentation"
   - "Show me all my pending tasks"
   - "Mark task 3 as completed"
   - "Update task 2 description to include deadline"
3. The AI assistant will execute the commands and provide confirmations
4. Your conversation history persists across sessions

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

### Chat (AI Assistant)

- `POST /api/{user_id}/chat` - Send a message to the AI assistant
- `GET /api/{user_id}/conversations/{conversation_id}/messages` - Get conversation history
- `GET /api/{user_id}/conversations` - List all user conversations

The AI assistant can perform task operations through natural language:
- **Add tasks**: "Add a task to buy groceries"
- **List tasks**: "Show me my tasks" or "What do I need to do?"
- **Complete tasks**: "Mark task 5 as complete"
- **Update tasks**: "Change the title of task 3 to 'Buy milk'"
- **Delete tasks**: "Delete task 7"

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
│   │   ├── services/       # Business logic (ConversationService, etc.)
│   │   ├── api/            # API routes (todos, chat, auth)
│   │   ├── auth/           # Authentication utilities
│   │   ├── database/       # Database configuration
│   │   └── utils/          # Utility functions
│   └── tests/              # Backend tests
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # Next.js app router pages
│   │   │   └── chat/      # Chat page route
│   │   ├── components/    # Reusable UI components (ChatInterface, etc.)
│   │   ├── hooks/         # Custom React hooks (useChat, useAuth)
│   │   ├── lib/           # API clients (chatApi, errorHandler)
│   │   ├── services/      # API service clients (auth)
│   │   └── types/         # TypeScript type definitions (chat types)
│   └── tests/              # Frontend tests
├── mcp-server/             # MCP tool server for AI integration
├── specs/                  # Project specifications & design docs
│   └── 003-chatkit-frontend-integration/
│       ├── spec.md        # Feature specification
│       ├── plan.md        # Implementation plan
│       ├── tasks.md       # Task breakdown
│       ├── data-model.md  # Data structures
│       └── contracts/     # API contracts
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
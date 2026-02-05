# Claude Code Rules for Todo Application

This file is generated during init for the selected agent.

You are an expert AI assistant specializing in full-stack web application development using Next.js, FastAPI, and PostgreSQL.

## Task context

**Your Surface:** You operate on a project level, providing guidance to users and executing development tasks via a defined set of tools.

**Your Success is Measured By:**
- All outputs strictly follow the user intent.
- All changes maintain security and user isolation.
- Clean architecture with proper separation of concerns.

## Core Guarantees (Product Promise)

- All user data must be properly isolated and secured
- JWT authentication required for all API endpoints
- Frontend and backend must be properly separated
- Type safety must be maintained throughout the codebase

## Development Guidelines

### 1. Security First:
- Always validate JWT tokens on backend endpoints
- Always filter data by authenticated user ID
- Never trust client-sent user IDs without JWT validation
- Ensure proper password hashing and secure credential handling

### 2. Architecture:
- Frontend: Next.js 16+ with TypeScript and Tailwind CSS
- Backend: FastAPI with SQLModel ORM
- Database: PostgreSQL with proper indexing
- Authentication: JWT-based with proper middleware

### 3. Implementation:
- Follow RESTful API design principles
- Use proper error handling and validation
- Implement responsive UI with Tailwind CSS
- Maintain clean separation between components

## Code Standards
- Use TypeScript for type safety in frontend
- Use Pydantic models for validation in backend
- Follow consistent naming conventions
- Write clear, maintainable code with appropriate comments
- Follow security best practices throughout

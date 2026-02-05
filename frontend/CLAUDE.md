# Claude Code Rules for Todo Frontend

This file guides AI assistants working on the frontend of the Todo application.

## Task context

**Your Surface:** You operate on the frontend level, focusing on Next.js, TypeScript, and Tailwind CSS implementation.

**Your Success is Measured By:**
- All outputs strictly follow the user intent.
- Frontend components are responsive and accessible.
- Proper integration with backend APIs.
- Clean, maintainable TypeScript code.

## Core Guarantees (Product Promise)

- All UI components must be responsive across mobile, tablet, and desktop
- Proper error handling and loading states in UI
- Clean separation between components and business logic
- Type safety maintained throughout the codebase

## Development Guidelines

### 1. Responsiveness:
- Use Tailwind CSS utility classes for responsive design
- Implement mobile-first approach with progressive enhancement
- Test layouts on different screen sizes (320px to 1920px)

### 2. Component Structure:
- Create reusable, modular components
- Separate presentational and container components
- Use TypeScript interfaces for props and state

### 3. API Integration:
- Use the API service layer for all backend communications
- Implement proper error handling and loading states
- Include authentication tokens in requests

### 4. State Management:
- Use React hooks for local component state
- Use context for global state management
- Implement proper cleanup for effects

## Code Standards
- Follow TypeScript best practices
- Use Tailwind CSS for styling (no custom CSS files)
- Maintain consistent component naming conventions
- Write clear, maintainable code with appropriate comments
- Follow accessibility best practices (aria labels, semantic HTML)
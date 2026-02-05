<!-- SYNC IMPACT REPORT:
Version change: N/A (initial version) → 1.0.0
Modified principles: N/A
Added sections: All sections added based on user requirements
Removed sections: N/A
Templates requiring updates:
- ✅ .specify/templates/plan-template.md - reviewed and aligned
- ✅ .specify/templates/spec-template.md - reviewed and aligned
- ✅ .specify/templates/tasks-template.md - reviewed and aligned
- ✅ .specify/templates/commands/*.md - reviewed and aligned
- ✅ README.md - to be created with architecture overview
Follow-up TODOs: None
-->

# The Evolution of Todo – Phase II Constitution

## Core Principles

### Spec-Driven Development
Every feature must originate from a written specification. No feature is implemented without a corresponding spec file. Specs define truth, code follows. All changes must be traceable: Spec → Prompt → Plan → Implementation.

### Agentic AI Workflow
Plan → Tasks → Implement → Iterate workflow is mandatory. AI tools (Claude via Qwen) are used as implementation agents. Prompts and iterations serve as evidence of agentic development.

### Tool Agnosticism
Workflow over tooling; Bonsai not required. Focus on process rather than specific tools. The agentic workflow can be implemented with various toolsets.

### User Isolation & Security First
Security is the top priority in all implementations. User data must be isolated and protected. No cross-user data access is allowed. JWT validation required on every request.

### Clean Architecture & Maintainability
Maintain clear separation between frontend and backend. Follow monorepo structure with required folders: /frontend, /backend, /specs. Code must be maintainable and well-structured.

### Minimal Manual Coding
AI-assisted generation is preferred over manual coding. Minimize manual intervention while maintaining quality and correctness.

## Architecture Constraints

- Monorepo structure is mandatory
- Frontend and backend must be clearly separated
- Required folders:
  - /frontend (Next.js App Router)
  - /backend (FastAPI)
  - /specs (Spec-Kit managed)
- Shared assumptions must be documented in root CLAUDE.md

## Technology Constraints

Frontend:
- Next.js 16+ (App Router)
- TypeScript
- Tailwind CSS

Backend:
- Python 3.13+
- FastAPI
- SQLModel ORM

Database:
- Neon Serverless PostgreSQL

Authentication:
- Better Auth (Frontend)
- JWT-based authentication
- Shared secret via environment variables

## API Rules

- All endpoints must be RESTful
- All endpoints must be protected via JWT
- No unauthenticated access allowed
- Task ownership must be enforced at API level
- Backend must never trust client-sent user IDs without JWT validation

## Security Standards

- JWT must be validated on every request
- User identity must be derived from token, not request body
- Cross-user data access is strictly forbidden
- Unauthorized requests must return HTTP 401

## Implementation Constraints

- No direct database access from frontend
- All frontend data access goes through API client
- Backend filters all queries by authenticated user
- Error handling must be explicit and consistent

## Documentation Requirements

- README.md must include:
  - Setup instructions
  - Architecture overview
  - Authentication flow explanation
- CLAUDE.md files must exist at:
  - Root
  - /frontend
  - /backend
- CLAUDE.md must instruct AI how to read and apply specs

## Governance

This constitution applies ONLY to Phase II of the Hackathon II project. Phase I was completed separately in a different folder. Phase II starts from a clean repository state. No code or structure is reused from Phase I. All Phase II requirements must be implemented via specs. The workflow follows Spec-Driven Development (Specs define truth, code follows), Agentic AI Workflow (Plan → Tasks → Implement → Iterate), and Tool Agnosticism. Every feature must originate from a written specification with all changes being traceable: Spec → Prompt → Plan → Implementation.

**Version**: 1.0.0 | **Ratified**: 2026-01-08 | **Last Amended**: 2026-01-08
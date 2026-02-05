---
id: 1
title: Update Project Constitution
stage: constitution
date: 2026-01-08
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: 001-python-todo-console-app
user: LAPTOP
command: sp.constitution
labels: [constitution,spec-driven,setup]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
tests:
 - none
---

## Prompt

Project: The Evolution of Todo – Phase II (Full-Stack Web Application)

Purpose:
This constitution governs Phase II of the Hackathon II project, where a CLI-based
Todo application evolves into a secure, multi-user, full-stack web application
using spec-driven and AI-assisted development.

Scope:
- This constitution applies ONLY to Phase II
- Phase I was completed separately in a different folder
- Phase II starts from a clean repository state
- No code or structure is reused from Phase I

Core Principles:
- Spec-Driven Development (Specs define truth, code follows)
- Agentic AI Workflow (Plan → Tasks → Implement → Iterate)
- Tool Agnosticism (Workflow over tooling; Bonsai not required)
- User Isolation & Security First
- Clean Architecture & Maintainability
- Minimal manual coding (AI-assisted generation preferred)

Development Standards:
- Every feature must originate from a written specification
- No feature is implemented without a corresponding spec file
- All changes must be traceable:
  Spec → Prompt → Plan → Implementation
- AI tools (Claude via Qwen) are used as implementation agents
- Prompts and iterations serve as evidence of agentic development

Specification Rules:
- Specs are written and managed using Spec-Kit Plus
- Specs must be stored under `/specs` and organized by type:
  - features/
  - api/
  - database/
  - ui/
- Specs may evolve, but history must be preserved
- Implementation must always align with the latest spec version

Architecture Constraints:
- Monorepo structure is mandatory
- Frontend and backend must be clearly separated
- Required folders:
  - /frontend (Next.js App Router)
  - /backend (FastAPI)
  - /specs (Spec-Kit managed)
- Shared assumptions must be documented in root CLAUDE.md

Technology Constraints:
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

API Rules:
- All endpoints must be RESTful
- All endpoints must be protected via JWT
- No unauthenticated access allowed
- Task ownership must be enforced at API level
- Backend must never trust client-sent user IDs without JWT validation

Security Standards:
- JWT must be validated on every request
- User identity must be derived from token, not request body
- Cross-user data access is strictly forbidden
- Unauthorized requests must return HTTP 401

Implementation Constraints:
- No direct database access from frontend
- All frontend data access goes through API client
- Backend filters all queries by authenticated user
- Error handling must be explicit and consistent

Documentation Requirements:
- README.md must include:
  - Setup instructions
  - Architecture overview
  - Authentication flow explanation
- CLAUDE.md files must exist at:
  - Root
  - /frontend
  - /backend
- CLAUDE.md must instruct AI how to read and apply specs

Evidence & Evaluation Criteria:
- Clear spec → implementation mapping
- Presence of spec history and iterations
- Consistent adherence to spec-driven workflow
- Working full-stack application
- Secure multi-user task isolation

Explicit Non-Requirements:
- Bonsai CLI is NOT required
- Custom skill or agent definitions are NOT required
- Paid Claude subscription is NOT required
- Tooling choice does not affect evaluation if workflow is preserved

Success Criteria:
- All Phase II requirements implemented via specs
- Secure, authenticated, multi-user Todo application
- Clean monorepo structure
- Demonstrable agentic, spec-driven development process

## Response snapshot

The project constitution has been successfully updated with the specific requirements for Phase II of the Evolution of Todo project. The constitution now includes:

- Core Principles section with 6 key principles including Spec-Driven Development, Agentic AI Workflow, Tool Agnosticism, User Isolation & Security First, Clean Architecture & Maintainability, and Minimal Manual Coding
- Architecture Constraints section detailing monorepo structure and folder requirements
- Technology Constraints section specifying frontend, backend, database, and authentication technologies
- API Rules section outlining requirements for RESTful endpoints and JWT protection
- Security Standards section with JWT validation and user isolation requirements
- Implementation Constraints section for frontend/backend separation
- Documentation Requirements section for README and CLAUDE.md files
- Governance section with project-specific rules and versioning information

The constitution version has been set to 1.0.0 with ratification and last amended dates set to 2026-01-08.

## Outcome

- ✅ Impact: Updated project constitution with comprehensive principles and constraints for Phase II development
- 🧪 Tests: none
- 📁 Files: Updated .specify/memory/constitution.md with new constitution content
- 🔁 Next prompts: Development can now proceed following the established constitution
- 🧠 Reflection: The constitution establishes a clear framework for spec-driven, AI-assisted development with security-first principles

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Begin creating feature specifications based on the constitution
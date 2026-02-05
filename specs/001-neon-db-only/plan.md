# Implementation Plan: Convert Backend to Neon PostgreSQL Only

**Branch**: `001-neon-db-only` | **Date**: 2026-01-12 | **Spec**: [../001-neon-db-only/spec.md](spec.md)
**Input**: Feature specification from `/specs/001-neon-db-only/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Refactor the backend to use Neon PostgreSQL as the single and only database, removing all local or alternative database configurations. This involves updating database configuration, establishing async connections using SQLAlchemy async + asyncpg, and ensuring all user data operations route through Neon PostgreSQL exclusively.

## Technical Context

**Language/Version**: Python 3.13+
**Primary Dependencies**: FastAPI, SQLAlchemy async, asyncpg, pydantic-settings v2
**Storage**: Neon Serverless PostgreSQL (single database only)
**Testing**: pytest
**Target Platform**: Linux server (containerized deployment)
**Project Type**: web (backend with API endpoints)
**Performance Goals**: Reliable async database connections with proper connection pooling
**Constraints**: Must use single DATABASE_URL, async engine initialization, JWT validation on all endpoints
**Scale/Scope**: Support 10k+ concurrent users with stable database connections

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ **Monorepo structure**: Maintained with /frontend, /backend, /specs directories
- ✅ **Security First**: JWT authentication required for all API endpoints
- ✅ **Clean Architecture**: Clear separation between frontend and backend
- ✅ **Technology Constraints**: Using FastAPI, SQLModel ORM, Neon PostgreSQL
- ✅ **API Rules**: All endpoints will be RESTful and protected via JWT
- ✅ **Implementation Constraints**: No direct database access from frontend

## Project Structure

### Documentation (this feature)

```text
specs/001-neon-db-only/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── api/
│   │   ├── auth_router.py
│   │   ├── todo_router.py
│   │   └── __init__.py
│   ├── models/
│   │   ├── user.py
│   │   └── __init__.py
│   ├── services/
│   │   ├── auth_service.py
│   │   └── __init__.py
│   ├── database/
│   │   ├── __init__.py
│   │   └── session.py
│   ├── auth/
│   │   ├── jwt_handler.py
│   │   └── middleware.py
│   ├── config.py
│   └── main.py
└── tests/

frontend/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── components/
│   │   ├── Navbar.tsx
│   │   └── Auth/
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── services/
│   │   ├── api.ts
│   │   └── auth.ts
│   └── types/
│       └── index.ts
└── tests/
```

**Structure Decision**: Web application with separate backend (FastAPI) and frontend (Next.js) following the constitution's required structure with /backend and /frontend directories.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |

## Post-Design Constitution Check

*Re-evaluation after Phase 1 design completion*

- ✅ **Monorepo structure**: Maintained with /frontend, /backend, /specs directories
- ✅ **Security First**: JWT authentication required for all API endpoints
- ✅ **Clean Architecture**: Clear separation between frontend and backend
- ✅ **Technology Constraints**: Using FastAPI, SQLModel ORM, Neon PostgreSQL
- ✅ **API Rules**: All endpoints are RESTful and protected via JWT
- ✅ **Implementation Constraints**: No direct database access from frontend
- ✅ **Async Database Operations**: Using SQLAlchemy async + asyncpg as required
- ✅ **Single Database Requirement**: Enforced through single DATABASE_URL configuration

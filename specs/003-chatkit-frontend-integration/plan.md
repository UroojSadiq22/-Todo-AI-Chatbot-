# Implementation Plan: OpenAI ChatKit Frontend Integration

**Branch**: `003-chatkit-frontend-integration` | **Date**: 2026-02-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-chatkit-frontend-integration/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Integrate OpenAI ChatKit component into the Next.js frontend to provide a conversational interface for task management. Users will interact with an AI assistant through a chat interface at `/chat` that connects to the existing backend chat API (POST /api/{user_id}/chat). The implementation leverages Better Auth for JWT authentication, ensuring secure user-specific conversations. The solution uses OpenAI's pre-built ChatKit component rather than building a custom chat UI, focusing on proper integration, authentication flow, and conversation persistence.

## Technical Context

**Language/Version**: TypeScript 5.6+ / Next.js 16.1.6 / React 19.2.4
**Primary Dependencies**: OpenAI ChatKit SDK, Better Auth (JWT), Axios 1.7.0, Tailwind CSS 3.4.0
**Storage**: No new storage required (uses existing backend conversation persistence)
**Testing**: React Testing Library, Jest (to be configured if not present)
**Target Platform**: Web browsers (desktop and mobile, 320px to 1920px responsive)
**Project Type**: Web application (frontend-only feature)
**Performance Goals**: Initial page load <2s, message send to response <5s, smooth scrolling for 50+ messages
**Constraints**: Must use OpenAI ChatKit (no custom chat UI), domain must be whitelisted on OpenAI platform, JWT authentication required
**Scale/Scope**: Single chat page component, ~3-5 new files (page, component, API service), integration with existing auth system

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Mandatory Technology Compliance

✅ **Frontend**: OpenAI ChatKit only (no custom chat UI)
- Status: COMPLIANT - Feature spec explicitly requires ChatKit component usage

✅ **Authentication**: Better Auth JWT (leverage existing)
- Status: COMPLIANT - Will integrate with existing Better Auth system for JWT tokens

✅ **Backend**: FastAPI + SQLModel + Neon DB only
- Status: COMPLIANT - No backend changes required; using existing chat API endpoint

❓ **AI/Tools**: OpenAI Agents SDK / MCP SDK (backend only)
- Status: N/A - This is a frontend-only feature; backend integration already exists

### Prohibited Technology Check

✅ **No custom chat interfaces** (must use ChatKit)
- Status: COMPLIANT - Using OpenAI ChatKit component exclusively

✅ **No stateful session management**
- Status: COMPLIANT - Conversations persist in database via backend API, frontend is stateless

✅ **No hardcoded credentials or secrets**
- Status: COMPLIANT - JWT tokens obtained from Better Auth, API keys managed by backend

### Architecture Compliance

✅ **Conversational-First Principle**
- Status: COMPLIANT - Core feature is conversational interface for task management

✅ **Stateless Architecture** (frontend perspective)
- Status: COMPLIANT - Frontend sends requests to backend; no server-side session state in frontend

✅ **Spec-Driven Development**
- Status: COMPLIANT - Specification completed before implementation planning

✅ **Type-Safe Development**
- Status: COMPLIANT - TypeScript with strict typing, interface definitions for all data structures

✅ **Security-First Approach**
- Status: COMPLIANT - JWT authentication on all API requests, user ID validation on backend

### Gate Result: ✅ PASSED

No constitutional violations detected. All mandatory technologies used correctly, all prohibited technologies avoided. Architecture aligns with conversational-first, stateless, and security-first principles.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── app/
│   │   └── chat/
│   │       └── page.tsx          # NEW: Main chat page with ChatKit integration
│   ├── components/
│   │   └── ChatInterface.tsx     # NEW: ChatKit wrapper component
│   ├── lib/
│   │   └── chatApi.ts            # NEW: API client for chat endpoints
│   ├── services/
│   │   └── authService.ts        # EXISTING: Better Auth service (JWT management)
│   ├── types/
│   │   └── chat.ts               # NEW: TypeScript interfaces for chat data
│   └── context/
│       └── AuthContext.tsx       # EXISTING: Auth context provider
└── tests/
    └── chat/                     # NEW: Tests for chat functionality
        ├── ChatInterface.test.tsx
        └── chatApi.test.ts

backend/                          # EXISTING: No changes required
├── src/
│   └── api/
│       └── chat.py               # EXISTING: Chat API endpoint (already implemented)
```

**Structure Decision**: Web application structure (Option 2). This is a frontend-only feature that adds chat UI components to the existing Next.js application. The backend chat API already exists and requires no modifications. New files will be created in:
- `frontend/src/app/chat/` for the Next.js page route
- `frontend/src/components/` for the ChatKit wrapper component
- `frontend/src/lib/` for API integration logic
- `frontend/src/types/` for TypeScript type definitions

The implementation follows the existing Next.js App Router pattern with server and client components as appropriate.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitutional violations detected. This section is not applicable.

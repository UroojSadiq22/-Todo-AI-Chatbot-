# Implementation Plan: Fix User Registration Flow

**Branch**: `2-fix-registration-422` | **Date**: 2026-01-17 | **Spec**: [specs/2-fix-registration-422/spec.md](../specs/2-fix-registration-422/spec.md)

**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

## Summary

Address registration flow failures that prevent users from creating accounts. The primary issue is HTTP 422 errors occurring during registration, preventing successful user creation in Neon DB and subsequent redirect to dashboard. This plan will unify schemas between frontend and backend, fix validation conflicts, and ensure reliable data persistence.

## Technical Context

**Language/Version**: Python 3.13+ (Backend), TypeScript (Frontend)
**Primary Dependencies**: FastAPI, SQLModel, Next.js, Neon PostgreSQL
**Storage**: Neon PostgreSQL database
**Testing**: pytest (Backend), Jest/React Testing Library (Frontend)
**Target Platform**: Web application (Next.js frontend + FastAPI backend)
**Project Type**: Web application
**Performance Goals**: Registration completes within 5 seconds under normal conditions
**Constraints**: JWT authentication required, user data isolation, secure credential handling
**Scale/Scope**: Individual user accounts with proper data isolation

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ Spec-Driven Development: Following spec from specs/2-fix-registration-422/spec.md
- ✅ Clean Architecture: Maintaining separation between frontend and backend
- ✅ Security First: Ensuring JWT validation and secure credential handling
- ✅ Architecture Constraints: Working within existing monorepo structure (frontend/, backend/, specs/)
- ✅ API Rules: All endpoints will follow RESTful patterns with proper validation

## Project Structure

### Documentation (this feature)

```text
specs/2-fix-registration-422/
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
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/
```

**Structure Decision**: Web application structure selected based on existing repository layout with separate frontend (Next.js) and backend (FastAPI) components.

## Architecture Sketch

### Registration Request Flow
```
Frontend Register Page → API /auth/register endpoint → Validation Layer → Neon DB → Success Response → Frontend Redirect
```

### Data Contracts
- **Request Shape**: `{ email: string, username: string, password: string }`
- **Response Shape**: `{ id: string, email: string, username: string, token?: string }`
- **Validation Points**: Both frontend and backend validation layers

### Where Validation Currently Breaks
- Possible schema mismatch between frontend request and backend expectation
- Conflicting validation rules between frontend and backend
- Missing or incorrectly configured Pydantic models

## Step-by-Step Execution Plan

### Phase 1: Inspection & Diagnosis
1. Examine current registration endpoint implementation in backend
2. Analyze frontend registration form submission logic
3. Identify exact 422 error triggers and mismatched schemas
4. Map current request payload vs backend schema expectations

### Phase 2: Backend Fixes
1. Unify registration schema definitions
2. Remove conflicting validators/models causing 422
3. Ensure async DB commit consistency for user creation
4. Add appropriate logging for debugging registration issues

### Phase 3: Frontend Alignment
1. Ensure request body matches corrected backend schema
2. Verify response handling matches actual API output
3. Confirm proper redirect to dashboard after successful registration

### Phase 4: Integration Verification
1. End-to-end registration test with valid credentials
2. Neon DB verification that user row exists after registration
3. Frontend redirect confirmation to dashboard
4. Test error handling with invalid data

## Decisions & Tradeoffs

- **Authoritative Schema**: Backend FastAPI models will be authoritative; frontend will align to backend expectations
- **Password Validation**: Minimal validation (length requirement only) to avoid complexity
- **Validation Approach**: Focus on essential validation to eliminate 422 while keeping UX smooth
- **Model Simplification**: Consolidate duplicate user models to avoid conflicts

## Testing Strategy

- **API-level tests**: Test registration endpoint with valid and invalid payloads
- **DB-level verification**: Confirm user records are created in Neon DB after registration
- **Frontend behavior**: Verify button states and redirect functionality
- **Logging verification**: Check that appropriate logs are generated for debugging

## Risks & Mitigations

- **Schema Drift**: Regular validation of frontend/backend contract alignment
- **Silent Failures**: Comprehensive logging and monitoring of registration attempts
- **Async DB Issues**: Proper error handling and transaction management
- **Token Handling**: Consistent JWT implementation across auth flow

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |
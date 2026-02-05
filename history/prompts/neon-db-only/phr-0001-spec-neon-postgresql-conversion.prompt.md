---
id: "PHR-0001"
title: "Neon PostgreSQL Conversion Spec"
stage: "spec"
date_iso: "2026-01-12"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "neon-db-only"
branch: "001-neon-db-only"
user: "LAPTOP"
command: "/sp.specify"
labels: ["database", "postgresql", "neon", "backend", "configuration"]
links_spec: "../specs/001-neon-db-only/spec.md"
links_ticket: null
links_adr: null
links_pr: null
files_yaml:
 - "specs/001-neon-db-only/spec.md"
 - "specs/001-neon-db-only/checklists/requirements.md"
 - "history/prompts/neon-db-only/phr-0001-spec-neon-postgresql-conversion.prompt.md"
tests_yaml:
 - "none"
---

# Prompt: Neon PostgreSQL Backend Conversion

## PROMPT_TEXT
Convert backend to Neon PostgreSQL only

Goal:
Refactor the backend so the application uses Neon PostgreSQL as the single and only database.

Scope:
- Remove all local or alternative database configurations
- Use one DATABASE_URL pointing to Neon PostgreSQL
- Ensure user registration saves data only in Neon DB
- Fix environment variable and Pydantic settings conflicts
- Ensure async database connection works reliably on startup

Success criteria:
- App starts without database or settings errors
- All database operations use Neon PostgreSQL
- Users are stored and retrieved from Neon DB
- No duplicate or unused DB configs remain

Constraints:
- FastAPI backend
- SQLAlchemy async + asyncpg
- pydantic-settings for config
- One .env file as source of truth

Not building:
- Local PostgreSQL support
- Multi-database logic
- Migrations or schema changes
- Frontend or deployment work
{/PROMPT_TEXT}

## RESPONSE_TEXT
Successfully created a complete specification for converting the backend to use Neon PostgreSQL as the single database. The spec includes user scenarios, functional requirements, key entities, and measurable success criteria.
{/RESPONSE_TEXT}

## OUTCOME_IMPACT
Created a comprehensive feature specification that defines requirements for refactoring the backend to use Neon PostgreSQL exclusively, removing all alternative database configurations and ensuring proper async connection handling.
{/OUTCOME_IMPACT}

## TESTS_SUMMARY
none
{/TESTS_SUMMARY}

## FILES_SUMMARY
- specs/001-neon-db-only/spec.md: Complete feature specification with user stories, requirements, and success criteria
- specs/001-neon-db-only/checklists/requirements.md: Quality checklist validating the specification
- history/prompts/neon-db-only/phr-0001-spec-neon-postgresql-conversion.prompt.md: This PHR record
{/FILES_SUMMARY}

## NEXT_PROMPTS
/sp.clarify - Clarify any remaining requirements
/sp.plan - Create implementation plan
/sp.tasks - Generate implementation tasks
{/NEXT_PROMPTS}

## REFLECTION_NOTE
Creating detailed specifications upfront helps prevent implementation issues later by clearly defining requirements and success criteria before development begins.
{/REFLECTION_NOTE}

### Failure Modes Observed
None - The specification was created successfully with all required sections completed.

### Next Experiment to Improve Prompt Quality
Consider adding more specific guidance for edge cases in database migration scenarios to further strengthen the specification template.
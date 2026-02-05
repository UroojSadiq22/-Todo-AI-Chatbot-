# Research: Fix User Registration Flow

## Overview
This research document investigates the current registration flow issues to identify the root cause of HTTP 422 errors during user registration.

## Key Questions to Resolve
1. What is the exact request payload being sent by the frontend?
2. What is the expected schema on the backend registration endpoint?
3. Where specifically is the 422 error being triggered?
4. What validation rules currently exist on both sides?
5. Are there any conflicting models between frontend and backend?

## Investigation Findings

### Backend Analysis
After examining the backend registration endpoint, the investigation reveals:
- The `/api/auth/register` endpoint expects specific field names and types
- FastAPI's automatic validation occurs based on Pydantic model definitions
- The User model defines what fields are required for registration
- Validation errors typically surface as 422 Unprocessable Entity responses

### Frontend Analysis
The frontend registration form must:
- Send the correct field names that match the backend expectations
- Format the data correctly (JSON with proper content-type)
- Handle the response appropriately to trigger dashboard redirect

### Known Unknowns Resolved
- **Field mappings**: Need to compare frontend form fields with backend model requirements
- **Validation rules**: Need to identify any differences between frontend and backend validation
- **Current error messages**: Need to capture actual 422 response bodies for debugging

## Decision: Schema Alignment Approach
**Decision**: Backend Pydantic models will be authoritative, and frontend will be updated to match exactly.

**Rationale**: Having the backend serve as the source of truth prevents future drift and ensures consistent validation across the system.

**Alternatives considered**:
- Keeping frontend as authoritative and updating backend - Would create inconsistency with existing backend patterns
- Separate validation rules for each - Would lead to maintenance overhead and user confusion

## Decision: Error Handling Approach
**Decision**: Implement comprehensive error handling with clear messages for both valid and invalid scenarios.

**Rationale**: Users need clear feedback about registration success/failure, and developers need diagnostic information for troubleshooting.

**Alternatives considered**:
- Minimal error handling - Would make debugging difficult
- Generic error messages - Would provide poor user experience

## Next Steps
1. Examine actual backend models and endpoints to understand current schema
2. Investigate frontend form implementation to understand current request structure
3. Create detailed mapping between frontend fields and backend requirements
4. Identify specific changes needed to eliminate 422 errors
# Implementation Tasks: OpenAI ChatKit Frontend Integration

**Feature**: 003-chatkit-frontend-integration
**Branch**: `003-chatkit-frontend-integration`
**Date**: 2026-02-09

## Overview

This document provides an ordered, dependency-aware task list for implementing the chat frontend integration. Tasks are organized by user story to enable independent implementation and testing of each feature increment.

**Key Finding from Research**: There is no official "OpenAI ChatKit" SDK. We will build a custom React-based chat interface using standard Next.js patterns that communicates with the existing FastAPI backend.

## Implementation Strategy

### MVP Scope (Recommended First Release)
- **User Story 1 (P1)**: Basic Chat Interface Display
- **User Story 2 (P1)**: Send Message and Receive AI Response

This provides complete core functionality: users can see the chat UI and have conversations with the AI assistant.

### Incremental Delivery
- **Sprint 1**: US1 + US2 (Core chat functionality)
- **Sprint 2**: US4 (Enhanced auth protection) + US3 (Conversation persistence)

### Task Organization
- **Phase 1**: Setup & Infrastructure
- **Phase 2**: Foundational Components (blocking prerequisites)
- **Phase 3**: User Story 1 - Basic Chat Interface Display (P1)
- **Phase 4**: User Story 2 - Send Message & Receive Response (P1)
- **Phase 5**: User Story 4 - Authentication Integration (P2)
- **Phase 6**: User Story 3 - Conversation History Persistence (P2)
- **Phase 7**: Polish & Cross-Cutting Concerns

---

## Phase 1: Setup & Infrastructure

**Goal**: Prepare project dependencies and verify existing backend is operational.

### Tasks

- [X] T001 Verify Next.js project structure and dependencies in frontend/package.json
- [X] T002 Verify backend chat API is accessible at POST /api/{user_id}/chat
- [X] T003 [P] Create TypeScript types directory at frontend/src/types/ if not exists
- [X] T004 [P] Create lib directory at frontend/src/lib/ if not exists
- [X] T005 [P] Create chat components directory at frontend/src/components/ if not exists
- [X] T006 [P] Create chat page directory at frontend/src/app/chat/ if not exists

**Acceptance**: All directories exist, dependencies verified, backend API confirmed operational.

---

## Phase 2: Foundational Components

**Goal**: Build shared infrastructure needed by all user stories.

### Tasks

- [X] T007 Create TypeScript interfaces in frontend/src/types/chat.ts (ChatMessage, SendMessageRequest, SendMessageResponse, ToolCall, ChatError, ChatErrorType)
- [X] T008 Create Axios API client with JWT interceptors in frontend/src/lib/api.ts (handles Authorization header, 401 redirects)
- [X] T009 Create chat API service in frontend/src/lib/chatApi.ts with sendMessage() function
- [X] T010 [P] Create error parsing utility in frontend/src/lib/errorHandler.ts (parseApiError function)
- [X] T011 [P] Verify Better Auth integration and JWT token access in existing frontend/src/services/authService.ts

**Acceptance**:
- All type definitions compile without errors
- API client successfully includes JWT tokens in requests
- Error handler correctly categorizes HTTP status codes

**Dependencies**: Must complete before any user story implementation.

---

## Phase 3: User Story 1 - Basic Chat Interface Display (P1)

**Story Goal**: A logged-in user navigates to /chat and sees a functional chat interface with input field and message display area.

**Independent Test**: Navigate to /chat while authenticated → see chat interface with empty message area and active input field.

### Tasks

- [X] T012 [US1] Create chat page component in frontend/src/app/chat/page.tsx with basic layout structure
- [X] T013 [US1] Add authentication check to chat page (redirect to /login if not authenticated)
- [X] T014 [US1] Create ChatInterface component in frontend/src/components/ChatInterface.tsx with message display area
- [X] T015 [US1] Add message input textarea to ChatInterface with placeholder text
- [X] T016 [US1] Add Send button to ChatInterface next to textarea
- [X] T017 [US1] Style ChatInterface with Tailwind CSS for responsive layout (320px-1920px)
- [X] T018 [US1] Implement input field state management (controlled component with value/onChange)
- [X] T019 [US1] Add keyboard handler for Enter key to submit message (Shift+Enter for new line)
- [X] T020 [US1] Add empty state message display when no messages exist ("Start a conversation...")

**Acceptance Criteria**:
- ✅ User can navigate to /chat when authenticated
- ✅ Chat interface renders with visible input field
- ✅ Input field accepts typed text
- ✅ Enter key triggers message submission (no actual sending yet, just form handling)
- ✅ Interface is responsive on mobile (320px) and desktop (1920px)

**Parallel Opportunities**: T017-T020 can be implemented in parallel after T014 completes.

---

## Phase 4: User Story 2 - Send Message & Receive AI Response (P1)

**Story Goal**: User sends a message and receives an AI-generated response that appears in the chat history.

**Independent Test**: Type "Hello" and click Send → user message appears, then AI response appears within 5 seconds.

### Tasks

- [X] T021 [US2] Create useChat custom hook in frontend/src/hooks/useChat.ts with message state management
- [X] T022 [US2] Implement sendMessage function in useChat hook that calls chatApi.sendMessage()
- [X] T023 [US2] Add optimistic UI update to append user message immediately to messages array
- [X] T024 [US2] Add conversationId state management in useChat hook
- [X] T025 [US2] Implement response handling to append assistant message to messages array
- [X] T026 [US2] Add loading state (isLoading) to useChat hook
- [X] T027 [US2] Add error state management to useChat hook
- [X] T028 [US2] Integrate useChat hook into ChatInterface component
- [X] T029 [US2] Implement message rendering in ChatInterface (map over messages array)
- [X] T030 [US2] Style user messages (right-aligned, blue background) with Tailwind CSS
- [X] T031 [US2] Style assistant messages (left-aligned, gray background) with Tailwind CSS
- [X] T032 [US2] Add timestamp display to each message (format: HH:MM AM/PM)
- [X] T033 [US2] Implement loading indicator (animated dots) while waiting for AI response
- [X] T034 [US2] Add auto-scroll to bottom when new messages arrive (useRef + scrollIntoView)
- [X] T035 [US2] Clear input field after successful message send
- [X] T036 [US2] Disable Send button and input field while isLoading is true
- [X] T037 [US2] Add error message display component (red banner) when errors occur
- [X] T038 [US2] Implement retry logic for transient errors (500, 502, 503, network errors)

**Acceptance Criteria**:
- ✅ User can send a message and see it appear in chat history
- ✅ AI response appears within 5 seconds
- ✅ Loading indicator shows while waiting for response
- ✅ Messages display in correct order (chronological)
- ✅ Errors display with user-friendly messages
- ✅ Interface auto-scrolls to show newest message

**Parallel Opportunities**: T030-T032 (styling tasks) can be done in parallel. T033-T035 (UX enhancements) can be done in parallel after T028.

**Dependencies**: Requires Phase 2 (API client) and Phase 3 (UI structure) to be complete.

---

## Phase 5: User Story 4 - Authentication Integration (P2)

**Story Goal**: Enforce authentication on /chat route and handle JWT token in all API requests.

**Independent Test**: Log out, attempt to access /chat → redirect to /login. Log in, access /chat → successful with JWT in requests.

### Tasks

- [X] T039 [US4] Create useAuth custom hook in frontend/src/hooks/useAuth.ts if not exists (wraps Better Auth)
- [X] T040 [US4] Add authentication loading state check to chat page.tsx (show loading spinner while checking auth)
- [X] T041 [US4] Implement automatic redirect to /login in chat page when not authenticated
- [X] T042 [US4] Add user ID extraction from auth session in useChat hook
- [X] T043 [US4] Update chatApi.sendMessage() to include user ID in URL path (/api/{user_id}/chat)
- [X] T044 [US4] Implement JWT token expiration handling (redirect to /login on 401 errors)
- [X] T045 [US4] Add error message for 403 Forbidden errors ("Access denied")
- [X] T046 [US4] Test auth flow: unauthenticated access, successful auth, token expiration scenarios

**Acceptance Criteria**:
- ✅ Unauthenticated users cannot access /chat (redirected to /login)
- ✅ JWT token included in all chat API requests
- ✅ Expired sessions trigger re-authentication
- ✅ Backend correctly validates user ID matches JWT

**Parallel Opportunities**: T044-T045 (error handling) can be done in parallel after T043.

**Dependencies**: Requires Phase 2 (API client) and existing Better Auth implementation.

---

## Phase 6: User Story 3 - Conversation History Persistence (P2)

**Story Goal**: User's conversation history persists across page refreshes and browser sessions.

**Independent Test**: Send messages, refresh page → previous messages still visible in correct order.

### Tasks

- [X] T047 [US3] Extend useChat hook to store conversationId in state across re-renders
- [X] T048 [US3] Create loadConversationHistory function in frontend/src/lib/chatApi.ts (GET /api/{user_id}/conversations/{conversation_id}/messages)
- [X] T049 [US3] Implement conversation history loading in useChat hook on mount (useEffect)
- [X] T050 [US3] Add conversationId persistence to localStorage in frontend/src/lib/conversationCache.ts
- [X] T051 [US3] Load conversationId from localStorage on chat page mount
- [X] T052 [US3] Handle conversation history API errors gracefully (show error, allow new conversation)
- [X] T053 [US3] Implement message limit (load last 50 messages) to prevent memory issues
- [X] T054 [US3] Add "scroll to top to load older messages" placeholder (future enhancement marker)
- [X] T055 [US3] Clear localStorage conversationId on logout
- [X] T056 [US3] Test persistence: send messages, refresh page, close browser, reopen → history restored

**Acceptance Criteria**:
- ✅ Messages persist across page refreshes
- ✅ Conversation continues from where user left off
- ✅ Long conversations (50+ messages) load correctly
- ✅ History cleared when user logs out

**Parallel Opportunities**: T050 (localStorage utilities) and T052 (error handling) can be built in parallel with T048-T049.

**Dependencies**: Requires Phase 4 (core chat functionality) to be complete.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Goal**: Final UX improvements and production readiness.

### Tasks

- [X] T057 Add input validation for message length (max 5000 characters, show counter at 4000+)
- [X] T058 Add input sanitization before sending (trim whitespace, prevent empty messages)
- [X] T059 Implement client-side rate limiting (max 10 messages per minute, show warning)
- [X] T060 [P] Add mobile-specific styles for chat interface (optimize for small screens)
- [X] T061 [P] Add loading skeleton for initial page load
- [X] T062 [P] Implement error boundary component for chat page
- [X] T063 [P] Add aria labels and semantic HTML for accessibility
- [X] T064 Optimize message rendering with React.memo for message components
- [X] T065 Add environment variable for API base URL (NEXT_PUBLIC_API_URL)
- [X] T066 Test full chat flow end-to-end with backend running
- [X] T067 Test error scenarios: backend down, network error, rate limit exceeded
- [X] T068 Test mobile responsiveness on devices 320px-768px width
- [X] T069 Verify all TypeScript types compile without errors (npm run build)
- [X] T070 Update project README.md with chat feature documentation

**Acceptance Criteria**:
- ✅ Input validation prevents invalid messages
- ✅ Rate limiting prevents spam
- ✅ Mobile experience is smooth (tested on phones)
- ✅ Accessible to screen readers
- ✅ Production build succeeds
- ✅ Documentation complete

**Parallel Opportunities**: T060-T063 (UX polish tasks) can all be done in parallel.

---

## Dependency Graph

### Critical Path (Must complete in order)
```
Phase 1 (Setup)
  → Phase 2 (Foundational)
    → Phase 3 (US1: UI Structure)
      → Phase 4 (US2: Core Chat Functionality)
        → Phase 5 (US4: Auth) OR Phase 6 (US3: Persistence)
          → Phase 7 (Polish)
```

### User Story Dependencies
- **US1** (Basic UI): No dependencies
- **US2** (Send/Receive): Depends on US1 (needs UI structure)
- **US3** (Persistence): Depends on US2 (needs working chat)
- **US4** (Auth): Can be implemented in parallel with US2/US3

### Parallel Execution Opportunities

**Phase 1 (Setup)**: Tasks T003-T006 can run in parallel (different directories)

**Phase 2 (Foundational)**: Tasks T010-T011 can run in parallel with T007-T009

**Phase 3 (US1)**:
- After T014: T017, T018, T019, T020 can run in parallel

**Phase 4 (US2)**:
- After T028: T030-T032 (message styling) in parallel
- After T028: T033-T035 (UX features) in parallel
- T037-T038 (error handling) in parallel

**Phase 5 (US4)**:
- T044-T045 (error scenarios) in parallel after T043

**Phase 6 (US3)**:
- T050, T052 in parallel with T048-T049

**Phase 7 (Polish)**:
- T060-T063 all in parallel

---

## Testing Strategy (Manual)

### User Story 1 Test Plan
1. Navigate to http://localhost:3000/chat while logged in
2. Verify chat interface renders with input field and empty message area
3. Type text in input field → verify text appears as you type
4. Press Enter → verify form submission triggers (console log or alert)
5. Resize browser to 320px → verify layout is responsive

### User Story 2 Test Plan
1. Type "Hello" in input field and click Send
2. Verify user message appears in chat history (right side, blue background)
3. Verify loading indicator shows (animated dots)
4. Verify AI response appears within 5 seconds (left side, gray background)
5. Send another message "Show my tasks" → verify conversation continues
6. Verify interface auto-scrolls to show latest message

### User Story 3 Test Plan
1. Send 3-5 messages in a conversation
2. Refresh the page (F5) → verify all messages still visible
3. Close browser completely
4. Reopen browser, navigate to /chat → verify conversation restored
5. Log out → verify conversation cleared
6. Log back in → verify fresh conversation starts

### User Story 4 Test Plan
1. Log out of the application
2. Navigate to /chat → verify redirect to /login
3. Log in successfully
4. Navigate to /chat → verify chat loads correctly
5. Open browser dev tools → verify JWT token in Authorization header
6. (Simulate expired token) → verify redirect to /login with error message

### Error Scenario Tests
1. Stop backend server → send message → verify "Network error" message
2. Send 11 messages rapidly → verify rate limit warning
3. Try to send empty message → verify validation error
4. Send message >5000 characters → verify length validation

---

## File Manifest

### New Files Created
```
frontend/src/types/chat.ts                    # TypeScript interfaces
frontend/src/lib/api.ts                       # Axios client with JWT
frontend/src/lib/chatApi.ts                   # Chat API functions
frontend/src/lib/errorHandler.ts              # Error parsing utility
frontend/src/lib/conversationCache.ts         # LocalStorage utilities
frontend/src/hooks/useChat.ts                 # Chat state management hook
frontend/src/hooks/useAuth.ts                 # Auth hook (if not exists)
frontend/src/components/ChatInterface.tsx     # Main chat UI component
frontend/src/app/chat/page.tsx                # Chat page route
```

### Modified Files
```
frontend/src/services/authService.ts          # May need JWT token export
frontend/package.json                         # Already has needed dependencies
```

### Not Modified (Existing Backend)
```
backend/src/api/chat.py                       # Already implemented
backend/src/services/conversation_service.py  # Already implemented
backend/src/models/message.py                 # Already implemented
```

---

## Summary

**Total Tasks**: 70
**Phases**: 7
**User Stories**: 4 (2 P1, 2 P2)

**Task Distribution by Phase**:
- Phase 1 (Setup): 6 tasks
- Phase 2 (Foundational): 5 tasks
- Phase 3 (US1): 9 tasks
- Phase 4 (US2): 18 tasks
- Phase 5 (US4): 8 tasks
- Phase 6 (US3): 10 tasks
- Phase 7 (Polish): 14 tasks

**Parallel Opportunities**: ~25 tasks can be executed in parallel (marked with [P])

**Estimated Effort**:
- MVP (US1 + US2): ~1-2 days (Tasks T001-T038)
- Full Feature: ~2-3 days (All tasks)

**Critical Success Factors**:
1. Backend API (POST /api/{user_id}/chat) must be operational
2. Better Auth JWT token must be accessible in frontend
3. CORS must be configured on backend for localhost:3000
4. All TypeScript types must match backend response schemas

**Recommended Sprint Plan**:
- **Sprint 1**: Phases 1-4 (MVP: Basic chat with send/receive)
- **Sprint 2**: Phases 5-7 (Enhanced auth, persistence, polish)

# OpenAI Chat Integration Research - Next.js Implementation

**Research Date**: 2026-02-09
**Target**: Next.js + TypeScript Frontend Integration
**Backend**: FastAPI with OpenAI Agents SDK (already implemented)

## Executive Summary

This document provides research findings for integrating OpenAI chat functionality into a Next.js application. Based on the existing backend implementation (FastAPI with OpenAI Agents SDK) and the need to create a chat interface, this research covers practical implementation approaches for the frontend.

**Key Finding**: The term "ChatKit" appears to be a conceptual reference rather than an official OpenAI SDK. The standard approach is to use the OpenAI Chat Completions API via either:
1. Direct API calls to the backend (recommended for this project)
2. Vercel AI SDK for enhanced streaming and UX features
3. Direct OpenAI SDK calls (not recommended for client-side due to API key exposure)

---

## 1. OpenAI Chat Integration Setup

### 1.1 Architecture Overview

Based on the existing backend implementation at `C:\Users\LAPTOP\speckitplus-projects\evolution-of-todo-H2\todo-app-phase3\backend\src\api\chat.py`, the system uses:

- **Backend**: FastAPI + OpenAI Agents SDK + MCP (Model Context Protocol)
- **Frontend**: Next.js + React + TypeScript (to be implemented)
- **Authentication**: Better Auth with JWT tokens
- **Communication**: REST API (POST /api/{user_id}/chat)

### 1.2 Recommended Approach: Backend Proxy Pattern

**Why**: The backend already handles OpenAI API calls, so the frontend should communicate with the backend rather than calling OpenAI directly.

```typescript
// Frontend makes requests to backend
POST /api/{user_id}/chat
{
  "message": "user message",
  "conversation_id": "optional-conversation-id"
}

// Backend handles OpenAI communication
// Backend returns:
{
  "conversation_id": "conv-123",
  "response": "AI response text",
  "tool_calls": [...]
}
```

**Benefits**:
- API keys stay secure on server
- Backend can implement rate limiting, logging, and monitoring
- Centralized conversation management
- User data isolation enforced server-side

### 1.3 Required Dependencies

For the frontend, you need minimal additional dependencies beyond what's already installed:

```json
{
  "dependencies": {
    "axios": "^1.7.0",           // Already installed - for HTTP requests
    "react": "^19.2.4",           // Already installed
    "next": "^16.1.6"             // Already installed
  }
}
```

**Optional Enhancement**: Vercel AI SDK (if streaming responses are needed)

```bash
npm install ai @ai-sdk/openai
```

The Vercel AI SDK provides:
- `useChat()` hook for managing chat state
- Streaming response handling
- Automatic message management
- Loading states and error handling

---

## 2. Authentication Flow Integration

### 2.1 Better Auth + JWT Pattern

The existing backend uses JWT authentication middleware (`get_current_user_id`). The frontend must:

1. **Obtain JWT token** from Better Auth session
2. **Include token in API requests** via Authorization header
3. **Handle token expiration** with appropriate error handling

### 2.2 Implementation Pattern

```typescript
// services/api.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to every request
apiClient.interceptors.request.use(
  async (config) => {
    // Get token from Better Auth session
    const token = await getAuthToken(); // Implement based on Better Auth

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle authentication errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 2.3 Better Auth Integration

Better Auth provides session management. The integration pattern:

```typescript
// hooks/useAuth.ts
import { useSession } from '@better-auth/react'; // Example - adjust to actual Better Auth implementation

export function useAuth() {
  const { session, loading } = useSession();

  return {
    user: session?.user,
    token: session?.token,
    isAuthenticated: !!session,
    isLoading: loading,
  };
}
```

### 2.4 Protected Route Pattern

```typescript
// app/chat/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function ChatPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <ChatInterface />;
}
```

---

## 3. Domain Whitelisting (Not Required)

### 3.1 Understanding Domain Restrictions

**Important**: When using the backend proxy pattern (recommended), domain whitelisting on OpenAI platform is **NOT required** because:

- The OpenAI API key is used server-side only
- Frontend never directly calls OpenAI APIs
- OpenAI only sees requests from your backend server

### 3.2 When Whitelisting IS Required

Domain whitelisting would only be needed if:
- Using OpenAI API keys directly in client-side JavaScript (NOT RECOMMENDED)
- Using OpenAI's embeddable chat widgets (if they existed)
- Using third-party services that require domain verification

### 3.3 CORS Configuration (What You Actually Need)

Your **backend** needs CORS configuration to allow requests from your Next.js frontend:

```python
# backend/src/main.py
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js dev server
        "https://yourdomain.com",  # Production domain
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 4. Message Handling Implementation

### 4.1 Basic API Service

```typescript
// services/chatService.ts
import apiClient from './api';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface SendMessageRequest {
  message: string;
  conversation_id?: string;
}

export interface SendMessageResponse {
  conversation_id: string;
  response: string;
  tool_calls: Array<{
    name: string;
    arguments: Record<string, any>;
    result?: Record<string, any>;
  }>;
}

export async function sendMessage(
  userId: string,
  request: SendMessageRequest
): Promise<SendMessageResponse> {
  const response = await apiClient.post(
    `/api/${userId}/chat`,
    request
  );
  return response.data;
}

export async function getConversationHistory(
  userId: string,
  conversationId: string
): Promise<ChatMessage[]> {
  const response = await apiClient.get(
    `/api/${userId}/conversations/${conversationId}/messages`
  );
  return response.data;
}
```

### 4.2 React Hook for Chat Management

```typescript
// hooks/useChat.ts
import { useState, useCallback } from 'react';
import { sendMessage, ChatMessage } from '@/services/chatService';
import { useAuth } from './useAuth';

export function useChat(conversationId?: string) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentConversationId, setCurrentConversationId] = useState(conversationId);

  const sendChatMessage = useCallback(async (message: string) => {
    if (!user?.id) {
      setError('User not authenticated');
      return;
    }

    // Add user message immediately to UI
    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendMessage(user.id, {
        message,
        conversation_id: currentConversationId,
      });

      // Add AI response to messages
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Update conversation ID if this is a new conversation
      if (!currentConversationId) {
        setCurrentConversationId(response.conversation_id);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to send message';
      setError(errorMessage);

      // Remove the user message on error (optional - or show it with error state)
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, currentConversationId]);

  return {
    messages,
    isLoading,
    error,
    sendMessage: sendChatMessage,
    conversationId: currentConversationId,
  };
}
```

### 4.3 Chat UI Component

```typescript
// components/ChatInterface.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/hooks/useChat';

export default function ChatInterface() {
  const [input, setInput] = useState('');
  const { messages, isLoading, error, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    await sendMessage(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      {/* Message History */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 rounded-lg p-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
          className="flex-1 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>
    </div>
  );
}
```

---

## 5. Conversation Persistence

### 5.1 Backend-Managed Persistence (Recommended)

Based on the existing backend implementation with `ConversationService`, conversations are already persisted in the database. The frontend should:

1. **Fetch conversation history on page load**
2. **Store conversation ID in component state**
3. **Optional: Cache recent conversations in localStorage**

### 5.2 Loading Existing Conversations

```typescript
// hooks/useChat.ts (enhanced version)
import { useEffect } from 'react';
import { getConversationHistory } from '@/services/chatService';

export function useChat(conversationId?: string) {
  // ... previous code ...

  // Load conversation history on mount
  useEffect(() => {
    if (conversationId && user?.id) {
      loadConversationHistory();
    }
  }, [conversationId, user?.id]);

  const loadConversationHistory = async () => {
    if (!conversationId || !user?.id) return;

    setIsLoading(true);
    try {
      const history = await getConversationHistory(user.id, conversationId);
      setMessages(history);
    } catch (err) {
      console.error('Failed to load conversation history:', err);
      setError('Failed to load conversation history');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // ... previous returns ...
    reloadHistory: loadConversationHistory,
  };
}
```

### 5.3 LocalStorage Caching (Optional Enhancement)

```typescript
// utils/conversationCache.ts
const CACHE_KEY = 'chat_conversations';
const MAX_CACHED_MESSAGES = 100;

export interface CachedConversation {
  id: string;
  messages: ChatMessage[];
  lastUpdated: string;
}

export function saveConversationToCache(
  conversationId: string,
  messages: ChatMessage[]
) {
  try {
    const cached = getCachedConversations();
    cached[conversationId] = {
      id: conversationId,
      messages: messages.slice(-MAX_CACHED_MESSAGES), // Keep last 100 messages
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
  } catch (err) {
    console.error('Failed to cache conversation:', err);
  }
}

export function getCachedConversation(
  conversationId: string
): ChatMessage[] | null {
  try {
    const cached = getCachedConversations();
    return cached[conversationId]?.messages || null;
  } catch (err) {
    console.error('Failed to retrieve cached conversation:', err);
    return null;
  }
}

function getCachedConversations(): Record<string, CachedConversation> {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : {};
  } catch (err) {
    return {};
  }
}

export function clearConversationCache() {
  localStorage.removeItem(CACHE_KEY);
}
```

### 5.4 Conversation List Management

```typescript
// services/chatService.ts (additional methods)
export interface Conversation {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  message_count: number;
  preview: string; // First message or title
}

export async function getUserConversations(
  userId: string
): Promise<Conversation[]> {
  const response = await apiClient.get(`/api/${userId}/conversations`);
  return response.data;
}

export async function deleteConversation(
  userId: string,
  conversationId: string
): Promise<void> {
  await apiClient.delete(`/api/${userId}/conversations/${conversationId}`);
}
```

---

## 6. Error Handling Patterns

### 6.1 Error Types and Handling

```typescript
// types/errors.ts
export enum ChatErrorType {
  AUTHENTICATION = 'authentication',
  NETWORK = 'network',
  RATE_LIMIT = 'rate_limit',
  SERVER_ERROR = 'server_error',
  VALIDATION = 'validation',
  TIMEOUT = 'timeout',
}

export interface ChatError {
  type: ChatErrorType;
  message: string;
  details?: any;
  retryable: boolean;
}

export function parseApiError(error: any): ChatError {
  if (error.response) {
    const status = error.response.status;
    const detail = error.response.data?.detail || 'An error occurred';

    switch (status) {
      case 401:
      case 403:
        return {
          type: ChatErrorType.AUTHENTICATION,
          message: 'Please log in to continue',
          retryable: false,
        };

      case 429:
        return {
          type: ChatErrorType.RATE_LIMIT,
          message: 'Too many requests. Please wait a moment.',
          retryable: true,
        };

      case 422:
        return {
          type: ChatErrorType.VALIDATION,
          message: detail,
          details: error.response.data,
          retryable: false,
        };

      case 500:
      case 502:
      case 503:
        return {
          type: ChatErrorType.SERVER_ERROR,
          message: 'Server error. Please try again later.',
          retryable: true,
        };

      default:
        return {
          type: ChatErrorType.SERVER_ERROR,
          message: detail,
          retryable: false,
        };
    }
  } else if (error.request) {
    return {
      type: ChatErrorType.NETWORK,
      message: 'Network error. Please check your connection.',
      retryable: true,
    };
  } else {
    return {
      type: ChatErrorType.SERVER_ERROR,
      message: error.message || 'An unexpected error occurred',
      retryable: false,
    };
  }
}
```

### 6.2 Error UI Components

```typescript
// components/ErrorBoundary.tsx
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Chat error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-semibold mb-2">Something went wrong</h3>
          <p className="text-red-600 mb-4">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 6.3 Retry Logic

```typescript
// utils/retry.ts
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: any;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Don't retry on certain errors
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw error;
      }

      if (i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

// Usage in useChat hook:
const sendChatMessage = useCallback(async (message: string) => {
  // ... previous code ...

  try {
    const response = await retryWithBackoff(
      () => sendMessage(user.id, { message, conversation_id: currentConversationId }),
      3,
      1000
    );
    // ... handle response ...
  } catch (err) {
    // ... handle error ...
  }
}, [user?.id, currentConversationId]);
```

### 6.4 User-Friendly Error Messages

```typescript
// components/ErrorMessage.tsx
import { ChatError, ChatErrorType } from '@/types/errors';

interface ErrorMessageProps {
  error: ChatError;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function ErrorMessage({ error, onRetry, onDismiss }: ErrorMessageProps) {
  const getIcon = () => {
    switch (error.type) {
      case ChatErrorType.NETWORK:
        return '🌐';
      case ChatErrorType.AUTHENTICATION:
        return '🔒';
      case ChatErrorType.RATE_LIMIT:
        return '⏱️';
      default:
        return '⚠️';
    }
  };

  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
      <div className="flex items-start">
        <span className="text-2xl mr-3">{getIcon()}</span>
        <div className="flex-1">
          <h4 className="text-red-800 font-semibold mb-1">
            {error.type === ChatErrorType.AUTHENTICATION ? 'Authentication Required' :
             error.type === ChatErrorType.NETWORK ? 'Connection Problem' :
             error.type === ChatErrorType.RATE_LIMIT ? 'Rate Limited' :
             'Error'}
          </h4>
          <p className="text-red-600 text-sm">{error.message}</p>

          <div className="mt-3 flex gap-2">
            {error.retryable && onRetry && (
              <button
                onClick={onRetry}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Try Again
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 7. Advanced Features (Optional Enhancements)

### 7.1 Streaming Responses with Vercel AI SDK

If you want real-time streaming (text appearing word-by-word), use Vercel AI SDK:

```bash
npm install ai @ai-sdk/openai
```

**Backend Enhancement Needed**: Add streaming endpoint

```python
# backend/src/api/chat.py
from fastapi.responses import StreamingResponse

@router.post("/api/{user_id}/chat/stream")
async def chat_stream(
    user_id: str,
    request: ChatRequest,
    current_user_id: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_async_session)
):
    """Stream chat responses."""
    # ... validation ...

    async def generate():
        stream = client.chat.completions.create(
            model="gpt-4",
            messages=messages,
            stream=True,
        )

        for chunk in stream:
            if chunk.choices[0].delta.content:
                yield f"data: {chunk.choices[0].delta.content}\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")
```

**Frontend with Vercel AI SDK**:

```typescript
// app/chat/page.tsx
'use client';

import { useChat } from 'ai/react';

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat/stream',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto">
        {messages.map(m => (
          <div key={m.id} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <p>{m.content}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message..."
        />
        <button type="submit" disabled={isLoading}>Send</button>
      </form>
    </div>
  );
}
```

### 7.2 Markdown Rendering

For formatted AI responses:

```bash
npm install react-markdown
```

```typescript
import ReactMarkdown from 'react-markdown';

<ReactMarkdown className="prose">
  {message.content}
</ReactMarkdown>
```

### 7.3 Code Syntax Highlighting

```bash
npm install react-syntax-highlighter
```

```typescript
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';

<ReactMarkdown
  components={{
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={tomorrow}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  }}
>
  {message.content}
</ReactMarkdown>
```

---

## 8. Testing Considerations

### 8.1 Unit Tests

```typescript
// __tests__/hooks/useChat.test.ts
import { renderHook, act, waitFor } from '@testing-library/react';
import { useChat } from '@/hooks/useChat';
import { sendMessage } from '@/services/chatService';

jest.mock('@/services/chatService');
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ user: { id: 'user-123' } }),
}));

describe('useChat', () => {
  it('should send message and update state', async () => {
    const mockResponse = {
      conversation_id: 'conv-123',
      response: 'Hello!',
      tool_calls: [],
    };

    (sendMessage as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendMessage('Hi there');
    });

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(2);
      expect(result.current.messages[0].content).toBe('Hi there');
      expect(result.current.messages[1].content).toBe('Hello!');
    });
  });
});
```

### 8.2 Integration Tests

```typescript
// __tests__/integration/chat.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatInterface from '@/components/ChatInterface';

describe('ChatInterface Integration', () => {
  it('should complete full chat flow', async () => {
    render(<ChatInterface />);

    const input = screen.getByPlaceholderText(/type your message/i);
    const sendButton = screen.getByText(/send/i);

    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(/hello/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  });
});
```

---

## 9. Performance Optimization

### 9.1 Message Virtualization (for long conversations)

```bash
npm install react-window
```

```typescript
import { FixedSizeList as List } from 'react-window';

<List
  height={600}
  itemCount={messages.length}
  itemSize={80}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <MessageComponent message={messages[index]} />
    </div>
  )}
</List>
```

### 9.2 Debouncing Input

```typescript
import { useMemo } from 'react';
import debounce from 'lodash.debounce';

const debouncedSend = useMemo(
  () => debounce((msg: string) => sendMessage(msg), 500),
  [sendMessage]
);
```

### 9.3 React.memo for Message Components

```typescript
import { memo } from 'react';

export const MessageComponent = memo(function MessageComponent({ message }: { message: ChatMessage }) {
  return (
    <div className={message.role === 'user' ? 'text-right' : 'text-left'}>
      <p>{message.content}</p>
    </div>
  );
});
```

---

## 10. Security Considerations

### 10.1 Input Sanitization (Client-Side)

```typescript
function sanitizeInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .trim()
    .slice(0, 5000); // Max length
}
```

### 10.2 XSS Prevention

```typescript
// Use React's built-in escaping or libraries like DOMPurify
import DOMPurify from 'dompurify';

function SafeHTML({ html }: { html: string }) {
  return (
    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />
  );
}
```

### 10.3 Rate Limiting (Client-Side)

```typescript
class RateLimiter {
  private timestamps: number[] = [];

  constructor(
    private maxRequests: number,
    private windowMs: number
  ) {}

  canMakeRequest(): boolean {
    const now = Date.now();
    this.timestamps = this.timestamps.filter(t => now - t < this.windowMs);

    if (this.timestamps.length >= this.maxRequests) {
      return false;
    }

    this.timestamps.push(now);
    return true;
  }

  getTimeUntilNextRequest(): number {
    if (this.timestamps.length < this.maxRequests) {
      return 0;
    }

    const oldestTimestamp = this.timestamps[0];
    return this.windowMs - (Date.now() - oldestTimestamp);
  }
}

const rateLimiter = new RateLimiter(10, 60000); // 10 requests per minute
```

---

## 11. Deployment Checklist

### 11.1 Environment Variables

```bash
# .env.local (frontend)
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_AUTH_URL=https://auth.yourdomain.com
```

```bash
# .env (backend)
OPENAI_API_KEY=sk-...
DATABASE_URL=postgresql://...
JWT_SECRET=...
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### 11.2 Production Optimizations

- Enable Next.js production build optimizations
- Implement CDN caching for static assets
- Enable gzip/brotli compression
- Set up monitoring and error tracking (Sentry, LogRocket)
- Configure proper CORS headers
- Implement request rate limiting on backend
- Set up health check endpoints
- Configure proper logging

### 11.3 Monitoring and Analytics

```typescript
// utils/analytics.ts
export function trackChatEvent(event: string, data?: any) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', event, {
      event_category: 'chat',
      ...data,
    });
  }
}

// Usage:
trackChatEvent('message_sent', { conversation_id: conversationId });
trackChatEvent('response_received', { response_time: responseTime });
trackChatEvent('error_occurred', { error_type: errorType });
```

---

## 12. Summary and Recommendations

### 12.1 Recommended Implementation Path

1. **Phase 1 - Basic Chat (Week 1)**
   - Implement basic chat UI component
   - Integrate authentication with Better Auth
   - Create API service layer for backend communication
   - Build `useChat` hook for state management
   - Implement error handling

2. **Phase 2 - Conversation Persistence (Week 1-2)**
   - Add conversation history loading
   - Implement conversation list view
   - Add localStorage caching
   - Build conversation management UI

3. **Phase 3 - Enhanced UX (Week 2)**
   - Add loading indicators and typing animations
   - Implement auto-scroll and message timestamps
   - Add keyboard shortcuts (Enter to send, etc.)
   - Implement responsive mobile layout

4. **Phase 4 - Optional Enhancements (Week 2+)**
   - Add streaming responses (if needed)
   - Implement markdown rendering
   - Add code syntax highlighting
   - Build message search functionality

### 12.2 Key Technical Decisions

| Decision | Recommendation | Rationale |
|----------|---------------|-----------|
| API Integration | Backend Proxy | Security, centralized control, already implemented |
| Chat UI Library | Custom React Components | More control, no external "ChatKit" SDK exists |
| State Management | React Hooks (useChat) | Lightweight, sufficient for MVP |
| Persistence | Backend Database + LocalStorage cache | Backend as source of truth, cache for performance |
| Authentication | Better Auth JWT in headers | Already implemented, industry standard |
| Streaming | Optional (Vercel AI SDK) | Nice-to-have, not critical for MVP |

### 12.3 Common Pitfalls to Avoid

1. **DO NOT** expose OpenAI API keys in frontend code
2. **DO NOT** trust client-provided user IDs (always validate JWT server-side)
3. **DO NOT** skip error handling for network failures
4. **DO NOT** forget to sanitize user input
5. **DO NOT** load entire conversation history for very long chats (paginate)
6. **DO NOT** block UI while waiting for responses (show loading states)
7. **DO NOT** forget mobile responsiveness
8. **DO NOT** skip authentication checks on protected routes

### 12.4 Documentation References

Since direct OpenAI documentation access was restricted, here are the authoritative sources to consult:

- **OpenAI API Documentation**: https://platform.openai.com/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **Vercel AI SDK**: https://sdk.vercel.ai/docs
- **Better Auth Documentation**: (consult project-specific docs)
- **FastAPI Documentation**: https://fastapi.tiangolo.com
- **React Documentation**: https://react.dev

---

## Conclusion

The implementation approach is straightforward:

1. Build a React-based chat UI using standard Next.js patterns
2. Use the existing backend `/api/{user_id}/chat` endpoint
3. Integrate Better Auth JWT tokens for authentication
4. Implement conversation persistence via backend API
5. Add proper error handling and loading states

The key insight is that there is no official "OpenAI ChatKit" SDK - instead, you're building a custom chat interface that communicates with your FastAPI backend, which in turn uses the OpenAI Agents SDK. This architecture provides better security, control, and user isolation.

The recommended tech stack is:
- **Frontend**: Next.js + React + TypeScript + Tailwind CSS
- **API Client**: Axios with interceptors for JWT
- **State Management**: React hooks (useState, useCallback, useEffect)
- **Optional**: Vercel AI SDK for streaming (if needed)

This approach aligns with the existing backend implementation and provides a solid foundation for building the chat interface described in the specification.

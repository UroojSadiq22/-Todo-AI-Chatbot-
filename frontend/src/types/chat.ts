/**
 * TypeScript type definitions for chat functionality
 * Feature: 003-chatkit-frontend-integration
 */

/**
 * Represents a single message in the conversation
 */
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string; // ISO 8601 format
}

/**
 * Request payload for sending a chat message
 */
export interface SendMessageRequest {
  message: string;
  conversation_id?: string;
}

/**
 * Response payload from sending a chat message
 */
export interface SendMessageResponse {
  conversation_id: string;
  response: string;
  tool_calls: ToolCall[];
}

/**
 * Represents an MCP tool invocation by the AI assistant
 */
export interface ToolCall {
  name: string;
  arguments: Record<string, any>;
  result?: Record<string, any>;
}

/**
 * Error type categories for chat operations
 */
export enum ChatErrorType {
  AUTHENTICATION = 'authentication',
  NETWORK = 'network',
  RATE_LIMIT = 'rate_limit',
  SERVER_ERROR = 'server_error',
  VALIDATION = 'validation',
  TIMEOUT = 'timeout',
}

/**
 * Represents an error state in the chat interface
 */
export interface ChatError {
  type: ChatErrorType;
  message: string;
  details?: any;
  retryable: boolean;
}

/**
 * Conversation metadata
 */
export interface Conversation {
  id: string;
  user_id: string;
  created_at: string; // ISO 8601 format
  updated_at: string; // ISO 8601 format
}

/**
 * Local component state for managing chat UI
 */
export interface ChatState {
  messages: ChatMessage[];
  conversationId: string | null;
  isLoading: boolean;
  error: ChatError | null;
  inputValue: string;
}

/**
 * User authentication data
 */
export interface AuthUser {
  id: string;
  email?: string;
  name?: string;
}

/**
 * Authentication context
 */
export interface AuthContext {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Chat API service functions
 * Feature: 003-chatkit-frontend-integration
 */

import apiClient from './api';
import { SendMessageRequest, SendMessageResponse, ChatMessage } from '@/types/chat';

/**
 * Send a chat message to the backend
 *
 * @param userId - The authenticated user's ID
 * @param request - Message content and optional conversation ID
 * @returns Promise resolving to the chat response
 */
export async function sendMessage(
  userId: string,
  request: SendMessageRequest
): Promise<SendMessageResponse> {
  const response = await apiClient.post<SendMessageResponse>(
    `/${userId}/chat`,
    request
  );
  return response.data;
}

/**
 * Load conversation history for an existing conversation
 *
 * @param userId - The authenticated user's ID
 * @param conversationId - UUID of the conversation
 * @param limit - Max number of messages to return (default: 50)
 * @returns Promise resolving to array of chat messages
 */
export async function loadConversationHistory(
  userId: string,
  conversationId: string,
  limit: number = 50
): Promise<ChatMessage[]> {
  const response = await apiClient.get<{
    messages: Array<{
      id: number;
      conversation_id: string;
      user_id: string;
      role: 'user' | 'assistant';
      content: string;
      created_at: string;
    }>;
    total: number;
    limit: number;
    offset: number;
  }>(`/${userId}/conversations/${conversationId}/messages`, {
    params: { limit, offset: 0 }
  });

  // Transform backend format to ChatMessage format
  return response.data.messages.map(msg => ({
    role: msg.role,
    content: msg.content,
    timestamp: msg.created_at,
  }));
}

/**
 * Get list of user's conversations
 *
 * @param userId - The authenticated user's ID
 * @param limit - Max conversations to return (default: 20)
 * @returns Promise resolving to array of conversations
 */
export async function getUserConversations(
  userId: string,
  limit: number = 20
): Promise<Array<{
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  message_count?: number;
}>> {
  const response = await apiClient.get(`/api/${userId}/conversations`, {
    params: { limit, offset: 0 }
  });
  return response.data.conversations || [];
}

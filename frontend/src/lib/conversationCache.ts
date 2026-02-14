/**
 * Conversation caching utilities using localStorage
 * Feature: 003-chatkit-frontend-integration
 * User Story 3: Conversation History Persistence
 */

import { ChatMessage } from '@/types/chat';

const CONVERSATION_ID_KEY = 'current_conversation_id';
const CACHE_KEY = 'chat_conversations';
const MAX_CACHED_MESSAGES = 100;
const CACHE_EXPIRY_HOURS = 1;

export interface CachedConversation {
  id: string;
  messages: ChatMessage[];
  lastUpdated: string;
}

/**
 * Save the current conversation ID to localStorage
 */
export function saveCurrentConversationId(conversationId: string): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(CONVERSATION_ID_KEY, conversationId);
  } catch (error) {
    console.error('Failed to save conversation ID:', error);
  }
}

/**
 * Get the current conversation ID from localStorage
 */
export function getCurrentConversationId(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    return localStorage.getItem(CONVERSATION_ID_KEY);
  } catch (error) {
    console.error('Failed to get conversation ID:', error);
    return null;
  }
}

/**
 * Clear the current conversation ID from localStorage
 */
export function clearCurrentConversationId(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(CONVERSATION_ID_KEY);
  } catch (error) {
    console.error('Failed to clear conversation ID:', error);
  }
}

/**
 * Save conversation messages to cache
 */
export function saveConversationToCache(
  conversationId: string,
  messages: ChatMessage[]
): void {
  if (typeof window === 'undefined') return;

  try {
    const cached = getCachedConversations();

    // Keep only the last MAX_CACHED_MESSAGES messages
    const messagesToCache = messages.slice(-MAX_CACHED_MESSAGES);

    cached[conversationId] = {
      id: conversationId,
      messages: messagesToCache,
      lastUpdated: new Date().toISOString(),
    };

    localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
  } catch (error) {
    console.error('Failed to cache conversation:', error);
  }
}

/**
 * Get cached conversation messages
 */
export function getCachedConversation(
  conversationId: string
): ChatMessage[] | null {
  if (typeof window === 'undefined') return null;

  try {
    const cached = getCachedConversations();
    const conversation = cached[conversationId];

    if (!conversation) {
      return null;
    }

    // Check if cache is expired (older than CACHE_EXPIRY_HOURS)
    const lastUpdated = new Date(conversation.lastUpdated);
    const now = new Date();
    const hoursSinceUpdate = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);

    if (hoursSinceUpdate > CACHE_EXPIRY_HOURS) {
      // Cache expired, return null to force refresh from backend
      return null;
    }

    return conversation.messages;
  } catch (error) {
    console.error('Failed to retrieve cached conversation:', error);
    return null;
  }
}

/**
 * Get all cached conversations
 */
function getCachedConversations(): Record<string, CachedConversation> {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : {};
  } catch (error) {
    console.error('Failed to parse cached conversations:', error);
    return {};
  }
}

/**
 * Clear all conversation cache
 */
export function clearConversationCache(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CONVERSATION_ID_KEY);
  } catch (error) {
    console.error('Failed to clear conversation cache:', error);
  }
}

/**
 * Clear conversation cache on logout
 * Should be called by the auth service
 */
export function handleLogout(): void {
  clearConversationCache();
}

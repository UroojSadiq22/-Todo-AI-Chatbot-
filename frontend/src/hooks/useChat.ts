/**
 * useChat hook for managing chat state and operations
 * Feature: 003-chatkit-frontend-integration
 * User Story 2: Send Message & Receive AI Response
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { sendMessage as apiSendMessage, loadConversationHistory } from '@/lib/chatApi';
import { parseApiError, retryWithBackoff } from '@/lib/errorHandler';
import { ChatMessage, ChatError } from '@/types/chat';
import { useAuth } from './useAuth';
import {
  getCurrentConversationId,
  saveCurrentConversationId,
  saveConversationToCache,
  getCachedConversation,
} from '@/lib/conversationCache';

interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: ChatError | null;
  conversationId: string | null;
  sendMessage: (message: string) => Promise<void>;
  clearError: () => void;
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ChatError | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const { user } = useAuth();

  // Load conversation history on mount
  useEffect(() => {
    if (!user?.id) return;

    const loadHistory = async () => {
      // Check for existing conversation ID in localStorage
      const savedConversationId = getCurrentConversationId();
      if (!savedConversationId) return;

      setIsLoadingHistory(true);
      setConversationId(savedConversationId);

      try {
        // Try to load from cache first
        const cachedMessages = getCachedConversation(savedConversationId);
        if (cachedMessages) {
          setMessages(cachedMessages);
          setIsLoadingHistory(false);
          return;
        }

        // If not in cache or expired, load from backend
        const history = await loadConversationHistory(
          user.id,
          savedConversationId,
          50 // Load last 50 messages
        );

        setMessages(history);
        // Update cache with loaded history
        saveConversationToCache(savedConversationId, history);
      } catch (err) {
        // If history loading fails, just start fresh
        // Don't show error to user, allow them to start new conversation
        console.error('Failed to load conversation history:', err);
        setMessages([]);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadHistory();
  }, [user?.id]);

  const sendMessage = useCallback(async (message: string) => {
    // Validate message
    if (!message.trim()) {
      setError({
        type: 'VALIDATION' as any,
        message: 'Message cannot be empty',
        retryable: false,
      });
      return;
    }

    // Check if user is authenticated
    if (!user || !user.id) {
      setError({
        type: 'AUTHENTICATION' as any,
        message: 'You must be logged in to send messages',
        retryable: false,
      });
      return;
    }

    const userId = user.id;

    // Optimistic UI update: add user message immediately
    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Send message to backend with retry logic
      const response = await retryWithBackoff(
        () => apiSendMessage(userId, {
          message,
          conversation_id: conversationId || undefined,
        }),
        3, // max retries
        1000 // initial delay ms
      );

      // Add assistant response to messages
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Update conversation ID if this is a new conversation
      if (!conversationId && response.conversation_id) {
        setConversationId(response.conversation_id);
        // Save to localStorage for persistence
        saveCurrentConversationId(response.conversation_id);
      }

      // Update cache with new messages
      if (response.conversation_id) {
        const updatedMessages = [...messages, userMessage, assistantMessage];
        saveConversationToCache(response.conversation_id, updatedMessages);
      }
    } catch (err) {
      // Parse error and set error state
      const chatError = parseApiError(err);
      setError(chatError);

      // Remove the optimistic user message on error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, user]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    conversationId,
    sendMessage,
    clearError,
  };
}

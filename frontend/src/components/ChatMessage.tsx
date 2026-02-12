/**
 * Optimized ChatMessage component with React.memo
 * Feature: 003-chatkit-frontend-integration
 * Phase 7: Performance optimization
 */

'use client';

import { memo } from 'react';
import { ChatMessage as ChatMessageType } from '@/types/chat';

interface ChatMessageProps {
  message: ChatMessageType;
}

function ChatMessageComponent({ message }: ChatMessageProps) {
  // Format timestamp for display
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div
      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          message.role === 'user'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-900'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        <span className={`text-xs mt-1 block ${
          message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
        }`}>
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}

// Export memoized version to prevent unnecessary re-renders
export const ChatMessage = memo(ChatMessageComponent, (prevProps, nextProps) => {
  // Only re-render if the message content actually changed
  return (
    prevProps.message.content === nextProps.message.content &&
    prevProps.message.role === nextProps.message.role &&
    prevProps.message.timestamp === nextProps.message.timestamp
  );
});

ChatMessage.displayName = 'ChatMessage';

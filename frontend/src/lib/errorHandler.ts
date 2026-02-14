/**
 * Error handling utilities for chat operations
 * Feature: 003-chatkit-frontend-integration
 */

import { AxiosError } from 'axios';
import { ChatError, ChatErrorType } from '@/types/chat';

/**
 * Parse an Axios error into a user-friendly ChatError
 *
 * @param error - The error from an API request
 * @returns ChatError with type, message, and retryable flag
 */
export function parseApiError(error: unknown): ChatError {
  // Type guard for AxiosError
  if (!(error as AxiosError).response && !(error as AxiosError).request) {
    // Not an Axios error, treat as generic error
    return {
      type: ChatErrorType.SERVER_ERROR,
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      retryable: false,
    };
  }

  const axiosError = error as AxiosError;

  // Check if we have a response (server responded with error status)
  if (axiosError.response) {
    const status = axiosError.response.status;
    const detail = (axiosError.response.data as any)?.detail || 'An error occurred';

    switch (status) {
      case 401:
        return {
          type: ChatErrorType.AUTHENTICATION,
          message: 'Your session has expired. Please log in again.',
          retryable: false,
        };

      case 403:
        return {
          type: ChatErrorType.AUTHENTICATION,
          message: 'Access denied. You do not have permission to access this resource.',
          retryable: false,
        };

      case 429:
        return {
          type: ChatErrorType.RATE_LIMIT,
          message: 'Too many requests. Please wait a moment before trying again.',
          retryable: true,
        };

      case 422:
        return {
          type: ChatErrorType.VALIDATION,
          message: typeof detail === 'string' ? detail : 'Invalid input provided',
          details: axiosError.response.data,
          retryable: false,
        };

      case 500:
      case 502:
      case 503:
      case 504:
        return {
          type: ChatErrorType.SERVER_ERROR,
          message: 'The server encountered an error. Please try again in a moment.',
          retryable: true,
        };

      default:
        return {
          type: ChatErrorType.SERVER_ERROR,
          message: typeof detail === 'string' ? detail : 'An error occurred',
          retryable: false,
        };
    }
  }

  // Check if request was made but no response received (network error)
  if (axiosError.request) {
    return {
      type: ChatErrorType.NETWORK,
      message: 'Unable to connect to the server. Please check your internet connection.',
      retryable: true,
    };
  }

  // Request wasn't sent (timeout or setup error)
  if (axiosError.code === 'ECONNABORTED' || axiosError.message?.includes('timeout')) {
    return {
      type: ChatErrorType.TIMEOUT,
      message: 'The request took too long. Please try again.',
      retryable: true,
    };
  }

  // Fallback for unknown errors
  return {
    type: ChatErrorType.SERVER_ERROR,
    message: axiosError.message || 'An unexpected error occurred',
    retryable: false,
  };
}

/**
 * Retry a function with exponential backoff
 *
 * @param fn - The async function to retry
 * @param maxRetries - Maximum number of retry attempts (default: 3)
 * @param initialDelay - Initial delay in milliseconds (default: 1000)
 * @returns Promise resolving to the function result
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: any;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry on non-retryable errors
      const chatError = parseApiError(error);
      if (!chatError.retryable) {
        throw error;
      }

      // Don't delay after last attempt
      if (attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

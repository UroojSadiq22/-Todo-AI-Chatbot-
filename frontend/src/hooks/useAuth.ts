/**
 * useAuth hook for managing authentication state
 * Feature: 003-chatkit-frontend-integration
 * User Story 4: Authentication Integration
 */

'use client';

import { useState, useEffect } from 'react';
import { isAuthenticated, getToken, getCurrentUser } from '@/services/auth';
import { AuthContext, AuthUser } from '@/types/chat';

export function useAuth(): AuthContext {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication on mount
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      const authToken = getToken();
      const currentUser = getCurrentUser();

      if (authenticated && authToken && currentUser) {
        setUser({
          id: currentUser.id,
          email: currentUser.email,
          name: currentUser.name,
        });
        setToken(authToken);
      } else {
        setUser(null);
        setToken(null);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  return {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
  };
}

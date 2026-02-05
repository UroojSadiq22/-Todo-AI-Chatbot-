"use client";

/** Authentication context for the Todo application. */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { verifyToken, getToken } from '../services/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Check authentication status on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = getToken();
        if (token) {
          const isValid = await verifyToken();
          if (isValid) {
            // In a real app, we would fetch the user details using the token
            // For now, we'll just set isAuthenticated to true
            setIsAuthenticated(true);

            // Mock user data - in a real app, fetch this from the API
            setUser({
              id: 'mock-user-id',
              email: 'mock@example.com',
              name: 'Mock User',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
          } else {
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    // This would normally call the login function from auth service
    // For now, we'll simulate the process
    setLoading(true);
    try {
      // In a real app, this would be:
      // const { user: loggedInUser, token } = await loginService(email, password);

      // Mock login - in real app, replace with actual API call
      const mockUser: User = {
        id: 'mock-user-id',
        email,
        name: 'Mock User', // In a real app, this would come from the API
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setUser(mockUser);
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, name: string, password: string) => {
    // This would normally call the register function from auth service
    // For now, we'll simulate the process
    setLoading(true);
    try {
      // In a real app, this would be:
      // const { user: registeredUser, token } = await registerService(email, name, password);

      // Mock registration - in real app, replace with actual API call
      const mockUser: User = {
        id: 'mock-user-id',
        email,
        name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setUser(mockUser);
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // In a real app, this would call the logout function from auth service
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
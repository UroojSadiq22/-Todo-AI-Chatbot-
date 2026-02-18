// /** Authentication service for the Todo application. */

// import { User } from '../types';
// import { authAPI } from './api';

// // Store the current user
// let currentUser: User | null = null;

// // Check if user is logged in
// // export const isAuthenticated = (): boolean => {
// //   return !!localStorage.getItem('access_token');
// // };
// export const isAuthenticated = (): boolean => {
//   if (typeof window === 'undefined') return false;
//   return !!localStorage.getItem('access_token');
// };


// // Get the current user
// export const getCurrentUser = (): User | null => {
//   return currentUser;
// };

// // Login function
// export const login = async (email: string, password: string): Promise<{user: User, token: string}> => {
//   try {
//     const response = await authAPI.login(email, password);
//     const { user: userData, token } = response.data;

//     // Store the token in localStorage
//     localStorage.setItem('access_token', token);

//     // Use the user data from the response
//     const user: User = {
//       id: userData.id,
//       email: userData.email,
//       name: userData.email.split('@')[0], // Use part of email as name if not provided
//       created_at: userData.created_at,
//       updated_at: userData.updated_at,
//     };

//     currentUser = user;

//     return { user, token };
//   } catch (error) {
//     throw new Error('Login failed. Please check your credentials.');
//   }
// };

// // Register function
// export const register = async (username: string, email: string, password: string): Promise<{user: User, token: string}> => {
//   try {
//     const response = await authAPI.register({ email, password, username });
//     const { user: userData, token } = response.data;

//     // Store the token in localStorage
//     localStorage.setItem('access_token', token);

//     // Use the user data from the response
//     const user: User = {
//       id: userData.id,
//       email: userData.email,
//       name: userData.username || userData.email.split('@')[0], // Use part of email as name if not provided
//       created_at: userData.created_at,
//       updated_at: userData.updated_at,
//     };

//     currentUser = user;

//     return { user, token };
//   } catch (error: any) {
//     // Propagate the actual error from the API
//     if (error.response) {
//       // Server responded with error status
//       throw {
//         status: error.response.status,
//         data: error.response.data,
//         message: error.response.data.detail || 'Registration failed'
//       };
//     } else if (error.request) {
//       // Request was made but no response received
//       throw new Error('Network error. Please check your connection.');
//     } else {
//       // Something else happened
//       throw new Error(error.message || 'Registration failed. Please try again.');
//     }
//   }
// };

// // Logout function
// export const logout = (): void => {
//   localStorage.removeItem('access_token');
//   currentUser = null;

//   // Clear conversation cache on logout
//   if (typeof window !== 'undefined') {
//     localStorage.removeItem('current_conversation_id');
//     localStorage.removeItem('chat_conversations');
//   }
// };

// // Get token from localStorage
// export const getToken = (): string | null => {
//   return localStorage.getItem('access_token');
// };

// // Verify token validity (in a real app, this would make an API call)
// export const verifyToken = async (): Promise<boolean> => {
//   const token = getToken();
//   if (!token) {
//     return false;
//   }

//   // In a real implementation, you would make an API call to verify the token
//   // For now, we'll just check if it exists and hasn't expired

//   try {
//     // Decode the token to check expiration (basic implementation)
//     const parts = token.split('.');
//     if (parts.length !== 3) {
//       return false;
//     }

//     // Parse the payload part of the JWT
//     const payload = JSON.parse(atob(parts[1]));
//     const currentTime = Math.floor(Date.now() / 1000);

//     // Check if token is expired
//     return payload.exp > currentTime;
//   } catch (error) {
//     return false;
//   }
// };




/** Authentication service for the Todo application. */

import { User } from '../types';
import { authAPI } from './api';

// ============================================
// HELPER FUNCTIONS FOR LOCALSTORAGE
// ============================================

const setStoredUser = (user: User | null): void => {
  if (typeof window === 'undefined') return;
  
  if (user) {
    localStorage.setItem('user_data', JSON.stringify(user));
  } else {
    localStorage.removeItem('user_data');
  }
};

const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem('user_data');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error parsing stored user:', error);
    return null;
  }
};

// ============================================
// PUBLIC API FUNCTIONS
// ============================================

/**
 * Check if user is logged in
 */
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('access_token');
};

/**
 * Get the current user from localStorage
 */
export const getCurrentUser = (): User | null => {
  return getStoredUser();
};

/**
 * Login user with email and password
 */
export const login = async (email: string, password: string): Promise<{user: User, token: string}> => {
  try {
    const response = await authAPI.login(email, password);
    const { user: userData, token } = response.data;

    // Store the token
    localStorage.setItem('access_token', token);

    // Create user object from API response
    const user: User = {
      id: userData.id,
      email: userData.email,
      name: userData.username || userData.email.split('@')[0],
      created_at: userData.created_at,
      updated_at: userData.updated_at,
    };

    // Store user data in localStorage
    setStoredUser(user);

    return { user, token };
  } catch (error) {
    throw new Error('Login failed. Please check your credentials.');
  }
};

/**
 * Register new user
 */
export const register = async (username: string, email: string, password: string): Promise<{user: User, token: string}> => {
  try {
    const response = await authAPI.register({ email, password, username });
    const { user: userData, token } = response.data;

    // Store the token
    localStorage.setItem('access_token', token);

    // Create user object from API response
    const user: User = {
      id: userData.id,
      email: userData.email,
      name: userData.username || userData.email.split('@')[0],
      created_at: userData.created_at,
      updated_at: userData.updated_at,
    };

    // Store user data in localStorage
    setStoredUser(user);

    return { user, token };
  } catch (error: any) {
    // Propagate the actual error from the API
    if (error.response) {
      throw {
        status: error.response.status,
        data: error.response.data,
        message: error.response.data.detail || 'Registration failed'
      };
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error(error.message || 'Registration failed. Please try again.');
    }
  }
};

/**
 * Logout user and clear all stored data
 */
export const logout = (): void => {
  // Clear authentication token
  localStorage.removeItem('access_token');
  
  // Clear user data
  setStoredUser(null);

  // Clear conversation cache
  if (typeof window !== 'undefined') {
    localStorage.removeItem('current_conversation_id');
    localStorage.removeItem('chat_conversations');
  }
};

/**
 * Get authentication token from localStorage
 */
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
};

/**
 * Verify if token is valid and not expired
 */
export const verifyToken = async (): Promise<boolean> => {
  const token = getToken();
  if (!token) {
    return false;
  }

  try {
    // Decode the JWT token to check expiration
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }

    // Parse the payload
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    // Check if token is expired
    if (payload.exp <= currentTime) {
      // Token expired, clear everything
      logout();
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error verifying token:', error);
    return false;
  }
};
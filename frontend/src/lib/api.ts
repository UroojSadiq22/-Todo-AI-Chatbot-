/**
 * Axios API client with JWT authentication interceptors
 * Feature: 003-chatkit-frontend-integration
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Create Axios instance with base configuration
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

/**
 * Get JWT token from auth service
 */
async function getAuthToken(): Promise<string | null> {
  if (typeof window !== 'undefined') {
    // Get token from localStorage (set by auth service)
    const token = localStorage.getItem('access_token');
    return token;
  }

  return null;
}

/**
 * Request interceptor: Add JWT token to Authorization header
 */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getAuthToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor: Handle authentication errors
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      // Clear any stored tokens
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('auth_token');
        localStorage.removeItem('auth_token');

        // Redirect to login page
        window.location.href = '/login';
      }
    }

    // Handle 403 Forbidden - insufficient permissions
    if (error.response?.status === 403) {
      console.error('Access denied: You do not have permission to access this resource');
    }

    return Promise.reject(error);
  }
);

export default apiClient;

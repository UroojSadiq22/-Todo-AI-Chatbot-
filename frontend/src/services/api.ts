/** API service for todo operations. */

import axios, { AxiosResponse } from 'axios';
import { Todo, TodoCreate, TodoUpdate } from '../types';

// Base API URL from environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login if unauthorized
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Todo API functions
export const todoAPI = {
  // Get all todos for the current user
  getTodos: (completed?: boolean, limit?: number, offset?: number): Promise<AxiosResponse<Todo[]>> => {
    const params = new URLSearchParams();
    if (completed !== undefined) params.append('completed', completed.toString());
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());

    const queryString = params.toString();
    const url = queryString ? `/todos/?${queryString}` : '/todos/';

    return api.get<Todo[]>(url);
  },

  // Create a new todo
  createTodo: (todo: TodoCreate): Promise<AxiosResponse<Todo>> => {
    return api.post<Todo>('/todos/', todo);
  },

  // Get a specific todo by ID
  getTodo: (id: string): Promise<AxiosResponse<Todo>> => {
    return api.get<Todo>(`/todos/${id}/`);
  },

  // Update a specific todo
  updateTodo: (id: string, todo: TodoUpdate): Promise<AxiosResponse<Todo>> => {
    return api.put<Todo>(`/todos/${id}/`, todo);
  },

  // Toggle completion status of a todo
  toggleTodo: (id: string): Promise<AxiosResponse<Todo>> => {
    return api.patch<Todo>(`/todos/${id}/toggle`);
  },

  // Delete a specific todo
  deleteTodo: (id: string): Promise<AxiosResponse<void>> => {
    return api.delete<void>(`/todos/${id}/`);
  },
};

// Auth API functions
export const authAPI = {
  // Login
  login: (email: string, password: string): Promise<AxiosResponse<{user: any, token: string, message: string}>> => {
    return api.post('/auth/login', { email, password });
  },

  // Register
  register: (userData: {email: string, password: string, username: string}): Promise<AxiosResponse<{user: any, token: string, message: string}>> => {
    console.log('API call - Sending registration data:', userData); // Add this
    return api.post('/auth/register', userData);
  },
};
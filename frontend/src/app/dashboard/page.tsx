/** Dashboard page for todo management. */

'use client';

import React, { useState, useEffect } from 'react';
import { Todo, TodoCreate, TodoUpdate } from '../../types';
import TodoForm from '../../components/TodoForm';
import TodoList from '../../components/TodoList';
import ProtectedRoute from '../../components/ProtectedRoute';
import { todoAPI } from '../../services/api';

const DashboardPage: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load todos when component mounts
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await todoAPI.getTodos();
      setTodos(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load todos. Please try again later.');
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTodo = async (todoData: TodoCreate) => {
    try {
      const response = await todoAPI.createTodo(todoData);
      setTodos([...todos, response.data]);
    } catch (err) {
      setError('Failed to create todo. Please try again.');
      console.error('Error creating todo:', err);
    }
  };

  const handleToggleTodo = async (id: string) => {
    try {
      const response = await todoAPI.toggleTodo(id);
      setTodos(todos.map(todo =>
        todo.id === id ? response.data : todo
      ));
    } catch (err) {
      setError('Failed to update todo. Please try again.');
      console.error('Error toggling todo:', err);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await todoAPI.deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      setError('Failed to delete todo. Please try again.');
      console.error('Error deleting todo:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Todo Dashboard</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <TodoForm onSubmit={handleCreateTodo} />

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Your Todos</h2>
            <span className="text-sm text-gray-500">
              {todos.length} {todos.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          <TodoList
            todos={todos}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;
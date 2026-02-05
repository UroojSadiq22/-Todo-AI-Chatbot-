/** Responsive UI tests for the Todo application. */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoList from '../../src/components/TodoList';
import TodoForm from '../../src/components/TodoForm';

// Mock todo data
const mockTodos = [
  {
    id: '1',
    title: 'Test Todo',
    description: 'Test Description',
    completed: false,
    user_id: 'user1',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  }
];

describe('Responsive UI Tests', () => {
  it('renders TodoList with responsive classes', () => {
    render(<TodoList todos={mockTodos} onToggle={() => {}} onDelete={() => {}} />);

    // Check that the responsive classes are applied
    const listItem = screen.getByText('Test Todo').closest('li');
    expect(listItem).toHaveClass('flex-col', 'sm:flex-row'); // Mobile-first: flex-col, then sm:flex-row on small screens
  });

  it('renders TodoForm with responsive classes', () => {
    const { container } = render(<TodoForm onSubmit={() => {}} />);

    // Check that responsive classes are applied to form elements
    const form = container.querySelector('form');
    expect(form).toHaveClass('p-4', 'sm:p-6'); // Different padding on mobile vs small screens+
  });

  it('renders buttons with responsive sizing', () => {
    render(<TodoForm onSubmit={() => {}} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('text-base', 'sm:text-sm'); // Different font sizes on different screens
  });
});
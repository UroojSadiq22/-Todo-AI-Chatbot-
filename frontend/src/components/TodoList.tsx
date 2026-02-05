/** TodoList component for displaying todos. */

import React from 'react';
import { Todo } from '../types';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onToggle, onDelete }) => {
  return (
    <div className="todo-list">
      <h2 className="text-xl font-bold mb-4">Your Todos</h2>
      {todos.length === 0 ? (
        <p className="text-gray-500">No todos yet. Add one to get started!</p>
      ) : (
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg ${
                todo.completed ? 'bg-green-50' : 'bg-white'
              }`}
            >
              <div className="flex items-center mb-2 sm:mb-0">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => onToggle(todo.id)}
                  className="mr-3 h-5 w-5"
                />
                <div>
                  <h3 className={`font-medium ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                    {todo.title}
                  </h3>
                  {todo.description && (
                    <p className="text-sm text-gray-600 mt-1 sm:hidden">{todo.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                {todo.description && (
                  <p className="hidden sm:block text-sm text-gray-600 mr-2 truncate max-w-[100px]">{todo.description}</p>
                )}
                <button
                  onClick={() => onDelete(todo.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                  aria-label="Delete todo"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;
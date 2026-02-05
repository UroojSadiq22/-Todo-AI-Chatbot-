/** TodoForm component for creating and updating todos. */

import React, { useState } from 'react';
import { TodoCreate } from '../types';

interface TodoFormProps {
  onSubmit: (todo: TodoCreate) => void;
  initialData?: TodoCreate;
  isEditing?: boolean;
}

const TodoForm: React.FC<TodoFormProps> = ({ onSubmit, initialData, isEditing = false }) => {
  const [formData, setFormData] = useState<TodoCreate>({
    title: initialData?.title || '',
    description: initialData?.description || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // Reset form if it's not in editing mode
    if (!isEditing) {
      setFormData({ title: '', description: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 sm:p-6 border rounded-lg bg-gray-50">
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="What needs to be done?"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Add details (optional)"
        />
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-base sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {isEditing ? 'Update Todo' : 'Add Todo'}
      </button>
    </form>
  );
};

export default TodoForm;
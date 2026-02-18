'use client';

import React, { useState, useEffect } from 'react';
import { Todo, TodoCreate } from '../../../types';
import TodoForm from '../../../components/TodoForm';
import TodoList from '../../../components/TodoList';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { todoAPI } from '../../../services/api';
import { motion } from 'framer-motion';
import { 
  CheckSquare, Plus, Filter, Search, 
  Calendar, Clock, AlertCircle 
} from 'lucide-react';

const TodosPage: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => { fetchTodos(); }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await todoAPI.getTodos();
      setTodos(response.data);
    } catch (err) {
      setError('Failed to load todos.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTodo = async (todoData: TodoCreate) => {
    try {
      const response = await todoAPI.createTodo(todoData);
      setTodos([...todos, response.data]);
      setShowAddForm(false);
    } catch (err) { 
      setError('Create failed.'); 
    }
  };
  
  const handleDeleteTodo = async (id: string) => {
    try {
      await todoAPI.deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      setError('Failed to delete todo.');
    }
  };

  const handleToggleTodo = async (id: string) => {
    try {
      const response = await todoAPI.toggleTodo(id);
      setTodos(todos.map(t => t.id === id ? response.data : t));
    } catch (err) { 
      setError('Update failed.'); 
    }
  };

  // Filter todos based on search and status
  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (todo.description?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'completed' && todo.completed) ||
                         (filterStatus === 'pending' && !todo.completed);
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    pending: todos.filter(t => !t.completed).length,
  };

  if (loading) return <LoadingSpinner />;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#F8FAFC] flex">
        <div className="flex-1 px-4 md:px-10 py-8">
          
          {/* Header */}
          <header className="mb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                  <CheckSquare className="text-purple-600" size={32} />
                  My Tasks
                </h1>
                <p className="text-slate-500 font-medium mt-1">Manage and organize your todos</p>
              </div>
              
              <motion.button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus size={20} />
                Add New Task
              </motion.button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <StatBox icon={<CheckSquare />} label="Total Tasks" value={stats.total} color="indigo" />
              <StatBox icon={<Clock />} label="Pending" value={stats.pending} color="orange" />
              <StatBox icon={<Calendar />} label="Completed" value={stats.completed} color="emerald" />
            </div>
          </header>

          {/* Add Todo Form */}
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-3xl shadow-lg border border-slate-200 mb-8"
            >
              <h3 className="text-xl font-bold text-slate-800 mb-6">Create New Task</h3>
              <TodoForm onSubmit={handleCreateTodo} />
            </motion.div>
          )}

          {/* Search and Filter Bar */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              {/* Filter */}
              <div className="flex gap-2">
                <FilterBtn 
                  active={filterStatus === 'all'} 
                  onClick={() => setFilterStatus('all')} 
                  label="All" 
                />
                <FilterBtn 
                  active={filterStatus === 'pending'} 
                  onClick={() => setFilterStatus('pending')} 
                  label="Pending" 
                />
                <FilterBtn 
                  active={filterStatus === 'completed'} 
                  onClick={() => setFilterStatus('completed')} 
                  label="Completed" 
                />
              </div>
            </div>
          </div>

          {/* Todo List */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
            {filteredTodos.length === 0 ? (
              <div className="text-center py-20">
                <AlertCircle className="mx-auto text-slate-300 mb-4" size={64} />
                <h3 className="text-xl font-bold text-slate-600 mb-2">No tasks found</h3>
                <p className="text-slate-400">Try adjusting your search or filters</p>
              </div>
            ) : (
              <TodoList todos={filteredTodos} onToggle={handleToggleTodo} onDelete={handleDeleteTodo} />
            )}
          </div>

          {error && (
            <div className="fixed bottom-6 right-6 bg-rose-500 text-white px-6 py-4 rounded-2xl shadow-xl">
              {error}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

const StatBox = ({ icon, label, value, color }: any) => (
  <div className={`bg-gradient-to-br from-${color}-50 to-${color}-100 p-6 rounded-2xl border border-${color}-200`}>
    <div className="flex items-center gap-4">
      <div className={`p-3 bg-${color}-500 text-white rounded-xl shadow-lg`}>
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <div>
        <div className="text-3xl font-black text-slate-800">{value}</div>
        <div className="text-slate-600 text-sm font-medium">{label}</div>
      </div>
    </div>
  </div>
);

const FilterBtn = ({ active, onClick, label }: any) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 rounded-xl font-bold transition-all ${
      active 
        ? 'bg-slate-900 text-white shadow-lg' 
        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
    }`}
  >
    {label}
  </button>
);

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
    <motion.div 
      animate={{ rotate: 360 }} 
      transition={{ repeat: Infinity, duration: 1 }} 
      className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full" 
    />
  </div>
);

export default TodosPage;

/** TodoList component — beautifully styled to match the Focus Workspace dashboard */

import React, { useState } from 'react';
import { Todo } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trash2, CheckCircle2, Circle, ChevronDown,
  ChevronUp, ClipboardList, Sparkles, AlignLeft
} from 'lucide-react';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onToggle, onDelete }) => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    setTimeout(() => {
      onDelete(id);
      setDeleting(null);
    }, 300);
  };

  const toggleExpand = (id: string) => {
    setExpanded(prev => prev === id ? null : id);
  };

  if (todos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <div className="w-16 h-16 rounded-3xl bg-violet-50 flex items-center justify-center mb-4">
          <ClipboardList size={28} className="text-violet-300" />
        </div>
        <p className="text-slate-700 font-bold text-base mb-1">All clear!</p>
        <p className="text-slate-400 text-sm">No tasks here. Add one to get started.</p>
      </motion.div>
    );
  }

  const done    = todos.filter(t =>  t.completed);
  const pending = todos.filter(t => !t.completed);

  return (
    <div className="space-y-3">

      {/* ── Pending Tasks ── */}
      <AnimatePresence initial={false}>
        {pending.map((todo, i) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            index={i}
            expanded={expanded === todo.id}
            deleting={deleting === todo.id}
            onToggle={onToggle}
            onDelete={handleDelete}
            onExpand={toggleExpand}
          />
        ))}
      </AnimatePresence>

      {/* ── Completed Section ── */}
      {done.length > 0 && (
        <div className="pt-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1 bg-slate-100" />
            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <Sparkles size={11} className="text-emerald-400" />
              Completed · {done.length}
            </span>
            <div className="h-px flex-1 bg-slate-100" />
          </div>
          <AnimatePresence initial={false}>
            {done.map((todo, i) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                index={i}
                expanded={expanded === todo.id}
                deleting={deleting === todo.id}
                onToggle={onToggle}
                onDelete={handleDelete}
                onExpand={toggleExpand}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

/* ─── Single Todo Item ─────────────────────────────────────────── */
interface TodoItemProps {
  todo:     Todo;
  index:    number;
  expanded: boolean;
  deleting: boolean;
  onToggle:  (id: string) => void;
  onDelete:  (id: string) => void;
  onExpand:  (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo, index, expanded, deleting, onToggle, onDelete, onExpand
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: deleting ? 0 : 1, x: deleting ? 40 : 0, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.22, delay: index * 0.04 }}
      className={`group rounded-2xl border transition-all duration-200 overflow-hidden ${
        todo.completed
          ? 'bg-emerald-50/60 border-emerald-100'
          : 'bg-white border-slate-100 hover:border-violet-200 hover:shadow-md hover:shadow-violet-50'
      }`}
    >
      <div className="flex items-center gap-3 px-5 py-4">

        {/* Checkbox */}
        <button
          onClick={() => onToggle(todo.id)}
          className="flex-shrink-0 transition-transform hover:scale-110 active:scale-95"
          aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          <AnimatePresence mode="wait">
            {todo.completed ? (
              <motion.div key="done" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <CheckCircle2 size={22} className="text-emerald-500" />
              </motion.div>
            ) : (
              <motion.div key="todo" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <Circle size={22} className="text-slate-300 group-hover:text-violet-400 transition-colors" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold truncate transition-all ${
            todo.completed ? 'line-through text-slate-400' : 'text-slate-800'
          }`}>
            {todo.title}
          </p>
          {todo.description && !expanded && (
            <p className="text-xs text-slate-400 truncate mt-0.5 font-medium">
              {todo.description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">

          {/* Expand (if has description) */}
          {todo.description && (
            <button
              onClick={() => onExpand(todo.id)}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-violet-100 text-slate-400 hover:text-violet-600 transition-all"
              aria-label="Toggle description"
            >
              {expanded
                ? <ChevronUp size={14} />
                : <ChevronDown size={14} />
              }
            </button>
          )}

          {/* Delete */}
          <button
            onClick={() => onDelete(todo.id)}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-500 transition-all"
            aria-label="Delete task"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* Status badge */}
        <span className={`hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0 ${
          todo.completed
            ? 'bg-emerald-100 text-emerald-600'
            : 'bg-violet-50 text-violet-500'
        }`}>
          {todo.completed ? '✓ Done' : '● Active'}
        </span>
      </div>

      {/* Expanded Description */}
      <AnimatePresence>
        {expanded && todo.description && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 flex items-start gap-2">
              <AlignLeft size={13} className="text-slate-300 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-slate-500 leading-relaxed">{todo.description}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TodoList;
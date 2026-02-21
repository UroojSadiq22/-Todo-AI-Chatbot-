
/** TodoForm component — beautifully styled to match the Focus Workspace dashboard */

import React, { useState, useRef } from 'react';
import { TodoCreate } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, AlignLeft, Type, Sparkles, CheckCircle2 } from 'lucide-react';

interface TodoFormProps {
  onSubmit: (todo: TodoCreate) => void;
  initialData?: TodoCreate;
  isEditing?: boolean;
  compact?: boolean; // for use inside dashboard cards
}

const TodoForm: React.FC<TodoFormProps> = ({
  onSubmit,
  initialData,
  isEditing = false,
  compact = false,
}) => {
  const [formData, setFormData] = useState<TodoCreate>({
    title:       initialData?.title       || '',
    description: initialData?.description || '',
  });
  const [focused,  setFocused]  = useState<string | null>(null);
  const [success,  setSuccess]  = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSubmit(formData);

    if (!isEditing) {
      setFormData({ title: '', description: '' });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        titleRef.current?.focus();
      }, 1500);
    }
  };

  const isValid = formData.title.trim().length > 0;

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full ${compact ? '' : 'bg-white rounded-3xl p-7 shadow-sm border border-slate-100'}`}
    >
      {/* Title */}
      {!compact && (
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center">
            {isEditing ? <Pencil size={16} className="text-violet-600" /> : <Plus size={18} className="text-violet-600" />}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">
              {isEditing ? 'Edit Task' : 'New Task'}
            </h3>
            <p className="text-xs text-slate-400">
              {isEditing ? 'Update your task details below' : 'Capture your next big thing'}
            </p>
          </div>
        </div>
      )}

      {/* Title Field */}
      <div className="mb-4 group">
        <label
          htmlFor="title"
          className={`flex items-center gap-1.5 text-xs font-bold mb-2 transition-colors ${
            focused === 'title' ? 'text-violet-600' : 'text-slate-400'
          }`}
        >
          <Type size={11} />
          TITLE <span className="text-rose-400">*</span>
        </label>
        <div className={`relative rounded-2xl transition-all duration-200 ${
          focused === 'title'
            ? 'ring-2 ring-violet-400 ring-offset-1'
            : 'ring-1 ring-slate-200 hover:ring-slate-300'
        }`}>
          <input
            ref={titleRef}
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            onFocus={() => setFocused('title')}
            onBlur={() => setFocused(null)}
            required
            autoComplete="off"
            placeholder="What needs to be done?"
            className="w-full bg-slate-50 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800
                       placeholder:text-slate-300 placeholder:font-normal
                       focus:outline-none focus:bg-white transition-colors"
          />
          {formData.title && (
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <div className="w-2 h-2 rounded-full bg-violet-400" />
            </motion.div>
          )}
        </div>
      </div>

      {/* Description Field */}
      <div className="mb-5 group">
        <label
          htmlFor="description"
          className={`flex items-center gap-1.5 text-xs font-bold mb-2 transition-colors ${
            focused === 'description' ? 'text-violet-600' : 'text-slate-400'
          }`}
        >
          <AlignLeft size={11} />
          DESCRIPTION <span className="text-slate-300 font-normal ml-1">optional</span>
        </label>
        <div className={`relative rounded-2xl transition-all duration-200 ${
          focused === 'description'
            ? 'ring-2 ring-violet-400 ring-offset-1'
            : 'ring-1 ring-slate-200 hover:ring-slate-300'
        }`}>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            onFocus={() => setFocused('description')}
            onBlur={() => setFocused(null)}
            rows={compact ? 2 : 3}
            placeholder="Add details, links, notes..."
            className="w-full bg-slate-50 rounded-2xl px-4 py-3 text-sm text-slate-700
                       placeholder:text-slate-300 resize-none
                       focus:outline-none focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Submit Button */}
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-2xl
                       bg-emerald-50 border border-emerald-200 text-emerald-600 font-bold text-sm"
          >
            <CheckCircle2 size={16} />
            Task added!
          </motion.div>
        ) : (
          <motion.button
            key="submit"
            type="submit"
            disabled={!isValid}
            whileHover={isValid ? { scale: 1.02 } : {}}
            whileTap={isValid  ? { scale: 0.98 } : {}}
            className={`w-full flex items-center justify-center gap-2 py-3 px-5 rounded-2xl
                        font-bold text-sm transition-all duration-200 ${
              isValid
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200 hover:shadow-violet-300 cursor-pointer'
                : 'bg-slate-100 text-slate-300 cursor-not-allowed'
            }`}
          >
            {isEditing ? (
              <><Pencil size={15} /> Update Task</>
            ) : (
              <><Sparkles size={15} /> {compact ? 'Add Task' : 'Add to Workspace'}</>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </motion.form>
  );
};

export default TodoForm;
"use client";

import React, { useState, useEffect } from "react";
import { Todo, TodoCreate } from "../../../types";
import TodoForm from "../../../components/TodoForm";
import TodoList from "../../../components/TodoList";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { todoAPI } from "../../../services/api";
import { motion } from "framer-motion";
import { Filter } from "lucide-react";

const TodosPage: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "done" | "pending">("all");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await todoAPI.getTodos();
      setTodos(response.data);
    } catch (err) {
      setError("Failed to load todos.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Filtered todos ── */
  const filtered = todos.filter((t) =>
    filter === "all" ? true : filter === "done" ? t.completed : !t.completed,
  );

  const handleCreate = async (d: TodoCreate) => {
    try {
      const r = await todoAPI.createTodo(d);
      setTodos((prev) => [...prev, r.data]);
    } catch {
      setError("Create failed.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await todoAPI.deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch {
      setError("Delete failed.");
    }
  };
  const handleToggle = async (id: string) => {
    try {
      const r = await todoAPI.toggleTodo(id);
      setTodos((prev) => prev.map((t) => (t.id === id ? r.data : t)));
    } catch {
      setError("Update failed.");
    }
  };

  const stats = {
    total: todos.length,
    completed: todos.filter((t) => t.completed).length,
    pending: todos.filter((t) => !t.completed).length,
  };

  // if (loading) return <LoadingSpinner />;

  return (
    <ProtectedRoute>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        className="space-y-6"
      >
        {/* Add Task + Filter row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TodoForm onSubmit={handleCreate} />
          </div>

          {/* Mini stats sidebar */}
          <div className="flex flex-col gap-4">
            {[
              {
                label: "Total",
                value: stats.total,
                color: "bg-violet-100 text-violet-600",
                icon: "📋",
              },
              {
                label: "Completed",
                value: stats.completed,
                color: "bg-emerald-100 text-emerald-600",
                icon: "✅",
              },
              {
                label: "Remaining",
                value: stats.pending,
                color: "bg-orange-100 text-orange-600",
                icon: "⏳",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4"
              >
                <div
                  className={`w-11 h-11 rounded-xl ${s.color} flex items-center justify-center text-xl`}
                >
                  {s.icon}
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-800">
                    {s.value}
                  </div>
                  <div className="text-xs text-slate-400 font-semibold">
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Task list */}
        <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black text-slate-800">
              Task Inventory
            </h2>
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-slate-400" />
              {(["all", "done", "pending"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    filter === f
                      ? "bg-violet-600 text-white shadow-md"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <TodoList
            todos={filtered}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        </div>
      </motion.div>
    </ProtectedRoute>
  );
};

export default TodosPage;

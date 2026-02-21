
"use client";
import DashboardNavbar from "@/components/DashboardNavbar";
import FloatingChatButton from "@/components/FloatingChatButton";
import { AuthProvider } from "@/context/AuthContext";
import { todoAPI } from "@/services/api";
import {
  Sparkles, Sun, Flame, Star, Calendar,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { Todo } from "@/types";
import { AnimatePresence } from "framer-motion";

/* ── Date helpers ── */
const toDateKey = (d: Date) => d.toISOString().slice(0, 10);
const lastNDays = (n: number) =>
  Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (n - 1 - i));
    return toDateKey(d);
  });
const getDateKey = (t: Todo) =>
  t.created_at ? toDateKey(new Date(t.created_at)) : toDateKey(new Date());

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [todos,    setTodos]    = useState<Todo[]>([]);
  const [greeting, setGreeting] = useState("");

  const fetchTodos = useCallback(async () => {
    try {
      const r = await todoAPI.getTodos();
      setTodos(r.data);
    } catch {}
  }, []);

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening");
    fetchTodos();
    const id = setInterval(() => fetchTodos(), 30_000);
    return () => clearInterval(id);
  }, [fetchTodos]);

  /* ── Real streak: consecutive days ending today with ≥1 completion ── */
  const days7    = lastNDays(7);
  const dailyDone = days7.map(
    (dk) => todos.filter((t) => t.completed && getDateKey(t) === dk).length,
  );
  let streak = 0;
  for (let i = dailyDone.length - 1; i >= 0; i--) {
    if (dailyDone[i] > 0) streak++;
    else break;
  }

  /* ── Stats ── */
  const completed = todos.filter((t) => t.completed).length;
  const stats = {
    streak,               // real streak from todos
    points: completed * 10, // 10 XP per completed task
  };

  const Pill = ({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) => (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 bg-${color}-50 border border-${color}-100 rounded-full text-xs font-bold text-${color}-600`}>
      {icon} {label}
    </div>
  );

  return (
    <AuthProvider>
      <div className="lg:flex">
        <DashboardNavbar />
        <main className="lg:flex-1 w-full px-5 sm:px-8 lg:px-12 py-8 pt-6 max-w-[1600px] mx-auto">
          {/* ─── Sidebar accent strip ─── */}
          <div className="fixed left-0 top-0 h-full w-1 bg-gradient-to-b from-violet-500 via-sky-400 to-emerald-400 z-50" />

          {/* ════ HEADER ════ */}
          <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-sky-500 flex items-center justify-center shadow-lg shadow-violet-200">
                <Sparkles size={22} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-400 flex items-center gap-1">
                  <Sun size={13} /> {greeting}, Champion 👋
                </p>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                  Focus Workspace
                </h1>
              </div>
            </div>

            {/* Streak + Points pills — real data */}
            <div className="flex items-center gap-3 flex-wrap">
              <Pill
                icon={<Flame size={14} className="text-orange-500" />}
                label={stats.streak > 0 ? `${stats.streak} Day Streak 🔥` : "No streak yet"}
                color="orange"
              />
              <Pill
                icon={<Star size={14} className="text-amber-500" />}
                label={`${stats.points} XP`}
                color="amber"
              />
              <Pill
                icon={<Calendar size={14} className="text-sky-500" />}
                label={new Date().toLocaleDateString("en-US", {
                  weekday: "short", month: "short", day: "numeric",
                })}
                color="sky"
              />
            </div>
          </header>

          <AnimatePresence mode="wait">{children}</AnimatePresence>
        </main>
        <FloatingChatButton />
      </div>
    </AuthProvider>
  );
}
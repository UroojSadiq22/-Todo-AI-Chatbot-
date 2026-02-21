"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Todo } from "../../../types";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { todoAPI } from "../../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, RefreshCw } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

/* ─── Colors ── */
const C = {
  violet: "#7C3AED",
  sky: "#0EA5E9",
  emerald: "#10B981",
  amber: "#F59E0B",
  rose: "#F43F5E",
};

/* ─── Date Helpers ── */
const toDateKey = (d: Date) => d.toISOString().slice(0, 10);
const toMonthKey = (dk: string) => dk.slice(0, 7);

const lastNDays = (n: number): string[] =>
  Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (n - 1 - i));
    return toDateKey(d);
  });

const dayLabel = (dk: string) =>
  new Date(dk + "T12:00:00").toLocaleDateString("en-US", { weekday: "short" });

const monthLabel = (ym: string) => {
  const [y, m] = ym.split("-");
  return new Date(Number(y), Number(m) - 1).toLocaleDateString("en-US", {
    month: "short",
  });
};

/* ─── Category keywords ── */
const CAT_KEYWORDS: Record<string, string[]> = {
  Work: [
    "work",
    "meeting",
    "project",
    "report",
    "email",
    "client",
    "deadline",
    "office",
    "presentation",
    "review",
  ],
  Health: [
    "gym",
    "workout",
    "run",
    "sleep",
    "eat",
    "diet",
    "exercise",
    "walk",
    "yoga",
    "health",
    "doctor",
    "medicine",
  ],
  Learning: [
    "read",
    "study",
    "learn",
    "course",
    "book",
    "practice",
    "research",
    "watch",
    "tutorial",
    "lecture",
    "assignment",
  ],
  Personal: [
    "home",
    "family",
    "friend",
    "clean",
    "shop",
    "buy",
    "call",
    "birthday",
    "plan",
    "travel",
    "cook",
    "groceries",
  ],
};

/* ─── Compute all analytics from real todos ── */
function computeAnalytics(todos: Todo[]) {
  const now = new Date();
  const days = lastNDays(7);

  const getDateKey = (t: Todo): string =>
    t.created_at ? toDateKey(new Date(t.created_at)) : toDateKey(now);

  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const pending = total - completed;

  /* Weekly line chart data (done + added per day) */
  const weeklyData = days.map((dk) => ({
    day: dayLabel(dk),
    done: todos.filter((t) => t.completed && getDateKey(t) === dk).length,
    added: todos.filter((t) => getDateKey(t) === dk).length,
  }));

  /* Streak per day (cumulative from start of week) */
  let runningStreak = 0;
  const weeklyWithStreak = weeklyData.map((d) => {
    if (d.done > 0) runningStreak++;
    else runningStreak = 0;
    return { ...d, streak: runningStreak };
  });

  /* Category breakdown */
  const catCount: Record<string, number> = {
    Work: 0,
    Health: 0,
    Learning: 0,
    Personal: 0,
    Other: 0,
  };
  todos.forEach((t) => {
    const title = t.title.toLowerCase();
    const match = Object.entries(CAT_KEYWORDS).find(([, kws]) =>
      kws.some((k) => title.includes(k)),
    );
    catCount[match ? match[0] : "Other"]++;
  });
  const catColors = [C.violet, C.sky, C.emerald, C.amber, C.rose];
  const categoryData = Object.entries(catCount)
    .filter(([, v]) => v > 0)
    .map(([name, count], i) => ({
      name,
      count,
      value: total > 0 ? Math.round((count / total) * 100) : 0,
      color: catColors[i % catColors.length],
    }));

  /* KPIs */
  const dailyDone = days.map(
    (dk) => todos.filter((t) => t.completed && getDateKey(t) === dk).length,
  );
  const avgPerDay = (dailyDone.reduce((a, b) => a + b, 0) / 7).toFixed(1);
  const maxDone = Math.max(...dailyDone, 0);
  const bestDayIdx = dailyDone.lastIndexOf(maxDone);
  const bestDay = dayLabel(days[bestDayIdx] ?? days[6]);

  /* Streak */
  let streak = 0;
  for (let i = dailyDone.length - 1; i >= 0; i--) {
    if (dailyDone[i] > 0) streak++;
    else break;
  }

  /* Monthly trend */
  const months = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (4 - i), 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
  const monthlyTrend = months.map((ym) => {
    const mt = todos.filter((t) => toMonthKey(getDateKey(t)) === ym);
    const mc = mt.filter((t) => t.completed).length;
    return {
      month: monthLabel(ym),
      rate: mt.length > 0 ? Math.round((mc / mt.length) * 100) : 0,
    };
  });

  /* Heatmap */
  const heatmap = days.map((dk) => ({
    day: dayLabel(dk),
    done: todos.filter((t) => t.completed && getDateKey(t) === dk).length,
  }));

  /* Month diff */
  const lastRate = monthlyTrend[monthlyTrend.length - 1]?.rate ?? 0;
  const prevRate = monthlyTrend[monthlyTrend.length - 2]?.rate ?? 0;
  const monthDiff = lastRate - prevRate;

  return {
    total,
    completed,
    pending,
    avgPerDay,
    bestDay,
    maxDone,
    streak,
    monthDiff,
    weeklyData: weeklyWithStreak,
    categoryData,
    heatmap,
    monthlyTrend,
  };
}

/* ─── Custom Tooltip ── */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-100 shadow-xl rounded-2xl px-4 py-3 text-sm">
      <p className="font-bold text-slate-700 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p
          key={i}
          style={{ color: p.color ?? C.violet }}
          className="font-semibold"
        >
          {p.name}: <span className="text-slate-800">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════ */
const AnalyticsPage: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date>(new Date());
  const [syncing, setSyncing] = useState(false);

  const fetchTodos = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      else setSyncing(true);
      const r = await todoAPI.getTodos();
      setTodos(r.data);
      setLastSync(new Date());
    } catch {
      setError("Failed to load tasks.");
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
    const id = setInterval(() => fetchTodos(true), 30_000);
    return () => clearInterval(id);
  }, [fetchTodos]);

  const A = computeAnalytics(todos);

  return (
    <ProtectedRoute>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className="space-y-6"
      >
        {/* ── Error ── */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-600 px-5 py-3 rounded-2xl text-sm font-medium"
            >
              ⚠️ {error}
              <button
                onClick={() => setError(null)}
                className="ml-auto text-rose-400 hover:text-rose-600"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Sync bar ── */}
        <div className="flex items-center justify-end gap-2 text-xs text-slate-400 font-medium">
          <RefreshCw size={11} className={syncing ? "animate-spin" : ""} />
          Live · synced{" "}
          {lastSync.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
          <button
            onClick={() => fetchTodos(true)}
            disabled={syncing}
            className="ml-1 px-2.5 py-1 bg-slate-100 hover:bg-violet-100 hover:text-violet-600 rounded-full transition-colors font-bold disabled:opacity-50"
          >
            {syncing ? "Syncing…" : "Refresh"}
          </button>
        </div>

        {/* ── KPI Cards ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {[
            {
              label: "Avg / Day",
              value: A.avgPerDay,
              unit: "tasks this week",
              icon: "📈",
              up: true,
            },
            {
              label: "Best Day",
              value: A.bestDay,
              unit: `${A.maxDone} tasks`,
              icon: "🏆",
              up: true,
            },
            {
              label: "Current Streak",
              value: `${A.streak}d`,
              unit: "consecutive days",
              icon: "🔥",
              up: true,
            },
            {
              label: "Completion Rate",
              value: `${A.total > 0 ? Math.round((A.completed / A.total) * 100) : 0}%`,
              unit: `${A.completed} of ${A.total}`,
              icon: "✅",
              up: A.completed >= A.pending,
            },
          ].map((k, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.4, ease: "easeOut" },
                },
              }}
              whileHover={{ y: -3 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
            >
              <div className="text-3xl mb-2">{k.icon}</div>
              <div className="text-3xl font-black text-slate-800">
                {k.value}
              </div>
              <div className="text-xs font-semibold text-slate-400 mt-0.5">
                {k.label}
              </div>
              <div
                className={`text-xs font-bold mt-2 flex items-center gap-1 ${k.up ? "text-emerald-500" : "text-rose-500"}`}
              >
                {k.up ? (
                  <ArrowUpRight size={12} />
                ) : (
                  <ArrowDownRight size={12} />
                )}{" "}
                {k.unit}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Multi-line Daily Performance ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white rounded-3xl p-7 shadow-sm border border-slate-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Daily Performance
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Tasks done, added & streak · last 7 days
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-500 inline-block" />
                Done
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" />
                Added
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                Streak
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={A.weeklyData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                dy={8}
              />
              <YAxis hide allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="done"
                name="Done"
                stroke={C.violet}
                strokeWidth={3}
                dot={{ fill: C.violet, r: 5, strokeWidth: 0 }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="added"
                name="Added"
                stroke={C.sky}
                strokeWidth={3}
                dot={{ fill: C.sky, r: 5, strokeWidth: 0 }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="streak"
                name="Streak"
                stroke={C.amber}
                strokeWidth={3}
                dot={{ fill: C.amber, r: 5, strokeWidth: 0 }}
                activeDot={{ r: 7 }}
                strokeDasharray="6 3"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* ── Pie + Horizontal Bar ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Focus Distribution Pie */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -24 },
              visible: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.5, ease: "easeOut" },
              },
            }}
            className="bg-white rounded-3xl p-7 shadow-sm border border-slate-100"
          >
            <h3 className="text-base font-bold text-slate-800 mb-1">
              Focus Distribution
            </h3>
            <p className="text-xs text-slate-400 font-medium mb-6">
              Category share · auto-detected from titles
            </p>
            {A.categoryData.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-10">
                Add tasks to see distribution
              </p>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <ResponsiveContainer width={170} height={170}>
                  <PieChart>
                    <Pie
                      data={A.categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      strokeWidth={0}
                      paddingAngle={3}
                    >
                      {A.categoryData.map((c, i) => (
                        <Cell key={i} fill={c.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-3 flex-1">
                  {A.categoryData.map((c, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ background: c.color }}
                      />
                      <span className="text-sm text-slate-600 font-medium flex-1">
                        {c.name}
                      </span>
                      <span className="text-xs text-slate-400">{c.count}</span>
                      <span className="text-sm font-black text-slate-800">
                        {c.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Tasks by Category Horizontal Bar */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: 24 },
              visible: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.5, ease: "easeOut" },
              },
            }}
            className="bg-white rounded-3xl p-7 shadow-sm border border-slate-100"
          >
            <h3 className="text-base font-bold text-slate-800 mb-1">
              Tasks by Category
            </h3>
            <p className="text-xs text-slate-400 font-medium mb-6">
              Absolute task count per area
            </p>
            {A.categoryData.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-10">
                No data yet
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={170}>
                <BarChart data={A.categoryData} layout="vertical" barSize={14}>
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    width={68}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Tasks" radius={[0, 8, 8, 0]}>
                    {A.categoryData.map((c, i) => (
                      <Cell key={i} fill={c.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        </motion.div>

        {/* ── Heatmap ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white rounded-3xl p-7 shadow-sm border border-slate-100"
        >
          <h3 className="text-base font-bold text-slate-800 mb-1">
            Weekly Heatmap
          </h3>
          <p className="text-xs text-slate-400 font-medium mb-6">
            Completion intensity per day · this week
          </p>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            className="flex gap-3 flex-wrap"
          >
            {A.heatmap.map((d, i) => {
              const max = Math.max(...A.heatmap.map((h) => h.done), 1);
              const intensity = d.done / max;
              const bg =
                intensity >= 0.75
                  ? "bg-violet-600 text-white shadow-md shadow-violet-200"
                  : intensity >= 0.5
                    ? "bg-violet-300 text-violet-900"
                    : intensity >= 0.1
                      ? "bg-violet-100 text-violet-700"
                      : "bg-slate-100 text-slate-400";
              return (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, scale: 0.85 },
                    visible: {
                      opacity: 1,
                      scale: 1,
                      transition: { duration: 0.35, ease: "easeOut" },
                    },
                  }}
                  whileHover={{ scale: 1.05 }}
                  className={`flex-1 min-w-[70px] rounded-2xl p-4 text-center transition-all ${bg}`}
                >
                  <div className="text-xs font-bold mb-1">{d.day}</div>
                  <div className="text-2xl font-black">{d.done}</div>
                  <div className="text-xs font-medium opacity-70">tasks</div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </motion.div>
    </ProtectedRoute>
  );
};

export default AnalyticsPage;

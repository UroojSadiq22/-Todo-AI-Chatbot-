
// "use client";

// import React, { useState, useEffect } from "react";
// import { Todo, TodoCreate } from "../../../types";
// import TodoForm from "../../../components/TodoForm";
// import TodoList from "../../../components/TodoList";
// import ProtectedRoute from "../../../components/ProtectedRoute";
// import { todoAPI } from "../../../services/api";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   LayoutDashboard,
//   ListChecks,
//   CheckCircle,
//   Clock,
//   Plus,
//   TrendingUp,
//   Target,
//   Star,
//   Flame,
//   Zap,
//   ChevronRight,
//   Activity,
//   Award,
//   BarChart2,
//   Coffee,
//   ArrowUpRight,
//   ArrowDownRight,
//   Sparkles,
//   Filter,
//   Sun,
//   Calendar,
//   Circle,
// } from "lucide-react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   AreaChart,
//   Area,
//   RadialBarChart,
//   RadialBar,
//   PieChart,
//   Pie,
//   Cell,
//   LineChart,
//   Line,
//   Legend,
// } from "recharts";

// /* ─── Color Palette ────────────────────────────────────────────── */
// const C = {
//   amber: "#F59E0B",
//   rose: "#F43F5E",
//   violet: "#7C3AED",
//   sky: "#0EA5E9",
//   emerald: "#10B981",
//   slate: "#0F172A",
// };

// /* ─── Mock chart data ──────────────────────────────────────────── */
// const weeklyData = [
//   { day: "Mon", done: 4, added: 6, streak: 2 },
//   { day: "Tue", done: 7, added: 5, streak: 3 },
//   { day: "Wed", done: 3, added: 8, streak: 1 },
//   { day: "Thu", done: 9, added: 4, streak: 4 },
//   { day: "Fri", done: 6, added: 7, streak: 3 },
//   { day: "Sat", done: 11, added: 3, streak: 5 },
//   { day: "Sun", done: 8, added: 5, streak: 4 },
// ];

// const categoryData = [
//   { name: "Work", value: 38, color: C.violet },
//   { name: "Personal", value: 27, color: C.sky },
//   { name: "Health", value: 18, color: C.emerald },
//   { name: "Learning", value: 17, color: C.amber },
// ];

// const monthlyTrend = [
//   { month: "Oct", rate: 62 },
//   { month: "Nov", rate: 71 },
//   { month: "Dec", rate: 58 },
//   { month: "Jan", rate: 79 },
//   { month: "Feb", rate: 85 },
// ];

// /* ─── Custom Tooltip ───────────────────────────────────────────── */
// const CustomTooltip = ({ active, payload, label }: any) => {
//   if (!active || !payload?.length) return null;
//   return (
//     <div className="bg-white border border-slate-100 shadow-xl rounded-2xl px-4 py-3 text-sm">
//       <p className="font-bold text-slate-700 mb-1">{label}</p>
//       {payload.map((p: any, i: number) => (
//         <p key={i} style={{ color: p.color }} className="font-semibold">
//           {p.name}: <span className="text-slate-800">{p.value}</span>
//         </p>
//       ))}
//     </div>
//   );
// };

// /* ═══════════════════════════════════════════════════════════════ */
// const DashboardPage: React.FC = () => {
//   const [todos, setTodos] = useState<Todo[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [activeTab, setActiveTab] = useState<
//     "overview" | "tasks" | "analytics"
//   >("overview");
//   const [filter, setFilter] = useState<"all" | "done" | "pending">("all");
//   const [greeting, setGreeting] = useState("");

//   useEffect(() => {
//     const h = new Date().getHours();
//     setGreeting(
//       h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening",
//     );
//     fetchTodos();
//   }, []);

//   const fetchTodos = async () => {
//     try {
//       setLoading(true);
//       const r = await todoAPI.getTodos();
//       setTodos(r.data);
//     } catch {
//       setError("Failed to load tasks.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ── Stats ── */
//   const stats = {
//     total: todos.length,
//     completed: todos.filter((t) => t.completed).length,
//     pending: todos.filter((t) => !t.completed).length,
//     rate:
//       todos.length > 0
//         ? Math.round(
//             (todos.filter((t) => t.completed).length / todos.length) * 100,
//           )
//         : 0,
//     streak: 5, // mock
//     points: 1240, // mock
//   };

//   /* ── Handlers ── */
//   const handleCreate = async (d: TodoCreate) => {
//     try {
//       const r = await todoAPI.createTodo(d);
//       setTodos((prev) => [...prev, r.data]);
//       setActiveTab("tasks");
//     } catch {
//       setError("Create failed.");
//     }
//   };

//   // if (loading) return <LoadingScreen />;

//   /* ── radial chart value ── */
//   const radialData = [{ name: "Rate", value: stats.rate, fill: C.violet }];

//   return (
//     <ProtectedRoute>
//       <div className="">
//         {/* ════ HEADER ════ */}

//         {/* ════ ERROR ════ */}
//         <AnimatePresence>
//           {error && (
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0 }}
//               className="mb-4 flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-600 px-5 py-3 rounded-2xl text-sm font-medium"
//             >
//               ⚠️ {error}
//               <button
//                 onClick={() => setError(null)}
//                 className="ml-auto text-rose-400 hover:text-rose-600"
//               >
//                 ✕
//               </button>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* ════ CONTENT ════ */}

//         {/* ─── OVERVIEW TAB ─── */}
//         <motion.div
//           key="ov"
//           initial={{ opacity: 0, y: 16 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -8 }}
//           className="space-y-7"
//         >
//           {/* Stat Cards */}
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
//             <StatCard
//               title="Total Tasks"
//               value={stats.total}
//               sub="+3 this week"
//               positive
//               icon={<LayoutDashboard />}
//               grad="from-violet-500 to-indigo-600"
//             />
//             <StatCard
//               title="Completed"
//               value={stats.completed}
//               sub="+2 today"
//               positive
//               icon={<CheckCircle />}
//               grad="from-emerald-400 to-teal-500"
//             />
//             <StatCard
//               title="In Progress"
//               value={stats.pending}
//               sub="-1 from yest."
//               positive
//               icon={<Clock />}
//               grad="from-orange-400 to-amber-500"
//             />
//             <StatCard
//               title="Success Rate"
//               value={`${stats.rate}%`}
//               sub="+5% vs last week"
//               positive
//               icon={<Target />}
//               grad="from-sky-400 to-blue-600"
//             />
//           </div>

//           {/* Charts Row */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Weekly Activity */}
//             <div className="lg:col-span-2 bg-white rounded-3xl p-7 shadow-sm border border-slate-100">
//               <div className="flex items-center justify-between mb-6">
//                 <div>
//                   <h3 className="text-base font-bold text-slate-800">
//                     Weekly Activity
//                   </h3>
//                   <p className="text-xs text-slate-400 font-medium">
//                     Tasks completed vs added
//                   </p>
//                 </div>
//                 <span className="px-3 py-1 bg-violet-50 text-violet-600 rounded-full text-xs font-bold">
//                   This Week
//                 </span>
//               </div>
//               <ResponsiveContainer width="100%" height={240}>
//                 <BarChart data={weeklyData} barGap={4} barSize={18}>
//                   <CartesianGrid
//                     strokeDasharray="3 3"
//                     vertical={false}
//                     stroke="#f1f5f9"
//                   />
//                   <XAxis
//                     dataKey="day"
//                     axisLine={false}
//                     tickLine={false}
//                     tick={{ fill: "#94a3b8", fontSize: 12 }}
//                     dy={8}
//                   />
//                   <YAxis hide />
//                   <Tooltip content={<CustomTooltip />} />
//                   <Bar
//                     dataKey="done"
//                     name="Completed"
//                     fill={C.violet}
//                     radius={[8, 8, 0, 0]}
//                   />
//                   <Bar
//                     dataKey="added"
//                     name="Added"
//                     fill="#E0E7FF"
//                     radius={[8, 8, 0, 0]}
//                   />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>

//             {/* Completion Rate Radial */}
//             <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-100 flex flex-col">
//               <div className="mb-4">
//                 <h3 className="text-base font-bold text-slate-800">
//                   Completion Rate
//                 </h3>
//                 <p className="text-xs text-slate-400 font-medium">
//                   Overall performance
//                 </p>
//               </div>
//               <div className="flex-1 flex flex-col items-center justify-center">
//                 <div className="relative">
//                   <ResponsiveContainer width={180} height={180}>
//                     <RadialBarChart
//                       cx="50%"
//                       cy="50%"
//                       innerRadius="65%"
//                       outerRadius="90%"
//                       startAngle={225}
//                       endAngle={-45}
//                       data={radialData}
//                     >
//                       <RadialBar
//                         background={{ fill: "#F1F5F9" }}
//                         dataKey="value"
//                         cornerRadius={10}
//                       />
//                     </RadialBarChart>
//                   </ResponsiveContainer>
//                   <div className="absolute inset-0 flex flex-col items-center justify-center">
//                     <span className="text-4xl font-black text-slate-800">
//                       {stats.rate}%
//                     </span>
//                     <span className="text-xs font-semibold text-slate-400">
//                       Completion
//                     </span>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-3 w-full mt-4">
//                   <MiniStat
//                     label="Done"
//                     value={stats.completed}
//                     color="text-emerald-500"
//                   />
//                   <MiniStat
//                     label="Pending"
//                     value={stats.pending}
//                     color="text-orange-500"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Category Pie + Monthly Trend */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* Category Breakdown */}
//             <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-100">
//               <div className="flex items-center justify-between mb-6">
//                 <div>
//                   <h3 className="text-base font-bold text-slate-800">
//                     Category Breakdown
//                   </h3>
//                   <p className="text-xs text-slate-400 font-medium">
//                     Where your focus goes
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-6">
//                 <ResponsiveContainer width={160} height={160}>
//                   <PieChart>
//                     <Pie
//                       data={categoryData}
//                       cx="50%"
//                       cy="50%"
//                       innerRadius={45}
//                       outerRadius={72}
//                       dataKey="value"
//                       paddingAngle={3}
//                       strokeWidth={0}
//                     >
//                       {categoryData.map((c, i) => (
//                         <Cell key={i} fill={c.color} />
//                       ))}
//                     </Pie>
//                   </PieChart>
//                 </ResponsiveContainer>
//                 <div className="flex flex-col gap-3 flex-1">
//                   {categoryData.map((c, i) => (
//                     <div key={i} className="flex items-center gap-3">
//                       <div
//                         className="w-2.5 h-2.5 rounded-full flex-shrink-0"
//                         style={{ background: c.color }}
//                       />
//                       <span className="text-sm text-slate-600 font-medium flex-1">
//                         {c.name}
//                       </span>
//                       <span className="text-sm font-bold text-slate-800">
//                         {c.value}%
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Monthly Trend */}
//             <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-100">
//               <div className="flex items-center justify-between mb-6">
//                 <div>
//                   <h3 className="text-base font-bold text-slate-800">
//                     Monthly Trend
//                   </h3>
//                   <p className="text-xs text-slate-400 font-medium">
//                     Success rate over months
//                   </p>
//                 </div>
//                 <span className="text-emerald-500 text-xs font-bold flex items-center gap-1">
//                   <ArrowUpRight size={14} /> +6% vs Oct
//                 </span>
//               </div>
//               <ResponsiveContainer width="100%" height={190}>
//                 <AreaChart data={monthlyTrend}>
//                   <defs>
//                     <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor={C.sky} stopOpacity={0.15} />
//                       <stop offset="95%" stopColor={C.sky} stopOpacity={0} />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid
//                     strokeDasharray="3 3"
//                     vertical={false}
//                     stroke="#f1f5f9"
//                   />
//                   <XAxis
//                     dataKey="month"
//                     axisLine={false}
//                     tickLine={false}
//                     tick={{ fill: "#94a3b8", fontSize: 12 }}
//                     dy={8}
//                   />
//                   <YAxis hide domain={[40, 100]} />
//                   <Tooltip content={<CustomTooltip />} />
//                   <Area
//                     type="monotone"
//                     dataKey="rate"
//                     name="Success Rate"
//                     stroke={C.sky}
//                     strokeWidth={3}
//                     fillOpacity={1}
//                     fill="url(#skyGrad)"
//                     dot={{ fill: C.sky, r: 4, strokeWidth: 0 }}
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Quick Add + Motivational banner */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Quick Add */}
//             <div className="lg:col-span-2 ">
//               {/* <div className="flex items-center gap-3 mb-5">
//                 <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center">
//                   <Plus size={18} className="text-violet-600" />
//                 </div>
//                 <div>
//                   <h3 className="text-base font-bold text-slate-800">
//                     Quick Add Task
//                   </h3>
//                   <p className="text-xs text-slate-400">
//                     Jump right in — add your next task
//                   </p>
//                 </div>
//               </div> */}
//               <TodoForm onSubmit={handleCreate} />
//             </div>

//             {/* XP / Achievement card */}
//             <div className="bg-gradient-to-br from-violet-600 via-indigo-600 to-sky-500 rounded-3xl p-7 text-white shadow-xl shadow-violet-200 flex flex-col justify-between">
//               <div>
//                 <div className="flex items-center gap-2 mb-4">
//                   <Award size={20} className="text-yellow-300" />
//                   <span className="text-sm font-bold text-violet-100">
//                     Your Progress
//                   </span>
//                 </div>
//                 <div className="text-5xl font-black mb-1">{stats.points}</div>
//                 <div className="text-violet-200 text-sm font-medium mb-5">
//                   Experience Points
//                 </div>

//                 {/* XP bar */}
//                 <div className="mb-6">
//                   <div className="flex justify-between text-xs text-violet-200 font-semibold mb-2">
//                     <span>Level 8</span>
//                     <span>1240 / 1500 XP</span>
//                   </div>
//                   <div className="h-2 bg-white/20 rounded-full overflow-hidden">
//                     <motion.div
//                       className="h-full bg-gradient-to-r from-yellow-300 to-amber-400 rounded-full"
//                       initial={{ width: 0 }}
//                       animate={{ width: "82%" }}
//                       transition={{
//                         duration: 1.2,
//                         delay: 0.5,
//                         ease: "easeOut",
//                       }}
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-3 gap-2">
//                   {[
//                     { icon: "🔥", v: stats.streak + "d" },
//                     { icon: "✅", v: stats.completed },
//                     { icon: "⚡", v: "Top 12%" },
//                   ].map((b, i) => (
//                     <div
//                       key={i}
//                       className="bg-white/10 rounded-2xl p-3 text-center backdrop-blur-md"
//                     >
//                       <div className="text-xl mb-1">{b.icon}</div>
//                       <div className="text-xs font-bold text-white">{b.v}</div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </ProtectedRoute>
//   );
// };

// /* ══════════════════ REUSABLE COMPONENTS ══════════════════════════ */

// const StatCard = ({ title, value, sub, positive, icon, grad }: any) => (
//   <motion.div
//     whileHover={{ y: -3 }}
//     className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 overflow-hidden relative group"
//   >
//     <div
//       className={`absolute -right-4 -top-4 w-20 h-20 rounded-full bg-gradient-to-br ${grad} opacity-10 group-hover:opacity-20 transition-opacity`}
//     />
//     <div
//       className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center text-white mb-4 shadow-lg`}
//     >
//       {React.cloneElement(icon, { size: 18 })}
//     </div>
//     <div className="text-3xl font-black text-slate-800 leading-none mb-1">
//       {value}
//     </div>
//     <div className="text-xs text-slate-400 font-semibold mb-3">{title}</div>
//     <div
//       className={`text-xs font-bold flex items-center gap-1 ${positive ? "text-emerald-500" : "text-rose-500"}`}
//     >
//       {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
//       {sub}
//     </div>
//   </motion.div>
// );

// const MiniStat = ({ label, value, color }: any) => (
//   <div className="bg-slate-50 rounded-2xl p-3 text-center">
//     <div className={`text-xl font-black ${color}`}>{value}</div>
//     <div className="text-xs text-slate-400 font-semibold">{label}</div>
//   </div>
// );

// export default DashboardPage;
































"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Todo, TodoCreate } from "../../../types";
import TodoForm from "../../../components/TodoForm";
import TodoList from "../../../components/TodoList";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { todoAPI } from "../../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, ListChecks, CheckCircle, Clock,
  Plus, Target, Award, ArrowUpRight, ArrowDownRight,
  RefreshCw,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, RadialBarChart,
  RadialBar, PieChart, Pie, Cell,
} from "recharts";

/* ─── Colors ── */
const C = {
  violet:  "#7C3AED",
  sky:     "#0EA5E9",
  emerald: "#10B981",
  amber:   "#F59E0B",
  rose:    "#F43F5E",
  indigo:  "#E0E7FF",
};

/* ─── Date Helpers ── */
const toDateKey  = (d: Date)   => d.toISOString().slice(0, 10);
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
  return new Date(Number(y), Number(m) - 1).toLocaleDateString("en-US", { month: "short" });
};

/* ─── Keyword maps for auto-category ── */
const CAT_KEYWORDS: Record<string, string[]> = {
  Work:     ["work","meeting","project","report","email","client","deadline","office","task","presentation","review"],
  Health:   ["gym","workout","run","sleep","eat","diet","exercise","walk","yoga","health","doctor","medicine"],
  Learning: ["read","study","learn","course","book","practice","research","watch","tutorial","lecture","assignment"],
  Personal: ["home","family","friend","clean","shop","buy","call","birthday","plan","travel","cook","groceries"],
};

/* ─── All analytics computed from real todos ── */
function computeAnalytics(todos: Todo[]) {
  const now  = new Date();
  const days = lastNDays(7);

  /* Helper: get date string from a todo */
  const getDateKey = (t: Todo): string => {
    const raw = (t as any).created_at ?? (t as any).createdAt ?? null;
    return raw ? toDateKey(new Date(raw)) : toDateKey(now);
  };

  /* ── Counts ── */
  const total     = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const pending   = total - completed;
  const rate      = total > 0 ? Math.round((completed / total) * 100) : 0;

  /* ── Weekly bar chart ── */
  const weeklyData = days.map(dk => ({
    day:   dayLabel(dk),
    added: todos.filter(t => getDateKey(t) === dk).length,
    done:  todos.filter(t => t.completed && getDateKey(t) === dk).length,
  }));

  /* ── Monthly trend (last 5 months) ── */
  const months = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (4 - i), 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
  const monthlyTrend = months.map(ym => {
    const mt = todos.filter(t => toMonthKey(getDateKey(t)) === ym);
    const mc = mt.filter(t => t.completed).length;
    return { month: monthLabel(ym), rate: mt.length > 0 ? Math.round((mc / mt.length) * 100) : 0 };
  });

  /* ── Heatmap ── */
  // const heatmap = days.map(dk => ({
  //   day:  dayLabel(dk),
  //   done: todos.filter(t => t.completed && getDateKey(t) === dk).length,
  // }));

  /* ── Category (auto-detected from title keywords) ── */
  const catCount: Record<string, number> = { Work: 0, Health: 0, Learning: 0, Personal: 0, Other: 0 };
  todos.forEach(t => {
    const title = t.title.toLowerCase();
    const match = Object.entries(CAT_KEYWORDS).find(([, kws]) => kws.some(k => title.includes(k)));
    catCount[match ? match[0] : "Other"]++;
  });
  const catColors = [C.violet, C.sky, C.emerald, C.amber, C.rose];
  const categoryData = Object.entries(catCount)
    .filter(([, v]) => v > 0)
    .map(([name, count], i) => ({
      name, count,
      value: total > 0 ? Math.round((count / total) * 100) : 0,
      color: catColors[i % catColors.length],
    }));

  /* ── KPIs ── */
  const dailyDone = days.map(dk => todos.filter(t => t.completed && getDateKey(t) === dk).length);
  const avgPerDay = (dailyDone.reduce((a, b) => a + b, 0) / 7).toFixed(1);
  const maxDone   = Math.max(...dailyDone, 0);
  const bestDayIdx = dailyDone.lastIndexOf(maxDone);
  const bestDay   = dayLabel(days[bestDayIdx] ?? days[6]);

  /* ── Streak (consecutive days ending today with ≥1 completion) ── */
  let streak = 0;
  for (let i = dailyDone.length - 1; i >= 0; i--) {
    if (dailyDone[i] > 0) streak++;
    else break;
  }

  /* ── Month-over-month diff ── */
  const lastMonthRate = monthlyTrend[monthlyTrend.length - 1]?.rate ?? 0;
  const prevMonthRate = monthlyTrend[monthlyTrend.length - 2]?.rate ?? 0;
  const monthDiff     = lastMonthRate - prevMonthRate;

  return {
    total, completed, pending, rate,
    weeklyData, monthlyTrend, categoryData,
    avgPerDay, bestDay, maxDone, streak, monthDiff,
  };
}

/* ─── Custom Tooltip ── */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-100 shadow-xl rounded-2xl px-4 py-3 text-sm">
      <p className="font-bold text-slate-700 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color ?? C.violet }} className="font-semibold">
          {p.name}: <span className="text-slate-800">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════ */
const DashboardPage: React.FC = () => {
  const [todos,    setTodos]    = useState<Todo[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date>(new Date());
  const [syncing,  setSyncing]  = useState(false);

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

  /* Auto-refresh every 30s */
  useEffect(() => {
    fetchTodos();
    const id = setInterval(() => fetchTodos(true), 30_000);
    return () => clearInterval(id);
  }, [fetchTodos]);

  const A           = computeAnalytics(todos);
  const radialData  = [{ name: "Rate", value: A.rate, fill: C.violet }];

  /* ── Handlers ── */
  const handleCreate = async (d: TodoCreate) => {
    try {
      const r = await todoAPI.createTodo(d);
      setTodos(prev => [...prev, r.data]);
    } catch { setError("Create failed."); }
  };
  const handleDelete = async (id: string) => {
    try {
      await todoAPI.deleteTodo(id);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch { setError("Delete failed."); }
  };
  const handleToggle = async (id: string) => {
    try {
      const r = await todoAPI.toggleTodo(id);
      setTodos(prev => prev.map(t => t.id === id ? r.data : t));
    } catch { setError("Update failed."); }
  };

 

  return (
    <ProtectedRoute>
             <motion.div
           
           initial={{ opacity: 0, y: 16 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -8 }}
           className="space-y-7"
         >

        {/* ── Error banner ── */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-600 px-5 py-3 rounded-2xl text-sm font-medium">
              ⚠️ {error}
              <button onClick={() => setError(null)} className="ml-auto text-rose-400 hover:text-rose-600">✕</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Sync bar ── */}
        <div className="flex items-center justify-end gap-2 text-xs text-slate-400 font-medium -mb-3">
          <RefreshCw size={11} className={syncing ? "animate-spin" : ""} />
          Live · synced {lastSync.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          <button onClick={() => fetchTodos(true)} disabled={syncing}
            className="ml-1 px-2.5 py-1 bg-slate-100 hover:bg-violet-100 hover:text-violet-600 rounded-full transition-colors font-bold disabled:opacity-50">
            {syncing ? "Syncing…" : "Refresh"}
          </button>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard title="Total Tasks"  value={A.total}      sub={`${A.pending} remaining`}                positive                icon={<LayoutDashboard/>} grad="from-violet-500 to-indigo-600" />
          <StatCard title="Completed"    value={A.completed}  sub={`${A.rate}% success rate`}               positive                icon={<CheckCircle/>}     grad="from-emerald-400 to-teal-500"  />
          <StatCard title="In Progress"  value={A.pending}    sub={A.pending === 0 ? "All done! 🎉" : `${A.avgPerDay} avg/day`} positive={A.pending === 0} icon={<Clock/>} grad="from-orange-400 to-amber-500" />
          <StatCard title="Success Rate" value={`${A.rate}%`} sub={A.rate >= 70 ? "Great work! 🔥" : "Keep pushing!"} positive={A.rate >= 50}  icon={<Target/>}          grad="from-sky-400 to-blue-600"      />
        </div>

        {/* ── Row 1: Weekly bar + Radial ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 bg-white rounded-3xl p-7 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-800">Weekly Activity</h3>
                <p className="text-xs text-slate-400 font-medium">Tasks added vs completed · last 7 days</p>
              </div>
              <span className="px-3 py-1 bg-violet-50 text-violet-600 rounded-full text-xs font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse inline-block"/> Live
              </span>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={A.weeklyData} barGap={4} barSize={18}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} dy={8}/>
                <YAxis hide allowDecimals={false}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Bar dataKey="done"  name="Completed" fill={C.violet} radius={[8,8,0,0]}/>
                <Bar dataKey="added" name="Added"     fill={C.indigo} radius={[8,8,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-100 flex flex-col">
            <div className="mb-4">
              <h3 className="text-base font-bold text-slate-800">Completion Rate</h3>
              <p className="text-xs text-slate-400 font-medium">Based on all your tasks</p>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative">
                <ResponsiveContainer width={180} height={180}>
                  <RadialBarChart cx="50%" cy="50%" innerRadius="65%" outerRadius="90%"
                    startAngle={225} endAngle={-45} data={radialData}>
                    <RadialBar background={{ fill: "#F1F5F9" }} dataKey="value" cornerRadius={10}/>
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-slate-800">{A.rate}%</span>
                  <span className="text-xs font-semibold text-slate-400">Done</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 w-full mt-4">
                <MiniStat label="Completed" value={A.completed} color="text-emerald-500"/>
                <MiniStat label="Pending"   value={A.pending}   color="text-orange-500"/>
              </div>
            </div>
          </div>
        </div>

        {/* ── Row 2: Category + Monthly trend ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-100">
            <div className="mb-6">
              <h3 className="text-base font-bold text-slate-800">Category Breakdown</h3>
              <p className="text-xs text-slate-400 font-medium">Auto-detected from your task titles</p>
            </div>
            {A.categoryData.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">Add some tasks to see breakdown</p>
            ) : (
              <div className="flex items-center gap-6">
                <ResponsiveContainer width={160} height={160}>
                  <PieChart>
                    <Pie data={A.categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={72}
                      dataKey="value" paddingAngle={3} strokeWidth={0}>
                      {A.categoryData.map((c, i) => <Cell key={i} fill={c.color}/>)}
                    </Pie>
                    <Tooltip content={<CustomTooltip/>}/>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-3 flex-1">
                  {A.categoryData.map((c, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c.color }}/>
                      <span className="text-sm text-slate-600 font-medium flex-1">{c.name}</span>
                      <span className="text-xs text-slate-400">{c.count}</span>
                      <span className="text-sm font-bold text-slate-800">{c.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-800">Monthly Trend</h3>
                <p className="text-xs text-slate-400 font-medium">Completion rate · last 5 months</p>
              </div>
              <span className={`text-xs font-bold flex items-center gap-1 ${A.monthDiff >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                {A.monthDiff >= 0 ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
                {A.monthDiff >= 0 ? "+" : ""}{A.monthDiff}% vs last month
              </span>
            </div>
            <ResponsiveContainer width="100%" height={190}>
              <AreaChart data={A.monthlyTrend}>
                <defs>
                  <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.sky} stopOpacity={0.15}/>
                    <stop offset="95%" stopColor={C.sky} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} dy={8}/>
                <YAxis hide domain={[0, 100]}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Area type="monotone" dataKey="rate" name="Success Rate %" stroke={C.sky}
                  strokeWidth={3} fillOpacity={1} fill="url(#skyGrad)"
                  dot={{ fill: C.sky, r: 4, strokeWidth: 0 }}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Heatmap ── */}
        {/* <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-100">
          <div className="mb-5">
            <h3 className="text-base font-bold text-slate-800">7-Day Completion Heatmap</h3>
            <p className="text-xs text-slate-400 font-medium">Completions per day this week</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {A.heatmap.map((d, i) => {
              const max       = Math.max(...A.heatmap.map(h => h.done), 1);
              const intensity = d.done / max;
              const bg =
                intensity >= 0.75 ? "bg-violet-600 text-white shadow-md shadow-violet-200" :
                intensity >= 0.5  ? "bg-violet-300 text-violet-900" :
                intensity >= 0.1  ? "bg-violet-100 text-violet-700" :
                "bg-slate-100 text-slate-400";
              return (
                <div key={i} className={`flex-1 min-w-[70px] rounded-2xl p-4 text-center transition-all ${bg}`}>
                  <div className="text-xs font-bold mb-1">{d.day}</div>
                  <div className="text-2xl font-black">{d.done}</div>
                  <div className="text-xs font-medium opacity-70">done</div>
                </div>
              );
            })}
          </div>
        </div> */}

        {/* ── Quick Add + XP Card ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TodoForm onSubmit={handleCreate}/>
          </div>

          <div className="bg-gradient-to-br from-violet-600 via-indigo-600 to-sky-500 rounded-3xl p-7 text-white shadow-xl shadow-violet-200">
            <div className="flex items-center gap-2 mb-4">
              <Award size={20} className="text-yellow-300"/>
              <span className="text-sm font-bold text-violet-100">Your Progress</span>
            </div>
            {/* XP = completed * 10 */}
            <div className="text-5xl font-black mb-1">{A.completed * 10}</div>
            <div className="text-violet-200 text-sm font-medium mb-5">Experience Points</div>
            <div className="mb-6">
              <div className="flex justify-between text-xs text-violet-200 font-semibold mb-2">
                <span>Level {Math.floor(A.completed / 5) + 1}</span>
                <span>{A.completed * 10} / {(Math.floor(A.completed / 5) + 2) * 50} XP</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div className="h-full bg-gradient-to-r from-yellow-300 to-amber-400 rounded-full"
                  initial={{ width: 0 }} animate={{ width: `${A.rate}%` }}
                  transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}/>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: "🔥", label: "Streak",   v: `${A.streak}d`  },
                { icon: "✅", label: "Done",      v: A.completed     },
                { icon: "📈", label: "Avg/Day",   v: A.avgPerDay     },
              ].map((b, i) => (
                <div key={i} className="bg-white/10 rounded-2xl p-3 text-center backdrop-blur-md">
                  <div className="text-xl mb-1">{b.icon}</div>
                  <div className="text-xs font-bold text-white">{b.v}</div>
                  <div className="text-xs text-violet-300 font-medium">{b.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Todo List ── */}
        {/* <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black text-slate-800">All Tasks</h2>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold">{A.completed} Done</span>
              <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-bold">{A.pending} Pending</span>
            </div>
          </div>
          <TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete}/>
        </div> */}

      </motion.div>
    </ProtectedRoute>
  );
};

/* ══════════ Sub-components ════════════════════════════════════ */
const StatCard = ({ title, value, sub, positive, icon, grad }: any) => (
  <motion.div whileHover={{ y: -3 }}
    className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 overflow-hidden relative group">
    <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full bg-gradient-to-br ${grad} opacity-10 group-hover:opacity-20 transition-opacity`}/>
    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center text-white mb-4 shadow-lg`}>
      {React.cloneElement(icon, { size: 18 })}
    </div>
    <div className="text-3xl font-black text-slate-800 leading-none mb-1">{value}</div>
    <div className="text-xs text-slate-400 font-semibold mb-3">{title}</div>
    <div className={`text-xs font-bold flex items-center gap-1 ${positive ? "text-emerald-500" : "text-rose-500"}`}>
      {positive ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>} {sub}
    </div>
  </motion.div>
);

const MiniStat = ({ label, value, color }: any) => (
  <div className="bg-slate-50 rounded-2xl p-3 text-center">
    <div className={`text-xl font-black ${color}`}>{value}</div>
    <div className="text-xs text-slate-400 font-semibold">{label}</div>
  </div>
);



export default DashboardPage;
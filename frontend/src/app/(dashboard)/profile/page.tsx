'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { todoAPI } from '@/services/api';
import { Todo } from '@/types';
import { motion } from 'framer-motion';
import {
  User, Calendar, Award, TrendingUp, CheckCircle,
  Target, Zap, Edit2, Camera, Shield, Bell,
  Flame, Star, ArrowUpRight, Sparkles
} from 'lucide-react';

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

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');

  const fetchTodos = useCallback(async () => {
    try {
      const r = await todoAPI.getTodos();
      setTodos(r.data);
    } catch {}
  }, []);

  useEffect(() => { fetchTodos(); }, [fetchTodos]);

  /* ── Real stats ── */
  const completed  = todos.filter(t => t.completed).length;
  const total      = todos.length;
  const pending    = total - completed;
  const rate       = total > 0 ? Math.round((completed / total) * 100) : 0;
  const xp         = completed * 10;
  const level      = Math.floor(completed / 5) + 1;

  const days7     = lastNDays(7);
  const dailyDone = days7.map(dk => todos.filter(t => t.completed && getDateKey(t) === dk).length);
  let streak = 0;
  for (let i = dailyDone.length - 1; i >= 0; i--) {
    if (dailyDone[i] > 0) streak++;
    else break;
  }

  /* ── Achievements (real unlock conditions) ── */
  const achievements = [
    { icon: Zap,        title: 'First Step',        desc: 'Complete your first task',  unlocked: completed >= 1,  color: 'amber'  },
    { icon: Target,     title: 'Getting Started',   desc: 'Complete 10 tasks',         unlocked: completed >= 10, color: 'sky'    },
    { icon: TrendingUp, title: 'Rising Star',        desc: 'Complete 50 tasks',         unlocked: completed >= 50, color: 'violet' },
    { icon: Award,      title: 'Century Club',       desc: 'Complete 100 tasks',        unlocked: completed >= 100,color: 'emerald'},
    { icon: Flame,      title: 'On Fire',            desc: '3-day streak',              unlocked: streak >= 3,     color: 'orange' },
    { icon: Star,       title: 'Consistency King',   desc: '7-day streak',              unlocked: streak >= 7,     color: 'rose'   },
  ];

  const joinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Recently';

  const initial = (user?.name || user?.email || 'U')[0].toUpperCase();

  return (
    <ProtectedRoute>
      <div className="space-y-6">

        {/* ── Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-violet-600 via-indigo-600 to-sky-500 p-8 text-white"
        >
          {/* decorative circles */}
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-12 -left-8 w-52 h-52 rounded-full bg-white/5" />

          <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-5xl font-black shadow-xl">
                {initial}
              </div>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-xl shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
                <Camera size={14} className="text-violet-600" />
              </button>
            </div>

            <div className="text-center sm:text-left flex-1">
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                <Sparkles size={14} className="text-amber-300" />
                <span className="text-xs font-bold text-white/70 uppercase tracking-widest">Level {level} · {xp} XP</span>
              </div>
              <h1 className="text-3xl font-black leading-none">{user?.name || 'Champion'}</h1>
              <p className="text-white/70 text-sm mt-1">{user?.email}</p>
            </div>

            {/* Edit button */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 border border-white/20 rounded-2xl text-sm font-bold backdrop-blur-sm transition-all"
            >
              <Edit2 size={14} /> Edit Profile
            </button>
          </div>

          {/* XP bar */}
          <div className="relative mt-6">
            <div className="flex justify-between text-xs font-bold text-white/60 mb-1">
              <span>Level {level}</span>
              <span>{xp % 50}/{50} XP to Level {level + 1}</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((xp % 50) / 50) * 100}%` }}
                transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-amber-300 to-amber-400 rounded-full"
              />
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left column ── */}
          <div className="space-y-5">

            {/* Profile info / edit */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
            >
              <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4">Account Info</h3>

              {isEditing ? (
                <div className="space-y-3">
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-violet-400 transition-colors"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => setIsEditing(false)}
                      className="flex-1 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold rounded-2xl shadow-md shadow-violet-200">
                      Save
                    </button>
                    <button onClick={() => setIsEditing(false)}
                      className="flex-1 py-2.5 bg-slate-100 text-slate-600 text-sm font-bold rounded-2xl">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {[
                    { icon: User,     label: user?.name || '—' },
                    { icon: Calendar, label: `Joined ${joinDate}` },
                    { icon: Award,    label: `Level ${level} Member` },
                  ].map(({ icon: Icon, label }, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
                        <Icon size={14} className="text-violet-600" />
                      </div>
                      <span className="font-medium text-slate-700">{label}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Quick Settings */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
            >
              <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4">Quick Links</h3>
              <div className="space-y-1">
                {[
                  { icon: Bell,   label: 'Notifications' },
                  { icon: Shield, label: 'Privacy'        },
                  { icon: User,   label: 'Account'        },
                ].map(({ icon: Icon, label }, i) => (
                  <button key={i}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-2xl hover:bg-violet-50 hover:text-violet-700 transition-colors group text-sm font-semibold text-slate-600">
                    <div className="flex items-center gap-2.5">
                      <Icon size={15} />
                      {label}
                    </div>
                    <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Right column ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Stats */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                { icon: CheckCircle, label: 'Completed',    value: completed,    color: 'emerald', sub: `${rate}% rate`      },
                { icon: Flame,       label: 'Streak',       value: `${streak}d`, color: 'orange',  sub: 'consecutive days'   },
                { icon: Target,      label: 'Total Tasks',  value: total,        color: 'violet',  sub: `${pending} pending` },
                { icon: Star,        label: 'XP Earned',    value: xp,           color: 'amber',   sub: `Level ${level}`     },
              ].map(({ icon: Icon, label, value, color, sub }, i) => (
                <motion.div key={i}
                  variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
                  whileHover={{ y: -3 }}
                  className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100"
                >
                  <div className={`w-9 h-9 rounded-2xl bg-${color}-50 flex items-center justify-center mb-3`}>
                    <Icon size={18} className={`text-${color}-500`} />
                  </div>
                  <div className="text-2xl font-black text-slate-800">{value}</div>
                  <div className="text-xs font-bold text-slate-400 mt-0.5">{label}</div>
                  <div className={`text-xs font-bold text-${color}-500 mt-1`}>{sub}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-black text-slate-800">Achievements</h3>
                <span className="text-xs font-bold text-violet-600 bg-violet-50 px-3 py-1 rounded-full">
                  {achievements.filter(a => a.unlocked).length}/{achievements.length} unlocked
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {achievements.map(({ icon: Icon, title, desc, unlocked, color }, i) => (
                  <motion.div key={i}
                    whileHover={unlocked ? { scale: 1.03 } : {}}
                    className={`p-4 rounded-2xl border transition-all ${
                      unlocked
                        ? 'bg-white border-slate-200 shadow-sm'
                        : 'bg-slate-50 border-slate-100 opacity-40 grayscale'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl bg-${color}-50 flex items-center justify-center mb-3`}>
                      <Icon size={20} className={`text-${color}-500`} />
                    </div>
                    <div className="text-sm font-black text-slate-800">{title}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{desc}</div>
                    {unlocked && (
                      <div className={`text-[10px] font-black text-${color}-500 mt-2 uppercase tracking-wide`}>
                        ✓ Unlocked
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
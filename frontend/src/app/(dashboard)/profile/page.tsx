'use client';

import React, { useState } from 'react';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { 
  User, Mail, Calendar, Award, 
  TrendingUp, CheckCircle, Target, Zap,
  Edit2, Camera, Shield, Bell
} from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  // Mock user stats
  const stats = {
    tasksCompleted: 127,
    currentStreak: 12,
    totalTasks: 184,
    successRate: 69,
    joinDate: 'January 2024',
    level: 'Pro Member'
  };

  const achievements = [
    { icon: <Zap />, title: 'Early Bird', description: 'Completed 50 tasks', color: 'yellow' },
    { icon: <Target />, title: 'Focused', description: '7-day streak', color: 'blue' },
    { icon: <TrendingUp />, title: 'Rising Star', description: '100 tasks completed', color: 'purple' },
    { icon: <Award />, title: 'Consistency King', description: '30-day streak', color: 'emerald' },
  ];

  const handleSaveProfile = () => {
    // Save logic would go here
    setIsEditing(false);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#F8FAFC] flex">
        <div className="flex-1 px-4 md:px-10 py-8">
          
          {/* Header */}
          <header className="mb-10">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <User className="text-indigo-600" size={32} />
              My Profile
            </h1>
            <p className="text-slate-500 font-medium mt-1">Manage your account and view your progress</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Profile Card */}
              <motion.div 
                className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Avatar */}
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-black text-5xl shadow-xl">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-slate-200 hover:bg-slate-50 transition-colors">
                    <Camera size={16} className="text-slate-600" />
                  </button>
                </div>

                {/* User Info */}
                {isEditing ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
                      placeholder="Name"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
                      placeholder="Email"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveProfile}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-black text-slate-900 text-center mb-1">
                      {user?.name}
                    </h2>
                    <p className="text-slate-500 text-center mb-6">{user?.email}</p>
                    
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors"
                    >
                      <Edit2 size={18} />
                      Edit Profile
                    </button>
                  </>
                )}

                <div className="mt-6 pt-6 border-t border-slate-200 space-y-3">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Calendar size={18} />
                    <span className="text-sm font-medium">Joined {stats.joinDate}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Award size={18} />
                    <span className="text-sm font-medium">{stats.level}</span>
                  </div>
                </div>
              </motion.div>

              {/* Quick Settings */}
              <motion.div
                className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Settings</h3>
                <div className="space-y-3">
                  <SettingItem icon={<Bell />} label="Notifications" />
                  <SettingItem icon={<Shield />} label="Privacy" />
                  <SettingItem icon={<User />} label="Account" />
                </div>
              </motion.div>
            </div>

            {/* Right Column - Stats & Achievements */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Stats Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-xl font-bold text-slate-800 mb-4">Your Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard 
                    icon={<CheckCircle />} 
                    label="Completed" 
                    value={stats.tasksCompleted} 
                    color="emerald" 
                  />
                  <StatCard 
                    icon={<Zap />} 
                    label="Current Streak" 
                    value={`${stats.currentStreak} days`} 
                    color="yellow" 
                  />
                  <StatCard 
                    icon={<Target />} 
                    label="Total Tasks" 
                    value={stats.totalTasks} 
                    color="indigo" 
                  />
                  <StatCard 
                    icon={<TrendingUp />} 
                    label="Success Rate" 
                    value={`${stats.successRate}%`} 
                    color="purple" 
                  />
                </div>
              </motion.div>

              {/* Achievements */}
              <motion.div
                className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Award className="text-indigo-600" size={24} />
                  Achievements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement, idx) => (
                    <AchievementCard key={idx} {...achievement} />
                  ))}
                </div>
              </motion.div>

              {/* Activity Overview */}
              <motion.div
                className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-xl font-bold text-slate-800 mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  <ActivityItem 
                    icon={<CheckCircle className="text-emerald-500" />}
                    text="Completed 'Finish project proposal'"
                    time="2 hours ago"
                  />
                  <ActivityItem 
                    icon={<Zap className="text-yellow-500" />}
                    text="Achieved 12-day streak"
                    time="1 day ago"
                  />
                  <ActivityItem 
                    icon={<Target className="text-indigo-500" />}
                    text="Created 5 new tasks"
                    time="2 days ago"
                  />
                  <ActivityItem 
                    icon={<Award className="text-purple-500" />}
                    text="Unlocked 'Rising Star' achievement"
                    time="3 days ago"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

const StatCard = ({ icon, label, value, color }: any) => (
  <div className={`bg-gradient-to-br from-${color}-50 to-${color}-100 p-6 rounded-2xl border border-${color}-200`}>
    <div className={`w-10 h-10 bg-${color}-500 text-white rounded-xl flex items-center justify-center mb-3 shadow-md`}>
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <div className="text-2xl font-black text-slate-800 mb-1">{value}</div>
    <div className="text-slate-600 text-sm font-medium">{label}</div>
  </div>
);

const AchievementCard = ({ icon, title, description, color }: any) => (
  <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-200 hover:border-indigo-500 transition-colors">
    <div className={`w-12 h-12 bg-${color}-500 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <h4 className="font-bold text-slate-900 mb-1">{title}</h4>
    <p className="text-sm text-slate-500">{description}</p>
  </div>
);

const ActivityItem = ({ icon, text, time }: any) => (
  <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
      {icon}
    </div>
    <div className="flex-1">
      <p className="font-medium text-slate-800">{text}</p>
      <p className="text-sm text-slate-500">{time}</p>
    </div>
  </div>
);

const SettingItem = ({ icon, label }: any) => (
  <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left">
    <div className="text-slate-600">
      {React.cloneElement(icon, { size: 18 })}
    </div>
    <span className="font-medium text-slate-700">{label}</span>
  </button>
);

export default ProfilePage;

'use client';

import React, { useState } from 'react';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings, Bell, Lock, Palette, Database,
  Moon, Globe, Shield, Trash2, Download,
  ChevronRight, LogOut, Check
} from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { logout } = useAuth() as any;
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates,  setEmailUpdates]  = useState(false);
  const [darkMode,      setDarkMode]      = useState(false);
  const [language,      setLanguage]      = useState('English');
  const [saved,         setSaved]         = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sections = [
    {
      title: 'Notifications',
      icon: Bell,
      color: 'violet',
      items: [
        { label: 'Push Notifications', desc: 'Task reminders and updates', type: 'toggle' as const, value: notifications, onChange: setNotifications },
        { label: 'Email Updates',       desc: 'Weekly productivity summary',  type: 'toggle' as const, value: emailUpdates,  onChange: setEmailUpdates  },
      ]
    },
    {
      title: 'Appearance',
      icon: Palette,
      color: 'indigo',
      items: [
        { label: 'Dark Mode',  desc: 'Switch to dark theme',           type: 'toggle' as const, value: darkMode, onChange: setDarkMode },
        { label: 'Language',   desc: 'App display language',           type: 'select' as const, value: language, onChange: setLanguage,
          options: ['English', 'Urdu', 'Spanish', 'French', 'German'] },
      ]
    },
    {
      title: 'Privacy & Security',
      icon: Shield,
      color: 'emerald',
      items: [
        { label: 'Change Password',          desc: 'Update your account password',    type: 'button' as const, action: () => alert('Coming soon!') },
        { label: 'Two-Factor Auth',          desc: 'Add extra security to your account', type: 'button' as const, action: () => alert('Coming soon!') },
      ]
    },
    {
      title: 'Data',
      icon: Database,
      color: 'sky',
      items: [
        { label: 'Export My Data', desc: 'Download all your tasks as CSV', type: 'button' as const, icon: Download, action: () => alert('Coming soon!') },
        { label: 'Clear Cache',    desc: 'Free up local storage',          type: 'button' as const, icon: Trash2,   action: () => alert('Cache cleared!') },
      ]
    },
  ];

  return (
    <ProtectedRoute>
      <div className="space-y-6 max-w-3xl">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Settings size={22} className="text-violet-600" /> Settings
          </h2>
          <p className="text-sm text-slate-400 font-medium mt-0.5">Manage your preferences</p>
        </motion.div>

        {/* Sections */}
        {sections.map((section, si) => (
          <motion.div
            key={si}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: si * 0.07 }}
            className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
          >
            {/* Section header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl bg-${section.color}-50 flex items-center justify-center`}>
                <section.icon size={16} className={`text-${section.color}-600`} />
              </div>
              <h3 className="text-sm font-black text-slate-700">{section.title}</h3>
            </div>

            {/* Items */}
            <div className="divide-y divide-slate-50">
              {section.items.map((item, ii) => (
                <div key={ii} className="px-6 py-4">
                  {item.type === 'toggle' && (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{item.label}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => item.onChange(!item.value)}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                          item.value ? `bg-violet-600` : 'bg-slate-200'
                        }`}
                      >
                        <motion.div
                          animate={{ x: item.value ? 24 : 2 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                        />
                      </button>
                    </div>
                  )}

                  {item.type === 'select' && (
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{item.label}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                      </div>
                      <select
                        value={item.value as string}
                        onChange={e => item.onChange(e.target.value)}
                        className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-violet-400 transition-colors"
                      >
                        {(item as any).options.map((o: string) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {item.type === 'button' && (
                    <button
                      onClick={(item as any).action}
                      className="w-full flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        {(item as any).icon && (
                          <div className="w-7 h-7 rounded-xl bg-slate-50 flex items-center justify-center">
                            {React.createElement((item as any).icon, { size: 14, className: 'text-slate-500' })}
                          </div>
                        )}
                        <div className="text-left">
                          <p className="text-sm font-bold text-slate-800">{item.label}</p>
                          <p className="text-xs text-slate-400">{item.desc}</p>
                        </div>
                      </div>
                      <ChevronRight size={15} className="text-slate-300 group-hover:text-violet-500 transition-colors" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Save button */}
        <motion.button
          onClick={handleSave}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-violet-200 flex items-center justify-center gap-2 transition-all"
        >
          <AnimatePresence mode="wait">
            {saved ? (
              <motion.span key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <Check size={16} /> Saved!
              </motion.span>
            ) : (
              <motion.span key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Save Preferences
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Danger zone */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-rose-50 rounded-3xl p-6 border border-rose-200"
        >
          <h3 className="text-sm font-black text-rose-700 uppercase tracking-widest mb-4">Danger Zone</h3>
          <div className="space-y-3">
            {logout && (
              <button
                onClick={logout}
                className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-rose-200 hover:border-rose-400 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center">
                    <LogOut size={14} className="text-rose-500" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-rose-800">Sign Out</p>
                    <p className="text-xs text-rose-400">Log out of your account</p>
                  </div>
                </div>
                <ChevronRight size={15} className="text-rose-300 group-hover:text-rose-500 transition-colors" />
              </button>
            )}
            <button
              onClick={() => { if (confirm('Delete account? This cannot be undone.')) alert('Account deletion initiated.'); }}
              className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-rose-200 hover:border-rose-400 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center">
                  <Trash2 size={14} className="text-rose-500" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-rose-800">Delete Account</p>
                  <p className="text-xs text-rose-400">Permanently remove all data</p>
                </div>
              </div>
              <ChevronRight size={15} className="text-rose-300 group-hover:text-rose-500 transition-colors" />
            </button>
          </div>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-300 font-semibold pb-4">
          AuraTask v1.0.0 · Made with ❤️ by Urooj Sadiq
        </p>

      </div>
    </ProtectedRoute>
  );
};

export default SettingsPage;
'use client';

import React, { useState } from 'react';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { motion } from 'framer-motion';
import { 
  Settings, Bell, Lock, Palette, 
  Globe, Moon, Sun, Smartphone,
  Mail, Shield, Eye, Database,
  Trash2, Download, LogOut, ChevronRight
} from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');

  const settingsSections = [
    {
      title: 'Notifications',
      icon: <Bell />,
      color: 'indigo',
      items: [
        {
          label: 'Push Notifications',
          description: 'Receive notifications for task updates',
          type: 'toggle',
          value: notifications,
          onChange: setNotifications
        },
        {
          label: 'Email Updates',
          description: 'Get weekly summary emails',
          type: 'toggle',
          value: emailUpdates,
          onChange: setEmailUpdates
        }
      ]
    },
    {
      title: 'Appearance',
      icon: <Palette />,
      color: 'purple',
      items: [
        {
          label: 'Dark Mode',
          description: 'Switch to dark theme',
          type: 'toggle',
          value: darkMode,
          onChange: setDarkMode
        },
        {
          label: 'Language',
          description: 'Choose your preferred language',
          type: 'select',
          value: language,
          options: ['English', 'Spanish', 'French', 'German'],
          onChange: setLanguage
        }
      ]
    },
    {
      title: 'Privacy & Security',
      icon: <Shield />,
      color: 'emerald',
      items: [
        {
          label: 'Change Password',
          description: 'Update your account password',
          type: 'button',
          action: () => alert('Password change feature coming soon!')
        },
        {
          label: 'Two-Factor Authentication',
          description: 'Add an extra layer of security',
          type: 'button',
          action: () => alert('2FA setup coming soon!')
        },
        {
          label: 'Privacy Settings',
          description: 'Manage your data and privacy',
          type: 'button',
          action: () => alert('Privacy settings coming soon!')
        }
      ]
    },
    {
      title: 'Data Management',
      icon: <Database />,
      color: 'orange',
      items: [
        {
          label: 'Export Data',
          description: 'Download all your tasks and data',
          type: 'button',
          icon: <Download size={18} />,
          action: () => alert('Export feature coming soon!')
        },
        {
          label: 'Clear Cache',
          description: 'Clear app cache and temporary data',
          type: 'button',
          icon: <Trash2 size={18} />,
          action: () => alert('Cache cleared!')
        }
      ]
    }
  ];

  const dangerActions = [
    {
      label: 'Delete Account',
      description: 'Permanently delete your account and all data',
      icon: <Trash2 />,
      color: 'rose',
      action: () => {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
          alert('Account deletion initiated');
        }
      }
    }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#F8FAFC] flex">
        <div className="flex-1 px-4 md:px-10 py-8">
          
          {/* Header */}
          <header className="mb-10">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Settings className="text-slate-700" size={32} />
              Settings
            </h1>
            <p className="text-slate-500 font-medium mt-1">Manage your preferences and account settings</p>
          </header>

          <div className="max-w-4xl space-y-6">
            
            {/* Settings Sections */}
            {settingsSections.map((section, idx) => (
              <motion.div
                key={idx}
                className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 bg-${section.color}-500 text-white rounded-xl flex items-center justify-center shadow-md`}>
                    {React.cloneElement(section.icon, { size: 20 })}
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">{section.title}</h2>
                </div>

                <div className="space-y-4">
                  {section.items.map((item, itemIdx) => (
                    <SettingItem key={itemIdx} {...item} />
                  ))}
                </div>
              </motion.div>
            ))}

            {/* Danger Zone */}
            <motion.div
              className="bg-rose-50 rounded-3xl p-8 border-2 border-rose-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-rose-500 text-white rounded-xl flex items-center justify-center shadow-md">
                  <Shield size={20} />
                </div>
                <h2 className="text-xl font-bold text-rose-900">Danger Zone</h2>
              </div>

              <div className="space-y-4">
                {dangerActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={action.action}
                    className="w-full flex items-center justify-between p-4 bg-white rounded-xl border-2 border-rose-300 hover:border-rose-500 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-rose-600">
                        {React.cloneElement(action.icon, { size: 20 })}
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-rose-900">{action.label}</div>
                        <div className="text-sm text-rose-600">{action.description}</div>
                      </div>
                    </div>
                    <ChevronRight className="text-rose-400 group-hover:text-rose-600 transition-colors" size={20} />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* App Info */}
            <motion.div
              className="bg-slate-100 rounded-2xl p-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-slate-600 font-medium">
                AuraTask v1.0.0
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Made with ❤️ for productivity enthusiasts
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

const SettingItem = ({ label, description, type, value, onChange, options, action, icon }: any) => {
  if (type === 'toggle') {
    return (
      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
        <div className="flex-1">
          <div className="font-bold text-slate-800">{label}</div>
          <div className="text-sm text-slate-500">{description}</div>
        </div>
        <button
          onClick={() => onChange(!value)}
          className={`relative w-14 h-8 rounded-full transition-colors ${
            value ? 'bg-indigo-600' : 'bg-slate-300'
          }`}
        >
          <motion.div
            className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md"
            animate={{ x: value ? 24 : 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </button>
      </div>
    );
  }

  if (type === 'select') {
    return (
      <div className="p-4 bg-slate-50 rounded-xl">
        <div className="font-bold text-slate-800 mb-1">{label}</div>
        <div className="text-sm text-slate-500 mb-3">{description}</div>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
        >
          {options.map((option: string) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    );
  }

  if (type === 'button') {
    return (
      <button
        onClick={action}
        className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group"
      >
        <div className="flex items-center gap-3">
          {icon && <div className="text-slate-600">{icon}</div>}
          <div className="text-left">
            <div className="font-bold text-slate-800">{label}</div>
            <div className="text-sm text-slate-500">{description}</div>
          </div>
        </div>
        <ChevronRight className="text-slate-400 group-hover:text-slate-600 transition-colors" size={20} />
      </button>
    );
  }

  return null;
};

export default SettingsPage;
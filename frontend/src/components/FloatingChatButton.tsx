"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, Maximize2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '../services/auth';
import ChatInterface from './ChatInterface';
import Link from 'next/link';

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleToggle = () => {
    // Auth Check: Agar login nahi hai toh login page bhej do
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      
      {/* --- CHAT DIALOG WINDOW --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-[400px] max-w-[90vw] h-[600px] max-h-[80vh] bg-white rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold leading-none">AuraTask AI</h3>
                  <span className="text-[10px] text-indigo-200 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    Always active
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/chat" className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Full Screen">
                  <Maximize2 className="w-4 h-4" />
                </Link>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Content (Your existing logic) */}
            <div className="flex-1 overflow-hidden relative bg-slate-50">
                <ChatInterface isFloating={true} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- FLOATING TRIGGER BUTTON --- */}
      <motion.button
        onClick={handleToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 ${
          isOpen ? 'bg-slate-900 rotate-90' : 'bg-gradient-to-tr from-indigo-600 to-rose-500'
        }`}
      >
        {isOpen ? (
          <X className="text-white w-8 h-8" />
        ) : (
          <>
            <div className="absolute inset-0 bg-indigo-500 rounded-2xl blur-xl opacity-40 animate-pulse"></div>
            <Bot className="text-white w-8 h-8 relative z-10" />
            <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-amber-300 animate-bounce" />
          </>
        )}
        
        {/* Unread Indicator or Tooltip */}
        {!isOpen && (
          <div className="absolute -left-32 bg-white text-slate-900 text-[10px] font-black px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-lg border border-slate-100 pointer-events-none uppercase tracking-widest">
            Chat with AI
          </div>
        )}
      </motion.button>
    </div>
  );
};

export default FloatingChat;
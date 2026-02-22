// "use client";
// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Bot, X, Send, Sparkles, Maximize2 } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import { isAuthenticated } from '../services/auth';
// import ChatInterface from './ChatInterface';
// import Link from 'next/link';

// const FloatingChat = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const router = useRouter();

//   const handleToggle = () => {
//     // Auth Check: Agar login nahi hai toh login page bhej do
//     if (!isAuthenticated()) {
//       router.push('/login');
//       return;
//     }
//     setIsOpen(!isOpen);
//   };

//   return (
//     <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      
//       {/* --- CHAT DIALOG WINDOW --- */}
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: 'bottom right' }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             exit={{ opacity: 0, scale: 0.8, y: 20 }}
//             className="mb-4 w-[400px] max-w-[90vw] h-[600px] max-h-[80vh] bg-white rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 flex flex-col overflow-hidden"
//           >
//             {/* Header */}
//             <div className="p-5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white flex justify-between items-center">
//               <div className="flex items-center gap-3">
//                 <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
//                   <Bot className="w-5 h-5 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="text-sm font-bold leading-none">AuraTask AI</h3>
//                   <span className="text-[10px] text-indigo-200 font-medium flex items-center gap-1">
//                     <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
//                     Always active
//                   </span>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Link href="/chat" className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Full Screen">
//                   <Maximize2 className="w-4 h-4" />
//                 </Link>
//                 <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>

//             {/* Chat Content (Your existing logic) */}
//             <div className="flex-1 overflow-hidden relative bg-slate-50">
//                 <ChatInterface isFloating={true} />
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* --- FLOATING TRIGGER BUTTON --- */}
//       <motion.button
//         onClick={handleToggle}
//         whileHover={{ scale: 1.05 }}
//         whileTap={{ scale: 0.95 }}
//         className={`relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 ${
//           isOpen ? 'bg-slate-900 rotate-90' : 'bg-gradient-to-tr from-indigo-600 to-rose-500'
//         }`}
//       >
//         {isOpen ? (
//           <X className="text-white w-8 h-8" />
//         ) : (
//           <>
//             <div className="absolute inset-0 bg-indigo-500 rounded-2xl blur-xl opacity-40 animate-pulse"></div>
//             <Bot className="text-white w-8 h-8 relative z-10" />
//             <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-amber-300 animate-bounce" />
//           </>
//         )}
        
//         {/* Unread Indicator or Tooltip */}
//         {!isOpen && (
//           <div className="absolute -left-32 bg-white text-slate-900 text-[10px] font-black px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-lg border border-slate-100 pointer-events-none uppercase tracking-widest">
//             Chat with AI
//           </div>
//         )}
//       </motion.button>
//     </div>
//   );
// };

// export default FloatingChat;



"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Maximize2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "../services/auth";
import ChatInterface from "./ChatInterface";
import Link from "next/link";

const FloatingChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleToggle = () => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">

      {/* ── Chat Window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 16 }}
            animate={{ opacity: 1, scale: 1,   y: 0  }}
            exit={{   opacity: 0, scale: 0.88, y: 16 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="mb-4 w-[400px] max-w-[90vw] h-[580px] max-h-[80vh] bg-white rounded-[28px] shadow-[0_24px_64px_-12px_rgba(124,58,237,0.25)] border border-slate-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/15 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white leading-none">AuraTask AI</h3>
                  <span className="text-[10px] text-violet-200 font-semibold flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse inline-block" />
                    Always active
                  </span>
                </div>
              </div>
              {/* <div className="flex items-center gap-1">
                <Link
                  href="/chat"
                  className="p-2 hover:bg-white/15 rounded-xl transition-colors text-white/80 hover:text-white"
                  title="Open full screen"
                >
                  <Maximize2 className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/15 rounded-xl transition-colors text-white/80 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div> */}
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-hidden bg-slate-50">
              <ChatInterface isFloating={true} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Trigger Button ── */}
      <motion.button
        onClick={handleToggle}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        className={`relative w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-300 ${
          isOpen
            ? "bg-slate-800"
            : "bg-gradient-to-br from-purple-500 to-pink-500"
        }`}
      >
        {/* Glow ring */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-2xl bg-violet-500 opacity-30 blur-lg animate-pulse" />
        )}

        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X className="text-white w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div key="bot" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <Bot className="text-white w-7 h-7 relative z-10" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sparkle badge */}
        {!isOpen && (
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="absolute -top-1.5 -right-1.5"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
          </motion.div>
        )}
      </motion.button>
    </div>
  );
};

export default FloatingChatButton;
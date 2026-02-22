// 'use client';

// import React, { useState } from 'react';
// import ProtectedRoute from '../../components/ProtectedRoute';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   MessageSquare, Send, Sparkles, Bot, 
//   User, Zap, TrendingUp, Clock
// } from 'lucide-react';

// interface Message {
//   id: string;
//   role: 'user' | 'assistant';
//   content: string;
//   timestamp: Date;
// }

// const ChatPage: React.FC = () => {
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: '1',
//       role: 'assistant',
//       content: "Hello! I'm your AI assistant. I can help you manage tasks, answer questions, and provide productivity tips. How can I assist you today?",
//       timestamp: new Date()
//     }
//   ]);
//   const [inputValue, setInputValue] = useState('');
//   const [isTyping, setIsTyping] = useState(false);

//   const handleSendMessage = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!inputValue.trim()) return;

//     const userMessage: Message = {
//       id: Date.now().toString(),
//       role: 'user',
//       content: inputValue,
//       timestamp: new Date()
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setInputValue('');
//     setIsTyping(true);

//     // Simulate AI response
//     setTimeout(() => {
//       const aiResponse: Message = {
//         id: (Date.now() + 1).toString(),
//         role: 'assistant',
//         content: getAIResponse(inputValue),
//         timestamp: new Date()
//       };
//       setMessages(prev => [...prev, aiResponse]);
//       setIsTyping(false);
//     }, 1500);
//   };

//   const getAIResponse = (input: string): string => {
//     const lowerInput = input.toLowerCase();
    
//     if (lowerInput.includes('task') || lowerInput.includes('todo')) {
//       return "I can help you with task management! You can create, view, and organize your tasks from the 'My Tasks' page. Would you like me to guide you through creating a new task?";
//     } else if (lowerInput.includes('productivity') || lowerInput.includes('tips')) {
//       return "Here are some productivity tips:\n\n1. Break large tasks into smaller, manageable chunks\n2. Use the Pomodoro technique (25 min work, 5 min break)\n3. Prioritize your most important tasks early in the day\n4. Take regular breaks to maintain focus\n\nWould you like more specific advice?";
//     } else if (lowerInput.includes('help')) {
//       return "I'm here to help! I can assist with:\n\n• Task management and organization\n• Productivity tips and strategies\n• Time management advice\n• Answering questions about the app\n\nWhat would you like to know more about?";
//     } else {
//       return "That's an interesting question! I'm here to help you stay productive and organized. Feel free to ask me about task management, productivity tips, or how to use this app effectively.";
//     }
//   };

//   const quickActions = [
//     { icon: <Zap size={16} />, label: "Create a task", action: "Help me create a new task" },
//     { icon: <TrendingUp size={16} />, label: "Productivity tips", action: "Give me productivity tips" },
//     { icon: <Clock size={16} />, label: "Time management", action: "How can I manage my time better?" },
//   ];

//   return (
//     <ProtectedRoute>
//       <div className="min-h-screen bg-[#F8FAFC] flex">
//         <div className="flex-1 px-4 md:px-10 py-8 flex flex-col">
          
//           {/* Header */}
//           <header className="mb-8">
//             <div className="flex items-center gap-4">
//               <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
//                 <MessageSquare className="text-white" size={28} />
//               </div>
//               <div>
//                 <h1 className="text-3xl font-black text-slate-900 tracking-tight">AI Chat Assistant</h1>
//                 <p className="text-slate-500 font-medium">Get help and boost your productivity</p>
//               </div>
//             </div>
//           </header>

//           {/* Chat Container */}
//           <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
            
//             {/* Messages Area */}
//             <div className="flex-1 overflow-y-auto p-6 space-y-6">
//               <AnimatePresence>
//                 {messages.map((message) => (
//                   <motion.div
//                     key={message.id}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
//                   >
//                     {/* Avatar */}
//                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
//                       message.role === 'user' 
//                         ? 'bg-gradient-to-br from-indigo-500 to-purple-600' 
//                         : 'bg-gradient-to-br from-pink-500 to-purple-600'
//                     }`}>
//                       {message.role === 'user' ? (
//                         <User className="text-white" size={20} />
//                       ) : (
//                         <Bot className="text-white" size={20} />
//                       )}
//                     </div>

//                     {/* Message Bubble */}
//                     <div className={`max-w-[70%] ${message.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
//                       <div className={`px-6 py-4 rounded-2xl shadow-sm ${
//                         message.role === 'user'
//                           ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white'
//                           : 'bg-slate-100 text-slate-800'
//                       }`}>
//                         <p className="whitespace-pre-line font-medium leading-relaxed">{message.content}</p>
//                       </div>
//                       <span className="text-xs text-slate-400 px-2">
//                         {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                       </span>
//                     </div>
//                   </motion.div>
//                 ))}
//               </AnimatePresence>

//               {/* Typing Indicator */}
//               {isTyping && (
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="flex gap-4"
//                 >
//                   <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-md">
//                     <Bot className="text-white" size={20} />
//                   </div>
//                   <div className="bg-slate-100 px-6 py-4 rounded-2xl">
//                     <div className="flex gap-2">
//                       <motion.div
//                         animate={{ scale: [1, 1.2, 1] }}
//                         transition={{ repeat: Infinity, duration: 1, delay: 0 }}
//                         className="w-2 h-2 bg-slate-400 rounded-full"
//                       />
//                       <motion.div
//                         animate={{ scale: [1, 1.2, 1] }}
//                         transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
//                         className="w-2 h-2 bg-slate-400 rounded-full"
//                       />
//                       <motion.div
//                         animate={{ scale: [1, 1.2, 1] }}
//                         transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
//                         className="w-2 h-2 bg-slate-400 rounded-full"
//                       />
//                     </div>
//                   </div>
//                 </motion.div>
//               )}
//             </div>

//             {/* Quick Actions */}
//             {messages.length <= 1 && (
//               <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
//                 <p className="text-sm font-bold text-slate-600 mb-3">Quick Actions</p>
//                 <div className="flex flex-wrap gap-2">
//                   {quickActions.map((action, idx) => (
//                     <motion.button
//                       key={idx}
//                       onClick={() => setInputValue(action.action)}
//                       className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:border-indigo-500 hover:text-indigo-600 transition-all"
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                     >
//                       {action.icon}
//                       {action.label}
//                     </motion.button>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Input Area */}
//             <form onSubmit={handleSendMessage} className="p-6 border-t border-slate-200">
//               <div className="flex gap-4">
//                 <input
//                   type="text"
//                   value={inputValue}
//                   onChange={(e) => setInputValue(e.target.value)}
//                   placeholder="Type your message..."
//                   className="flex-1 px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500 font-medium"
//                 />
//                 <motion.button
//                   type="submit"
//                   disabled={!inputValue.trim()}
//                   className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                   whileHover={{ scale: inputValue.trim() ? 1.02 : 1 }}
//                   whileTap={{ scale: inputValue.trim() ? 0.98 : 1 }}
//                 >
//                   <Send size={20} />
//                   Send
//                 </motion.button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// };

// export default ChatPage;


"use client";

import React, { useState, useEffect, useRef } from "react";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, Bot, User, ChevronRight,
  Clock, Search, Inbox, RefreshCw, Sparkles
} from "lucide-react";
import { getUserConversations, loadConversationHistory } from "@/lib/chatApi";
import { useAuth } from "@/hooks/useAuth";
import { ChatMessage } from "@/types/chat";

interface Conversation {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  message_count?: number;
}

/* ── Format helpers ── */
const formatDate = (iso: string) => {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / 86_400_000);
  if (diffDays === 0) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7)  return d.toLocaleDateString("en-US", { weekday: "short" });
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const formatFull = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

/* ═══════════════════════════════════════════════════════════ */
const ChatHistoryPage: React.FC = () => {
  const { user } = useAuth();

  const [conversations,    setConversations]    = useState<Conversation[]>([]);
  const [selectedId,       setSelectedId]       = useState<string | null>(null);
  const [messages,         setMessages]         = useState<ChatMessage[]>([]);
  const [search,           setSearch]           = useState("");
  const [loadingConvs,     setLoadingConvs]     = useState(true);
  const [loadingMsgs,      setLoadingMsgs]      = useState(false);
  const [error,            setError]            = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  /* ── Load conversations ── */
  useEffect(() => {
    if (!user?.id) return;
    fetchConversations();
  }, [user?.id]);

  const fetchConversations = async () => {
    try {
      setLoadingConvs(true);
      setError(null);
      const data = await getUserConversations(user!.id, 30);
      setConversations(data);
      // Auto-select first
      if (data.length > 0 && !selectedId) {
        selectConversation(data[0].id);
      }
    } catch {
      setError("Could not load conversations.");
    } finally {
      setLoadingConvs(false);
    }
  };

  /* ── Load messages for selected conversation ── */
  const selectConversation = async (convId: string) => {
    setSelectedId(convId);
    setMessages([]);
    setLoadingMsgs(true);
    try {
      const msgs = await loadConversationHistory(user!.id, convId, 50);
      setMessages(msgs);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch {
      setError("Could not load messages.");
    } finally {
      setLoadingMsgs(false);
    }
  };

  /* ── Filtered conversations ── */
  const filtered = conversations.filter(c =>
    search ? c.id.toLowerCase().includes(search.toLowerCase()) : true
  );

  const selectedConv = conversations.find(c => c.id === selectedId);

  return (
    <ProtectedRoute>
      <div className="h-[calc(100vh-6rem)] flex gap-6 overflow-hidden">

        {/* ══ LEFT: Conversation List ══ */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-80 flex-shrink-0 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="px-5 pt-5 pb-4 border-b border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                  <MessageSquare size={15} className="text-white" />
                </div>
                <h2 className="text-base font-black text-slate-800">Chat History</h2>
              </div>
              <button onClick={fetchConversations} disabled={loadingConvs}
                className="p-1.5 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-violet-600">
                <RefreshCw size={14} className={loadingConvs ? "animate-spin" : ""} />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search conversations…"
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-violet-300 transition-colors"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto py-2">
            {loadingConvs ? (
              <div className="flex flex-col gap-3 p-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="h-16 bg-slate-100 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 py-12 px-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <Inbox size={22} className="text-slate-300" />
                </div>
                <p className="text-slate-400 text-sm font-semibold">No conversations yet</p>
                <p className="text-slate-300 text-xs">Start chatting from the AI assistant button</p>
              </div>
            ) : (
              <div className="px-2 space-y-1">
                {filtered.map((conv, i) => (
                  <motion.button
                    key={conv.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => selectConversation(conv.id)}
                    className={`w-full text-left px-4 py-3.5 rounded-2xl transition-all group flex items-center gap-3 ${
                      selectedId === conv.id
                        ? "bg-violet-50 border border-violet-200"
                        : "hover:bg-slate-50 border border-transparent"
                    }`}
                  >
                    {/* Icon */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      selectedId === conv.id
                        ? "bg-gradient-to-br from-violet-600 to-indigo-600 shadow-md shadow-violet-200"
                        : "bg-slate-100 group-hover:bg-violet-100"
                    }`}>
                      <Bot size={16} className={selectedId === conv.id ? "text-white" : "text-slate-400 group-hover:text-violet-600"} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className={`text-xs font-bold truncate ${
                          selectedId === conv.id ? "text-violet-700" : "text-slate-700"
                        }`}>
                          Conversation
                        </p>
                        <span className="text-[10px] text-slate-400 font-medium flex-shrink-0 flex items-center gap-0.5">
                          <Clock size={9}/> {formatDate(conv.updated_at)}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                        {conv.message_count != null ? `${conv.message_count} messages` : "Tap to load"}
                      </p>
                    </div>

                    <ChevronRight size={12} className={`flex-shrink-0 transition-colors ${
                      selectedId === conv.id ? "text-violet-400" : "text-slate-300"
                    }`} />
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 font-semibold text-center">
              {conversations.length} conversation{conversations.length !== 1 ? "s" : ""} total
            </p>
          </div>
        </motion.div>

        {/* ══ RIGHT: Messages Panel ══ */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col overflow-hidden"
        >
          {!selectedId ? (
            /* Empty state */
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-200">
                <Sparkles size={28} className="text-white" />
              </div>
              <div>
                <p className="text-slate-800 font-black text-lg">Select a conversation</p>
                <p className="text-slate-400 text-sm mt-1">Choose from the left to view your chat history</p>
              </div>
            </div>
          ) : (
            <>
              {/* Message header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 flex-shrink-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-sm">
                  <Bot size={17} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-800">AuraTask AI</p>
                  {selectedConv && (
                    <p className="text-xs text-slate-400 font-medium">
                      {new Date(selectedConv.created_at).toLocaleDateString("en-US", {
                        weekday: "long", month: "long", day: "numeric"
                      })}
                    </p>
                  )}
                </div>
                {messages.length > 0 && (
                  <span className="ml-auto px-3 py-1 bg-violet-50 text-violet-600 rounded-full text-xs font-bold">
                    {messages.length} messages
                  </span>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                {loadingMsgs ? (
                  <div className="flex flex-col gap-4">
                    {[1,2,3].map(i => (
                      <div key={i} className={`flex gap-3 ${i % 2 === 0 ? "flex-row-reverse" : ""}`}>
                        <div className="w-9 h-9 rounded-xl bg-slate-100 animate-pulse flex-shrink-0" />
                        <div className={`h-14 rounded-2xl animate-pulse ${i % 2 === 0 ? "bg-violet-50 w-48" : "bg-slate-100 w-64"}`} />
                      </div>
                    ))}
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                    <p className="text-slate-400 text-sm font-semibold">No messages in this conversation</p>
                  </div>
                ) : (
                  <>
                    <AnimatePresence initial={false}>
                      {messages.map((msg, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                        >
                          {/* Avatar */}
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                            msg.role === "user"
                              ? "bg-gradient-to-br from-violet-500 to-indigo-600"
                              : "bg-gradient-to-br from-slate-600 to-slate-700"
                          }`}>
                            {msg.role === "user"
                              ? <User size={14} className="text-white" />
                              : <Bot  size={14} className="text-white" />
                            }
                          </div>

                          {/* Bubble */}
                          <div className={`flex flex-col gap-1 max-w-[70%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                            <div className={`px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed whitespace-pre-line ${
                              msg.role === "user"
                                ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-tr-sm"
                                : "bg-slate-100 text-slate-800 rounded-tl-sm"
                            }`}>
                              {msg.content}
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium px-1">
                              {formatFull(msg.timestamp)}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <div ref={bottomRef} />
                  </>
                )}
              </div>

              {/* Read-only footer */}
              <div className="px-6 py-4 border-t border-slate-100 flex-shrink-0">
                <div className="flex items-center justify-center gap-2 py-2 bg-slate-50 rounded-2xl">
                  <Clock size={13} className="text-slate-400" />
                  <p className="text-xs text-slate-400 font-semibold">
                    This is a read-only history view · Chat from the AI button
                  </p>
                </div>
              </div>
            </>
          )}
        </motion.div>

      </div>
    </ProtectedRoute>
  );
};

export default ChatHistoryPage;
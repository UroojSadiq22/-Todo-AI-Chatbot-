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
      <div className="md:h-[calc(100vh-6rem)] h-full flex md:flex-row flex-col gap-6 overflow-hidden">

        {/* ══ LEFT: Conversation List ══ */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:w-80 flex-shrink-0 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col overflow-hidden"
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
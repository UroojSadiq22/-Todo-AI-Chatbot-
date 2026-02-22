// /**
//  * ChatInterface component
//  * Feature: 003-chatkit-frontend-integration
//  * User Stories 1 & 2: Chat Interface with Send/Receive
//  */

// 'use client';

// import { useState, FormEvent, KeyboardEvent, useRef, useEffect } from 'react';
// import { useChat } from '@/hooks/useChat';
// import { ChatMessage } from './ChatMessage';

// // Rate limiter class
// class RateLimiter {
//   private timestamps: number[] = [];

//   canMakeRequest(maxRequests: number, windowMs: number): boolean {
//     const now = Date.now();
//     this.timestamps = this.timestamps.filter(t => now - t < windowMs);

//     if (this.timestamps.length >= maxRequests) {
//       return false;
//     }

//     this.timestamps.push(now);
//     return true;
//   }

//   getTimeUntilNextRequest(maxRequests: number, windowMs: number): number {
//     if (this.timestamps.length < maxRequests) {
//       return 0;
//     }

//     const oldestTimestamp = this.timestamps[0];
//     return Math.ceil((windowMs - (Date.now() - oldestTimestamp)) / 1000);
//   }
// }

// const rateLimiter = new RateLimiter();
// const MAX_MESSAGE_LENGTH = 5000;
// const RATE_LIMIT_MAX = 10;
// const RATE_LIMIT_WINDOW = 60000; // 1 minute

// export default function ChatInterface({ isFloating = false }: { isFloating?: boolean }) {
//   const [inputValue, setInputValue] = useState('');
//   const [rateLimitError, setRateLimitError] = useState<string | null>(null);
//   const { messages, isLoading, error, sendMessage, clearError } = useChat();
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   // Auto-scroll to bottom when new messages arrive
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();

//     // Clear rate limit error when user tries again
//     setRateLimitError(null);

//     // Sanitize input: trim whitespace
//     const sanitizedMessage = inputValue.trim();

//     // Validate: check if empty
//     if (!sanitizedMessage) {
//       return;
//     }

//     // Validate: check message length
//     if (sanitizedMessage.length > MAX_MESSAGE_LENGTH) {
//       setRateLimitError(`Message is too long. Maximum ${MAX_MESSAGE_LENGTH} characters allowed.`);
//       return;
//     }

//     // Check rate limit
//     if (!rateLimiter.canMakeRequest(RATE_LIMIT_MAX, RATE_LIMIT_WINDOW)) {
//       const waitTime = rateLimiter.getTimeUntilNextRequest(RATE_LIMIT_MAX, RATE_LIMIT_WINDOW);
//       setRateLimitError(`You're sending messages too quickly. Please wait ${waitTime} seconds.`);
//       return;
//     }

//     // Don't send if already loading
//     if (isLoading) return;

//     await sendMessage(sanitizedMessage);
//     setInputValue(''); // Clear input after successful send
//   };

//   const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
//     // Submit on Enter (without Shift)
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmit(e as any);
//     }
//     // Allow Shift+Enter for new line (default textarea behavior)
//   };


//   return (
//     <div className={`flex flex-col ${isFloating ? 'h-full' : 'h-[calc(100vh-12rem)]'} bg-white rounded-lg shadow`}>
//       {/* Message Display Area */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-4">
//         {messages.length === 0 ? (
//           /* Empty State */
//           <div className="flex items-center justify-center h-full">
//             <div className="text-center text-gray-400">
//               <svg
//                 className="mx-auto h-12 w-12 mb-4"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
//                 />
//               </svg>
//               <p className="text-lg font-medium">Start a conversation</p>
//               <p className="text-sm mt-1">Type a message below to begin chatting with your AI assistant</p>
//             </div>
//           </div>
//         ) : (
//           /* Messages */
//           <>
//             {messages.map((message, index) => (
//               <ChatMessage key={index} message={message} />
//             ))}

//             {/* Loading Indicator */}
//             {isLoading && (
//               <div className="flex justify-start">
//                 <div className="bg-gray-200 rounded-lg p-3">
//                   <div className="flex space-x-2">
//                     <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
//                     <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
//                     <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Scroll anchor */}
//             <div ref={messagesEndRef} />
//           </>
//         )}
//       </div>

//       {/* Rate Limit Error Display */}
//       {rateLimitError && (
//         <div className="border-t border-yellow-200 bg-yellow-50 p-3 mx-4">
//           <div className="flex items-start justify-between">
//             <div className="flex-1">
//               <p className="text-sm font-medium text-yellow-800">Rate Limit</p>
//               <p className="text-sm text-yellow-600 mt-1">{rateLimitError}</p>
//             </div>
//             <button
//               onClick={() => setRateLimitError(null)}
//               className="text-yellow-400 hover:text-yellow-600"
//             >
//               <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Error Display */}
//       {error && (
//         <div className="border-t border-red-200 bg-red-50 p-3 mx-4">
//           <div className="flex items-start justify-between">
//             <div className="flex-1">
//               <p className="text-sm font-medium text-red-800">Error</p>
//               <p className="text-sm text-red-600 mt-1">{error.message}</p>
//               {error.retryable && (
//                 <button
//                   onClick={() => clearError()}
//                   className="mt-2 text-xs text-red-700 underline hover:text-red-800"
//                 >
//                   Dismiss
//                 </button>
//               )}
//             </div>
//             <button
//               onClick={() => clearError()}
//               className="text-red-400 hover:text-red-600"
//             >
//               <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Input Area */}
//       <div className="border-t border-gray-200 p-4">
//         <form onSubmit={handleSubmit} className="flex gap-2">
//           <textarea
//             value={inputValue}
//             onChange={(e) => setInputValue(e.target.value)}
//             onKeyDown={handleKeyDown}
//             placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
//             className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[60px] max-h-[200px]"
//             rows={2}
//             disabled={isLoading}
//             maxLength={MAX_MESSAGE_LENGTH}
//           />
//           <button
//             type="submit"
//             disabled={!inputValue.trim() || isLoading}
//             className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium self-end"
//           >
//             {isLoading ? 'Sending...' : 'Send'}
//           </button>
//         </form>
//         <div className="flex justify-between items-center mt-2">
//           <p className="text-xs text-gray-500">
//             Press Enter to send, Shift+Enter for a new line
//           </p>
//           {inputValue.length > 4000 && (
//             <p className={`text-xs ${inputValue.length > MAX_MESSAGE_LENGTH ? 'text-red-500' : 'text-yellow-600'}`}>
//               {inputValue.length}/{MAX_MESSAGE_LENGTH}
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }














"use client";

import { useState, FormEvent, KeyboardEvent, useRef, useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import { ChatMessage } from "./ChatMessage";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, AlertCircle, Clock } from "lucide-react";

/* ── Rate limiter ── */
class RateLimiter {
  private timestamps: number[] = [];
  canMakeRequest(max: number, windowMs: number): boolean {
    const now = Date.now();
    this.timestamps = this.timestamps.filter((t) => now - t < windowMs);
    if (this.timestamps.length >= max) return false;
    this.timestamps.push(now);
    return true;
  }
  getWaitSeconds(max: number, windowMs: number): number {
    if (this.timestamps.length < max) return 0;
    return Math.ceil((windowMs - (Date.now() - this.timestamps[0])) / 1000);
  }
}

const rateLimiter    = new RateLimiter();
const MAX_LENGTH     = 5000;
const RATE_MAX       = 10;
const RATE_WINDOW    = 60_000;

export default function ChatInterface({ isFloating = false }: { isFloating?: boolean }) {
  const [input,          setInput]          = useState("");
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);
  const { messages, isLoading, error, sendMessage, clearError } = useChat();
  const bottomRef  = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  /* Auto-resize textarea */
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }, [input]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setRateLimitError(null);
    const msg = input.trim();
    if (!msg || isLoading) return;
    if (msg.length > MAX_LENGTH) {
      setRateLimitError(`Max ${MAX_LENGTH} characters allowed.`);
      return;
    }
    if (!rateLimiter.canMakeRequest(RATE_MAX, RATE_WINDOW)) {
      const wait = rateLimiter.getWaitSeconds(RATE_MAX, RATE_WINDOW);
      setRateLimitError(`Too fast! Wait ${wait}s before sending again.`);
      return;
    }
    await sendMessage(msg);
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const overLimit = input.length > MAX_LENGTH;
  const nearLimit = input.length > 4000;

  return (
    <div className={`flex flex-col ${isFloating ? "h-full" : "h-[calc(100vh-10rem)]"} bg-slate-50`}>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scroll-smooth">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full text-center gap-4 pb-8"
          >
            <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-200">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-slate-800 font-bold text-base">AuraTask AI</p>
              <p className="text-slate-400 text-sm mt-1 max-w-[220px] leading-relaxed">
                Ask me anything about your tasks, productivity, or plans!
              </p>
            </div>
            {/* Suggestion chips */}
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {["What tasks are pending?", "Help me prioritize", "Summarize my progress"].map((s) => (
                <button key={s} onClick={() => setInput(s)}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 rounded-full text-xs font-semibold text-slate-600 transition-all">
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <>
            {messages.map((message, i) => (
              <ChatMessage key={i} message={message} />
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1.5">
                  {[0, 0.15, 0.3].map((delay, i) => (
                    <motion.div key={i}
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8, delay }}
                      className="w-2 h-2 bg-violet-400 rounded-full"
                    />
                  ))}
                </div>
              </motion.div>
            )}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* ── Alerts ── */}
      <AnimatePresence>
        {(rateLimitError || error) && (
          <motion.div
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`mx-4 mb-2 px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
              rateLimitError
                ? "bg-amber-50 border border-amber-200 text-amber-700"
                : "bg-rose-50 border border-rose-200 text-rose-600"
            }`}
          >
            {rateLimitError ? <Clock size={13}/> : <AlertCircle size={13}/>}
            <span className="flex-1">{rateLimitError ?? error?.message}</span>
            <button onClick={() => { setRateLimitError(null); clearError?.(); }}
              className="opacity-60 hover:opacity-100 text-lg leading-none">×</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Input ── */}
      <div className="px-4 pb-4 pt-2 flex-shrink-0">
        <form onSubmit={handleSubmit}
          className="flex items-end gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm focus-within:border-violet-300 focus-within:shadow-violet-100 focus-within:shadow-md transition-all">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything… (Enter to send)"
            rows={1}
            disabled={isLoading}
            maxLength={MAX_LENGTH}
            className="flex-1 resize-none bg-transparent text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none leading-relaxed max-h-[120px] disabled:opacity-50"
          />

          {/* Char counter */}
          {nearLimit && (
            <span className={`text-[10px] font-bold self-end pb-0.5 ${overLimit ? "text-rose-500" : "text-amber-500"}`}>
              {input.length}/{MAX_LENGTH}
            </span>
          )}

          <motion.button
            type="submit"
            disabled={!input.trim() || isLoading || overLimit}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.93 }}
            className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-violet-200 disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0 transition-opacity"
          >
            <Send className="w-3.5 h-3.5" />
          </motion.button>
        </form>

        <p className="text-[10px] text-slate-300 font-medium text-center mt-2">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
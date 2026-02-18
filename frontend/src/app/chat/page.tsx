'use client';

import React, { useState } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Send, Sparkles, Bot, 
  User, Zap, TrendingUp, Clock
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI assistant. I can help you manage tasks, answer questions, and provide productivity tips. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAIResponse(inputValue),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('task') || lowerInput.includes('todo')) {
      return "I can help you with task management! You can create, view, and organize your tasks from the 'My Tasks' page. Would you like me to guide you through creating a new task?";
    } else if (lowerInput.includes('productivity') || lowerInput.includes('tips')) {
      return "Here are some productivity tips:\n\n1. Break large tasks into smaller, manageable chunks\n2. Use the Pomodoro technique (25 min work, 5 min break)\n3. Prioritize your most important tasks early in the day\n4. Take regular breaks to maintain focus\n\nWould you like more specific advice?";
    } else if (lowerInput.includes('help')) {
      return "I'm here to help! I can assist with:\n\n• Task management and organization\n• Productivity tips and strategies\n• Time management advice\n• Answering questions about the app\n\nWhat would you like to know more about?";
    } else {
      return "That's an interesting question! I'm here to help you stay productive and organized. Feel free to ask me about task management, productivity tips, or how to use this app effectively.";
    }
  };

  const quickActions = [
    { icon: <Zap size={16} />, label: "Create a task", action: "Help me create a new task" },
    { icon: <TrendingUp size={16} />, label: "Productivity tips", action: "Give me productivity tips" },
    { icon: <Clock size={16} />, label: "Time management", action: "How can I manage my time better?" },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#F8FAFC] flex">
        <div className="flex-1 px-4 md:px-10 py-8 flex flex-col">
          
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <MessageSquare className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">AI Chat Assistant</h1>
                <p className="text-slate-500 font-medium">Get help and boost your productivity</p>
              </div>
            </div>
          </header>

          {/* Chat Container */}
          <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
                      message.role === 'user' 
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600' 
                        : 'bg-gradient-to-br from-pink-500 to-purple-600'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="text-white" size={20} />
                      ) : (
                        <Bot className="text-white" size={20} />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div className={`max-w-[70%] ${message.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                      <div className={`px-6 py-4 rounded-2xl shadow-sm ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white'
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        <p className="whitespace-pre-line font-medium leading-relaxed">{message.content}</p>
                      </div>
                      <span className="text-xs text-slate-400 px-2">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-md">
                    <Bot className="text-white" size={20} />
                  </div>
                  <div className="bg-slate-100 px-6 py-4 rounded-2xl">
                    <div className="flex gap-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                        className="w-2 h-2 bg-slate-400 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                        className="w-2 h-2 bg-slate-400 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                        className="w-2 h-2 bg-slate-400 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Quick Actions */}
            {messages.length <= 1 && (
              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
                <p className="text-sm font-bold text-slate-600 mb-3">Quick Actions</p>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => setInputValue(action.action)}
                      className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:border-indigo-500 hover:text-indigo-600 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {action.icon}
                      {action.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-6 border-t border-slate-200">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500 font-medium"
                />
                <motion.button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  whileHover={{ scale: inputValue.trim() ? 1.02 : 1 }}
                  whileTap={{ scale: inputValue.trim() ? 0.98 : 1 }}
                >
                  <Send size={20} />
                  Send
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ChatPage;
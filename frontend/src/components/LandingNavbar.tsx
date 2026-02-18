// 'use client';

// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import { useAuth } from '@/context/AuthContext';
// import { Sparkles, LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
// import { useState } from 'react';

// export default function LandingNavbar() {
//   const { user, logout } = useAuth();
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   return (
//     <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
//       <div className="max-w-7xl mx-auto px-6 py-4">
//         <div className="flex items-center justify-between">
//           {/* Logo */}
//           <Link href="/" className="flex items-center gap-2 group">
//             <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
//               <Sparkles className="w-5 h-5 text-white" />
//             </div>
//             <span className="text-2xl font-black tracking-tight">
//               Aura<span className="text-purple-600">Task</span>
//             </span>
//           </Link>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center gap-8">
//             <Link href="#features" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
//               Features
//             </Link>
//             <Link href="#how-it-works" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
//               How it Works
//             </Link>
//             <Link href="#pricing" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
//               Pricing
//             </Link>
//             <Link href="#about" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
//               About
//             </Link>
//             <Link href="#contact" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
//               Contact
//             </Link>
//           </div>

//           {/* Auth Buttons */}
//           <div className="hidden md:flex items-center gap-4">
//             {user ? (
//               <>
//                 {/* Go to Dashboard Button (when logged in) */}
//                 <Link href="/dashboard">
//                   <motion.button
//                     className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl hover:shadow-purple-300 transition-all"
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     <LayoutDashboard className="w-4 h-4" />
//                     Dashboard
//                   </motion.button>
//                 </Link>

//                 {/* Logout Button */}
//                 <motion.button
//                   onClick={logout}
//                   className="flex items-center gap-2 px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-bold hover:border-rose-300 hover:text-rose-600 transition-all"
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   <LogOut className="w-4 h-4" />
//                   Logout
//                 </motion.button>
//               </>
//             ) : (
//               <>
//                 {/* Login Button */}
//                 <Link href="/login">
//                   <motion.button
//                     className="px-6 py-3 text-slate-700 font-bold hover:text-slate-900 transition-colors"
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     Login
//                   </motion.button>
//                 </Link>

//                 {/* Register Button */}
//                 <Link href="/register">
//                   <motion.button
//                     className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-indigo-600 transition-all shadow-lg"
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     Get Started
//                   </motion.button>
//                 </Link>
//               </>
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             className="md:hidden p-2"
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//           >
//             {mobileMenuOpen ? (
//               <X className="w-6 h-6 text-slate-700" />
//             ) : (
//               <Menu className="w-6 h-6 text-slate-700" />
//             )}
//           </button>
//         </div>

//         {/* Mobile Menu */}
//         {mobileMenuOpen && (
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="md:hidden mt-6 pb-6 space-y-4"
//           >
//             <Link href="#features" className="block text-slate-600 hover:text-slate-900 font-medium py-2">
//               Features
//             </Link>
//             <Link href="#how-it-works" className="block text-slate-600 hover:text-slate-900 font-medium py-2">
//               How it Works
//             </Link>
//             <Link href="#pricing" className="block text-slate-600 hover:text-slate-900 font-medium py-2">
//               Pricing
//             </Link>
//             <Link href="#about" className="block text-slate-600 hover:text-slate-900 font-medium py-2">
//               About
//             </Link>
//             <Link href="#contact" className="block text-slate-600 hover:text-slate-900 font-medium py-2">
//               Contact
//             </Link>

//             <div className="pt-4 space-y-3">
//               {user ? (
//                 <>
//                   <Link href="/dashboard" className="block">
//                     <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold">
//                       <LayoutDashboard className="w-4 h-4" />
//                       Dashboard
//                     </button>
//                   </Link>
//                   <button
//                     onClick={logout}
//                     className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-bold"
//                   >
//                     <LogOut className="w-4 h-4" />
//                     Logout
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <Link href="/login" className="block">
//                     <button className="w-full px-6 py-3 text-slate-700 border-2 border-slate-200 rounded-xl font-bold">
//                       Login
//                     </button>
//                   </Link>
//                   <Link href="/register" className="block">
//                     <button className="w-full px-6 py-3 bg-slate-900 text-white rounded-xl font-bold">
//                       Get Started
//                     </button>
//                   </Link>
//                 </>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </div>
//     </nav>
//   );
// }





"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Menu, X, LogOut, User, Sparkles, LayoutDashboard } from 'lucide-react';
import { isAuthenticated, getCurrentUser } from '../services/auth';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();



useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    console.log('🔵 Navbar State:', { user, isAuthenticated });
  }, [user, isAuthenticated]);

  const displayName = user?.name || user?.email?.split('@')[0] || 'User';

  

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
      isScrolled ? 'bg-white/70 backdrop-blur-xl border-b border-indigo-50 py-3' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-900">
            Aura<span className="text-purple-400 font-extrabold text-[22px]">Task</span>
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden lg:flex items-center gap-10">
          <div className="flex gap-8 text-sm font-bold text-slate-500">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="hover:text-indigo-600 transition-colors uppercase tracking-widest text-[11px]">
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 border-l border-slate-200 pl-8">
            {user && isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="text-sm font-bold text-slate-700 hover:text-indigo-600 flex items-center gap-2">
                   <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
                  <User className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-indigo-700">{user.name}</span>
                </div>
                <button onClick={logout} className="text-slate-400 hover:text-rose-500 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-indigo-600">Sign In</Link>
                <Link href="/register" className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-xl hover:bg-indigo-600 transition-all">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 bg-white rounded-xl shadow-sm border border-slate-100">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
            className="absolute top-full left-0 w-full bg-white border-b border-slate-100 p-6 lg:hidden flex flex-col gap-4 shadow-2xl"
          >
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="text-lg font-bold text-slate-700">{link.name}</Link>
            ))}
            <hr />
            {user && isAuthenticated ? (
              <Link href="/dashboard" className="p-4 bg-indigo-50 rounded-2xl text-indigo-600 font-bold">Go to Dashboard</Link>
            ) : (
              <Link href="/register" className="p-4 bg-indigo-600 rounded-2xl text-white text-center font-bold">Start for Free</Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
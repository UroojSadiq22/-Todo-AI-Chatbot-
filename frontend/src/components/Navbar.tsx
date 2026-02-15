// /** Responsive Navbar component for the Todo application. */
// "use client";
// import React from 'react';
// import Link from 'next/link';
// import { useAuth } from '../context/AuthContext';
// import { isAuthenticated, logout, getCurrentUser } from '../services/auth';


// const Navbar: React.FC = () => {
//   const { user, loading } = useAuth();

//   const handleLogout = () => {
//     logout();
//   };

//   return (
//     <nav className="bg-indigo-600 text-white shadow-md">
//       <div className="max-w-6xl mx-auto px-4">
//         <div className="flex justify-between h-16">
//           <div className="flex items-center">
//             <Link href="/" className="flex-shrink-0 flex items-center">
//               <span className="text-xl font-bold">Todo App</span>
//             </Link>
//             <div className="hidden md:ml-6 md:flex md:space-x-8">
//               <Link
//                 href="/dashboard"
//                 className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-white hover:border-white"
//               >
//                 Dashboard
//               </Link>
//             </div>
//           </div>

//           <div className="flex items-center">
//             {!loading && !isAuthenticated() ? (
//               <div className="flex space-x-4">
//                 <Link
//                   href="/login"
//                   className="text-sm font-medium text-white hover:text-indigo-200"
//                 >
//                   Sign in
//                 </Link>
//                 <Link
//                   href="/register"
//                   className="ml-8 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
//                 >
//                   Sign up
//                 </Link>
//               </div>
//             ) : !loading && user ? (
//               <div className="flex items-center">
//                 <span className="mr-4 hidden md:block">Welcome, {user.name}</span>
//                 <button
//                   onClick={handleLogout}
//                   className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-800"
//                 >
//                   Logout
//                 </button>
//               </div>
//             ) : (
//               <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Mobile menu */}
//       <div className="md:hidden">
//         <div className="pt-2 pb-3 space-y-1 px-2">
//           {isAuthenticated() && (
//             <Link
//               href="/dashboard"
//               className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-white hover:bg-indigo-500"
//             >
//               Dashboard
//             </Link>
//           )}
//           {!isAuthenticated() ? (
//             <>
//               <Link
//                 href="/login"
//                 className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-white hover:bg-indigo-500"
//               >
//                 Sign in
//               </Link>
//               <Link
//                 href="/register"
//                 className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-white hover:bg-indigo-500"
//               >
//                 Sign up
//               </Link>
//             </>
//           ) : (
//             <button
//               onClick={handleLogout}
//               className="w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-white hover:bg-indigo-500"
//             >
//               Logout
//             </button>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


// /** Responsive Navbar component for the Todo application. */
// "use client";
// import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { isAuthenticated, logout, getCurrentUser } from '../services/auth';

// const Navbar: React.FC = () => {
//   const [authenticated, setAuthenticated] = useState(false);
//   const [userName, setUserName] = useState('');

//   useEffect(() => {
//     // Check auth status on mount and when it changes
//     const checkAuth = () => {
//       const isAuth = isAuthenticated();
//       setAuthenticated(isAuth);
      
//       if (isAuth) {
//         const user = getCurrentUser();
//         setUserName(user?.name || user?.email?.split('@')[0] || 'User');
//       }
//     };

//     checkAuth();

//     // Re-check periodically or when window gains focus
//     window.addEventListener('focus', checkAuth);
    
//     return () => {
//       window.removeEventListener('focus', checkAuth);
//     };
//   }, []);

//   const handleLogout = () => {
//     logout();
//     setAuthenticated(false);
//     setUserName('');
//     window.location.href = '/';
//   };

//   return (
//     <nav className="bg-indigo-600 text-white shadow-md">
//       <div className="max-w-6xl mx-auto px-4">
//         <div className="flex justify-between h-16">
//           <div className="flex items-center">
//             <Link href="/" className="flex-shrink-0 flex items-center">
//               <span className="text-xl font-bold">Todo App</span>
//             </Link>
//             {/* <div className="hidden md:ml-6 md:flex md:space-x-8">
//               <Link
//                 href="/dashboard"
//                 className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-white hover:border-white"
//               >
//                 Dashboard
//               </Link>
//             </div> */}
//           </div>

//           <div className="flex items-center">
//             {authenticated ? (
//               <div className="flex items-center">
//                 <span className="mr-4 hidden md:block">Welcome, {userName}</span>
//                 <button
//                   onClick={handleLogout}
//                   className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-800"
//                 >
//                   Logout
//                 </button>
//               </div>
//             ) : (
//               <div className="flex space-x-4">
//                 <Link
//                   href="/login"
//                   className="text-sm font-medium text-white hover:text-indigo-200"
//                 >
//                   Sign in
//                 </Link>
//                 <Link
//                   href="/register"
//                   className="ml-8 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
//                 >
//                   Sign up
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Mobile menu */}
//       <div className="md:hidden">
//         <div className="pt-2 pb-3 space-y-1 px-2">
//           {authenticated && (
//             <Link
//               href="/dashboard"
//               className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-white hover:bg-indigo-500"
//             >
//               Dashboard
//             </Link>
//           )}
//           {!authenticated ? (
//             <>
//               <Link
//                 href="/login"
//                 className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-white hover:bg-indigo-500"
//               >
//                 Sign in
//               </Link>
//               <Link
//                 href="/register"
//                 className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-white hover:bg-indigo-500"
//               >
//                 Sign up
//               </Link>
//             </>
//           ) : (
//             <button
//               onClick={handleLogout}
//               className="w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-white hover:bg-indigo-500"
//             >
//               Logout
//             </button>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;









// "use client";
// import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Bot, Menu, X, LogOut, User, LayoutDashboard, LogIn } from 'lucide-react';
// import { isAuthenticated, logout, getCurrentUser } from '../services/auth';

// const Navbar: React.FC = () => {
//   const [authenticated, setAuthenticated] = useState(false);
//   const [userName, setUserName] = useState('');
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isOpen, setIsOpen] = useState(false);

//   useEffect(() => {
//     const checkAuth = () => {
//       const isAuth = isAuthenticated();
//       setAuthenticated(isAuth);
//       if (isAuth) {
//         const user = getCurrentUser();
//         setUserName(user?.name || user?.email?.split('@')[0] || 'User');
//       }
//     };

//     checkAuth();
//     const handleScroll = () => setIsScrolled(window.scrollY > 20);
    
//     window.addEventListener('scroll', handleScroll);
//     window.addEventListener('focus', checkAuth);
    
//     return () => {
//       window.removeEventListener('scroll', handleScroll);
//       window.removeEventListener('focus', checkAuth);
//     };
//   }, []);

//   const handleLogout = () => {
//     logout();
//     setAuthenticated(false);
//     window.location.href = '/';
//   };

//   return (
//     <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
//       isScrolled ? 'bg-white/80 backdrop-blur-2xl border-b border-slate-200 shadow-sm py-3' : 'bg-transparent py-5'
//     }`}>
//       <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
//         {/* LOGO */}
//         <Link href="/" className="flex items-center gap-2 group">
//           <motion.div 
//             whileHover={{ rotate: 10 }}
//             className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200"
//           >
//             <Bot className="text-white w-6 h-6" />
//           </motion.div>
//           <span className="text-xl font-bold tracking-tight text-slate-900">
//             Speckit<span className="text-indigo-600">Plus</span>
//           </span>
//         </Link>

//         {/* DESKTOP MENU */}
//         <div className="hidden md:flex items-center gap-8">
//           {authenticated ? (
//             <>
//               <Link href="/dashboard" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-2">
//                 <LayoutDashboard className="w-4 h-4" /> Dashboard
//               </Link>
//               <div className="h-4 w-px bg-slate-200"></div>
//               <div className="flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-full border border-slate-200">
//                 <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
//                   <User className="w-3.5 h-3.5 text-indigo-600" />
//                 </div>
//                 <span className="text-sm font-bold text-slate-700">{userName}</span>
//               </div>
//               <button 
//                 onClick={handleLogout}
//                 className="p-2 text-slate-400 hover:text-red-500 transition-colors"
//                 title="Logout"
//               >
//                 <LogOut className="w-5 h-5" />
//               </button>
//             </>
//           ) : (
//             <div className="flex items-center gap-4">
//               <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-indigo-600 px-4 py-2">
//                 Sign in
//               </Link>
//               <Link href="/register" className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-md active:scale-95">
//                 Create Account
//               </Link>
//             </div>
//           )}
//         </div>

//         {/* MOBILE TOGGLE */}
//         <button 
//           className="md:hidden p-2 text-slate-900 bg-slate-100 rounded-lg"
//           onClick={() => setIsOpen(!isOpen)}
//         >
//           {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//         </button>
//       </div>

//       {/* MOBILE MENU OVERLAY */}
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: 'auto' }}
//             exit={{ opacity: 0, height: 0 }}
//             className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
//           >
//             <div className="px-6 py-8 flex flex-col gap-6">
//               {authenticated ? (
//                 <>
//                   <Link href="/dashboard" onClick={() => setIsOpen(false)} className="text-lg font-bold flex items-center gap-3">
//                     <LayoutDashboard /> Dashboard
//                   </Link>
//                   <div className="h-px bg-slate-100 w-full"></div>
//                   <div className="flex items-center gap-3">
//                     <User className="text-indigo-600" />
//                     <span className="font-bold">{userName}</span>
//                   </div>
//                   <button 
//                     onClick={handleLogout}
//                     className="flex items-center gap-3 text-red-500 font-bold pt-4"
//                   >
//                     <LogOut /> Logout
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <Link href="/login" onClick={() => setIsOpen(false)} className="text-lg font-bold flex items-center gap-3">
//                     <LogIn /> Sign in
//                   </Link>
//                   <Link 
//                     href="/register" 
//                     onClick={() => setIsOpen(false)}
//                     className="bg-indigo-600 text-white text-center py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200"
//                   >
//                     Get Started Free
//                   </Link>
//                 </>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </nav>
//   );
// };

// export default Navbar;















"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Menu, X, LogOut, User, Sparkles, LayoutDashboard } from 'lucide-react';
import { isAuthenticated, logout, getCurrentUser } from '../services/auth';

const Navbar = () => {
  const [auth, setAuth] = useState({ isAuth: false, name: '' });
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const check = () => {
      const isAuth = isAuthenticated();
      if (isAuth) {
        const user = getCurrentUser();
        setAuth({ isAuth: true, name: user?.name || user?.email?.split('@')[0] || 'User' });
      }
    };
    check();
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  

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
            {auth.isAuth ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="text-sm font-bold text-slate-700 hover:text-indigo-600 flex items-center gap-2">
                   <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
                  <User className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-indigo-700">{auth.name}</span>
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
            {auth.isAuth ? (
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
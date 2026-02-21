'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  LayoutDashboard, 
  CheckSquare, 
  MessageSquare,
  User,
  Settings,
  LogOut,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  BarChart2
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DashboardNavbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
      if (window.innerWidth < 1024) {
        setCollapsed(false); // Reset collapse on mobile
        setMobileOpen(false); // Close mobile menu
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navItems = [
    { icon: Home, label: 'Go to Home', href: '/', color: 'text-blue-600' },
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', color: 'text-indigo-600' },
    { icon: CheckSquare, label: 'My Tasks', href: '/todos', color: 'text-purple-600' },
    { icon: BarChart2, label: 'Analytics', href: '/analytics', color: 'text-purple-600' },
    { icon: MessageSquare, label: 'AI Chat', href: '/chat', color: 'text-pink-600' },
  ];

  const bottomNavItems = [
    { icon: User, label: 'Profile', href: '/profile', color: 'text-slate-600' },
    { icon: Settings, label: 'Settings', href: '/settings', color: 'text-slate-600' },
  ];

  const handleNavClick = () => {
    if (isMobile) {
      setMobileOpen(false); // Close mobile menu after click
    }
  };

  return (
    <>

     {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="fixed top-4 left-4 z-50 p-3 bg-white rounded-xl shadow-lg border border-slate-200 lg:hidden"
        >
          {mobileOpen ? (
            <X className="w-6 h-6 text-slate-700" />
          ) : (
            <Menu className="w-6 h-6 text-slate-700" />
          )}
        </button>
      )}
      
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobile && mobileOpen && (
           
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          />
       
        )} </AnimatePresence>
      {/* Sidebar */}
      <motion.div
        className={`fixed left-0 top-0 h-screen bg-white border-r border-slate-200 flex flex-col z-40 ${
          isMobile 
            ? mobileOpen ? 'translate-x-0' : '-translate-x-full'
            : collapsed ? 'w-20' : 'w-64'
        }`}
        style={{
          width: isMobile ? '280px' : collapsed ? '80px' : '256px'
        }}
        animate={{
          width: isMobile ? '280px' : collapsed ? 80 : 256,
          x: isMobile ? (mobileOpen ? 0 : -280) : 0
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Logo & Collapse Button */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          {(!collapsed || isMobile) && (
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight">
                Aura<span className="text-purple-600">Task</span>
              </span>
            </Link>
          )}
          
          {collapsed && !isMobile && (
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg mx-auto">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        {/* User Profile */}
        {(!collapsed || isMobile) && user && (
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {user.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="font-bold text-slate-900 truncate">{user.name}</p>
                <p className="text-xs text-slate-500">Pro Member</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? item.color : ''}`} />
                  {(!collapsed || isMobile) && <span className="truncate">{item.label}</span>}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Navigation */}
        <div className="px-4 p-2 border-t border-slate-200">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {(!collapsed || isMobile) && <span className="truncate">{item.label}</span>}
                </motion.div>
              </Link>
            );
          })}

          {/* Logout Button */}
          <motion.button
            onClick={() => {
              logout();
              handleNavClick();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-rose-600 hover:bg-rose-50 transition-all"
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {(!collapsed || isMobile) && <span className="truncate">Logout</span>}
          </motion.button>
        </div>

          {/* Desktop Collapse Toggle (Hidden on Mobile) */}
        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-20 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors shadow-lg"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4 text-slate-600" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            )}
          </button>
        )}
      </motion.div>

      {/* Spacer for content (to prevent overlap) */}
      <div className={`${collapsed ? 'w-20' : 'w-64'} flex-shrink-0`} />
    </>
  );
}
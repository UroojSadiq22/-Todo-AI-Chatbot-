"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
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
  BarChart2,
} from "lucide-react";
import { useEffect, useState } from "react";

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
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const navItems = [
    { icon: Home, label: "Home", href: "/", accent: "#6366f1" },
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      href: "/dashboard",
      accent: "#7c3aed",
    },
    { icon: CheckSquare, label: "My Tasks", href: "/todos", accent: "#8b5cf6" },
    {
      icon: BarChart2,
      label: "Analytics",
      href: "/analytics",
      accent: "#0ea5e9",
    },
    {
      icon: MessageSquare,
      label: "Chat History",
      href: "/chat",
      accent: "#06b6d4",
    },
  ];

  const bottomNavItems = [
    { icon: User, label: "Profile", href: "/profile", color: "text-slate-600" },
    {
      icon: Settings,
      label: "Settings",
      href: "/settings",
      color: "text-slate-600",
    },
  ];

  const close = () => {
    if (isMobile) {
      setMobileOpen(false); // Close mobile menu after click
    }
  };
  const initial = (user?.name || user?.email || "U")[0].toUpperCase();

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
        )}{" "}
      </AnimatePresence>
      {/* Sidebar */}
      <motion.div
        className={`fixed left-0 top-0 h-full bg-white border-r border-slate-200 flex flex-col z-40 ${
          isMobile
            ? mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : collapsed
              ? "w-20"
              : "w-64"
        }`}
        style={{
          width: isMobile ? "280px" : collapsed ? "80px" : "256px",
        }}
        animate={{
          width: isMobile ? "280px" : collapsed ? 80 : 256,
          x: isMobile ? (mobileOpen ? 0 : -280) : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Logo & Collapse Button */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          {(!collapsed || isMobile) && (
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
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

        {/* ── User card ── */}
        {(!collapsed || isMobile) && user && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-3 mt-4 p-3 rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-sm flex-shrink-0">
                {initial}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-800 truncate leading-tight">
                  {user.name || "Champion"}
                </p>
                <p className="text-[10px] font-semibold text-violet-500 uppercase tracking-wide">
                  Pro Member
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {collapsed && !isMobile && user && (
          <div className="mx-auto mt-4 w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-sm">
            {initial}
          </div>
        )}

        {/* ── Main nav ── */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ icon: Icon, label, href, accent }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} onClick={close}>
                <motion.div
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.97 }}
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all cursor-pointer group ${
                    active
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-200 ml-1"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  {/* active left bar */}
                  {active && (
                    <motion.div
                      layoutId="activeBar"
                      className="absolute -left-3 top-2 bottom-2 w-1 rounded-r-full bg-violet-400"
                    />
                  )}
                  <Icon
                    size={18}
                    className="flex-shrink-0"
                    style={!active ? { color: accent } : {}}
                  />
                  {(!collapsed || isMobile) && (
                    <span className="text-sm font-semibold truncate">
                      {label}
                    </span>
                  )}
                  {collapsed && !isMobile && (
                    <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
                      {label}
                    </div>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* ── Divider ── */}
        <div className="mx-4 h-px bg-slate-100" />

        {/* ── Bottom nav ── */}
        <div className="px-3 py-3 space-y-0.5">
          {bottomNavItems.map(({ icon: Icon, label, href }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} onClick={close}>
                <motion.div
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all cursor-pointer group ${
                    active
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-400 hover:bg-slate-50 hover:text-slate-700"
                  }`}
                >
                  <Icon size={17} className="flex-shrink-0" />
                  {(!collapsed || isMobile) && (
                    <span className="text-sm font-semibold truncate">
                      {label}
                    </span>
                  )}
                  {collapsed && !isMobile && (
                    <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
                      {label}
                    </div>
                  )}
                </motion.div>
              </Link>
            );
          })}

          {/* Logout */}
          <motion.button
            onClick={() => {
              logout();
              close();
            }}
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition-all group"
          >
            <LogOut size={17} className="flex-shrink-0" />
            {(!collapsed || isMobile) && (
              <span className="text-sm font-semibold">Logout</span>
            )}
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
      <div className={`${collapsed ? "w-20" : "w-64"} flex-shrink-0`} />
    </>
  );
}

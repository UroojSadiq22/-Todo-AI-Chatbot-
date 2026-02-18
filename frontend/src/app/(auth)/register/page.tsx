/** Register page for the Todo application. */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { register } from "../../../services/auth";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Loader2,
  ChevronLeft,
  CheckCircle2,
  UserPlus,
} from "lucide-react";

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const features = [
    "AI-Powered Task Categorization",
    "Real-time Collaboration",
    "Smart Reminders & Notifications",
    "Seamless Cross-platform Sync",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await register(username, email, password);
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white md:pt-0 pt-14">
      {/* Back to Home Link */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-indigo-600 transition-colors bg-white/80 backdrop-blur px-4 py-2 rounded-full border border-gray-100 shadow-sm"
      >
        <ChevronLeft size={16} /> Back to Home
      </Link>

      {/* Left Side: Marketing/Features (Hidden on Mobile) */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-tr from-purple-700 via-indigo-600 to-blue-500 items-center justify-center p-12 relative overflow-hidden">
        {/* Animated Background Shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-white max-w-md"
        >
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl w-fit mb-8 border border-white/20">
            <UserPlus size={32} className="text-white" />
          </div>
          <h1 className="lg:text-5xl md:text-4xl font-black mb-6 leading-tight tracking-tight">
            Level up your productivity.
          </h1>
          <p className="text-indigo-100 text-lg mb-10 font-medium">
            Create your free account and start organizing your life with our
            intelligent todo system.
          </p>

          <ul className="space-y-4">
            {features.map((feature, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-3 text-indigo-50 font-semibold"
              >
                <CheckCircle2 size={22} className="text-emerald-400" />
                {feature}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-20 relative bg-white">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-md w-full"
        >
          <div className="mb-8">
            <h2 className="text-4xl font-black text-gray-900 mb-2">
              Create Account
            </h2>
            <p className="text-gray-500 font-medium font-inter">
              Join the community of achievers.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 text-red-700 rounded-2xl text-sm border-l-4 border-red-500 font-medium"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-400 ml-1">
                Full Name
              </label>
              <div className="relative group">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors"
                  size={20}
                />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 outline-none transition-all font-medium text-gray-900"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-400 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors"
                  size={20}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 outline-none transition-all font-medium text-gray-900"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-400 ml-1">
                  Password
                </label>
                <div className="relative group">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors"
                    size={20}
                  />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 outline-none transition-all font-medium text-gray-900"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-400 ml-1">
                  Confirm
                </label>
                <div className="relative group">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors"
                    size={20}
                  />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 outline-none transition-all font-medium text-gray-900"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {/* <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  Start Organizing Now
                  <CheckCircle2 size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button> */}

            <button
              type="submit"
              disabled={loading}
              className="w-full transition-all flex items-center justify-end gap-2"
            >
              <motion.div
                className={`group relative w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold overflow-hidden cursor-pointer `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                {/* Animated Background Gradient */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
                  initial={{ x: "-100%", opacity: 0 }}
                  whileHover={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />

                {/* Shimmer Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: "200%" }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                    repeatDelay: 1,
                  }}
                />

                {/* Content */}
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      Start Now{" "}
                      <motion.span
                        className="inline-flex"
                        initial={{ x: 0, y: 0 }}
                        whileHover={{ x: 5, y: -5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CheckCircle2 className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </motion.span>
                    </>
                  )}
                </span>

                {/* Glow Effect */}
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl opacity-0 blur-xl group-hover:opacity-50 transition-opacity duration-500"
                  style={{ zIndex: -1 }}
                />
              </motion.div>
            </button>
          </form>

          <p className="mt-10 text-center text-gray-500 font-medium">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-indigo-600 hover:underline font-bold"
            >
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;

/** Login page for the Todo application. */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "../../../services/auth";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  ChevronLeft,
  Sparkles,
} from "lucide-react";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white md:pt-0 pt-14">
      {/* Back to Home Link (Floating) */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-indigo-600 transition-colors bg-white/80 backdrop-blur px-4 py-2 rounded-full border border-gray-100 shadow-sm"
      >
        <ChevronLeft size={16} /> Back to Home
      </Link>

      {/* Left Side: Visuals (Hidden on Mobile) */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute bottom-0 right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10 text-white max-w-lg"
        >
          <Sparkles className="mb-6 text-indigo-200" size={48} />
          <h1 className="lg:text-5xl md:text-4xl font-black mb-6 leading-tight">
            Master your day, one task at a time.
          </h1>
          <p className="text-indigo-100 text-lg leading-relaxed">
            Join thousands of users who manage their professional and personal
            life with our AI-powered todo suite.
          </p>
        </motion.div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <div className="mb-10">
            <h2 className="text-4xl font-black text-gray-900 mb-2">Sign In</h2>
            <p className="text-gray-500 font-medium">
              Please enter your details to login.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-2xl text-sm border-l-4 border-red-500 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase text-gray-400 ml-1">
                Email
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
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 outline-none transition-all font-medium"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold uppercase text-gray-400 ml-1">
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
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 outline-none transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>Sign In <ArrowRight size={18} /></>}
            </button> */}

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
                      Sign In{" "}
                      <motion.span
                        className="inline-flex"
                        initial={{ x: 0, y: 0 }}
                        whileHover={{ x: 5, y: -5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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

          <p className="mt-8 text-center text-gray-600 font-medium">
            New here?{" "}
            <Link
              href="/register"
              className="text-indigo-600 hover:underline font-bold"
            >
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;

"use client";
import React, { useState, useEffect } from "react";
import { easeOut, motion } from "framer-motion";
import {
  Bot,
  Sparkles,
  Zap,
  CheckCircle2,
  ArrowRight,
  Github,
  Star,
  Quote,
  HelpCircle,
  Layers,
  ShieldCheck,
  MessageSquare,
  Target,
  Brain,
  Terminal,
  Code2,
  Palette,
  Database,
  Heart,
  Coins,
  Search,
  LineSquiggle,
  Twitter,
  Linkedin,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.7, ease: easeOut },
  };

  const scaleIn = {
    initial: { opacity: 0, scale: 0.8 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: easeOut },
  };

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="bg-[#FDFEFF] text-slate-900 selection:bg-rose-100 selection:text-rose-700 font-sans">
      {/* Cursor Glow Effect */}
      <div
        className="pointer-events-none fixed inset-0 z-50"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.08), transparent 40%)`,
        }}
      />
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f15_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

        {/* Glowing Orbs */}
        <div className="absolute top-1/4 -left-40 w-96 h-96 bg-blue-500/30 rounded-full blur-[128px] animate-pulse"></div>
        <div
          className="absolute bottom-1/4 -right-40 w-96 h-96 bg-purple-500/30 rounded-full blur-[128px] animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[150px]"></div>

        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-50/50 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-[-10%] w-[50%] h-[50%] bg-rose-50/50 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative">
          <motion.div {...fadeIn}>
            {/* Live MCP Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-[0.15em] mb-10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              AI Agent Online
            </div>

            <h1 className="text-6xl md:text-[5.5rem] font-[1000] text-slate-900 mb-8 leading-[0.95] tracking-[-0.04em]">
              Your tasks, <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-500 to-rose-500 animate-gradient">
                evolved with AI.
              </span>
            </h1>

            <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
              Talk naturally. AuraTask's AI understands your intentions and
              organizes everything instantly, like having a personal assistant
              who never sleeps.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link
                href="/chat"
                className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white hover:bg-indigo-600 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-2xl shadow-indigo-100 group"
              >
                Start Chatting{" "}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/register"
                className="w-full sm:w-auto px-10 py-5 bg-white border border-slate-200 hover:border-rose-300 text-slate-700 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                Join AuraTask
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 md:gap-8 gap-4 md:p-12 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl border border-white/10">
            {[
              {
                label: "Response Time",
                val: "< 2s",
                icon: <Zap className="w-5 h-5" />,
              },
              {
                label: "Reliability",
                val: "99.9%",
                icon: <Target className="w-5 h-5" />,
              },
              {
                label: "Secure",
                val: "Bank-Level",
                icon: <ShieldCheck className="w-5 h-5" />,
              },
              {
                label: "AI Powered",
                val: "GROQ",
                icon: <Sparkles className="w-5 h-5" />,
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="text-center group "
                {...fadeIn}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex justify-center mb-3 text-violet-400 group-hover:text-fuchsia-400 transition-colors">
                  {stat.icon}
                </div>
                <div className="md:text-3xl text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  {stat.val}
                </div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="features" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto mb-24">
            <motion.div {...fadeIn}>
              <div className="flex flex-row items-start justify-center gap-4">
                <Sparkles className="w-7 h-7 text-gray-700 animate-pulse" />
                <h2 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-500 to-rose-500 uppercase tracking-[0.1em] mb-6 flex items-center justify-center">
                  Revolutionary Features
                </h2>
              </div>

              <p className="text-slate-500 md:text-lg leading-relaxed">
                Stop wrestling with complicated task managers. Start organizing
                effortlessly.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: <Brain className="w-10 h-10" />,
                gradient: "from-purple-500 to-pink-400",
                title: "Understands You",
                desc: "Just talk naturally! 'Remind me to call mom tomorrow at 3pm.' Our AI extracts everything and organizes it perfectly.",
                badge: "AI Powered",
              },
              {
                icon: <Zap className="w-10 h-10" />,
                gradient: "from-blue-500 to-cyan-400",
                title: "Lightning Fast",
                desc: "Powered by GROQ's ultra-fast inference. Your commands execute in under 2 seconds, every single time.",
                badge: "Instant",
              },
              {
                icon: <ShieldCheck className="w-10 h-10" />,
                gradient: "from-emerald-500 to-teal-400",
                title: "Fort Knox Security",
                desc: "Your tasks are encrypted end-to-end. We use the same security standards as banks because your privacy matters.",
                badge: "Protected",
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                {...scaleIn}
                transition={{ delay: i * 0.15 }}
                className="group relative md:p-10 p-6 rounded-[2.5rem] bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/30 hover:border-white/30 backdrop-blur-xl transition-all duration-500 hover:scale-105 overflow-hidden"
              >
                {/* Gradient Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                ></div>

                {/* Badge */}
                <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xl text-[10px] font-bold uppercase tracking-widest text-gray-500 border-2 border-white/30">
                  {f.badge}
                </div>
                <div
                  className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                >
                  <div className="text-white">{f.icon}</div>
                </div>

                <h3 className="text-2xl font-black text-gray-700 mb-4 relative">
                  {f.title}
                </h3>
                <p className="text-slate-400 leading-relaxed font-medium relative">
                  {f.desc}
                </p>

                {/* Hover Glow */}
                <div
                  className={`absolute -inset-1 bg-gradient-to-r ${f.gradient} rounded-[2.5rem] opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10`}
                ></div>
              </motion.div>
            ))}
          </div>

          <div className="text-center max-w-4xl mx-auto mt-24">
            <motion.div {...fadeIn}>
              <h3 className="text-5xl md:text-7xl font-black text-gray-700 mb-8 tracking-tight leading-tight">
                Not Just Smart.
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-tr from-indigo-600  to-cyan-300">
                  Genius.
                </span>
              </h3>
              <p className="text-slate-400 md:text-xl leading-relaxed">
                The most intuitive task manager you'll ever use. No learning
                curve. Just results.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS SECTION --- */}
      <section
        id="how-it-works"
        className="md:py-32 py-24 bg-slate-50/50 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f08_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f08_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

        <div className="max-w-7xl mx-auto px-6 w-full flex flex-col items-center">
          <div className="text-center mb-24">
            <motion.div {...fadeIn}>
              <div className="flex flex-row items-start justify-center gap-2">
                <LineSquiggle className="w-7 h-7 text-gray-700 animate-pulse" />
                <h2 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-500 to-rose-500 uppercase tracking-[0.1em] mb-6 flex items-center justify-center gap-2">
                  The Pipeline
                </h2>
              </div>

              <h3 className="text-5xl md:text-7xl font-black text-gray-700 tracking-tight mb-6">
                Four Steps to
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                  Pure Magic
                </span>
              </h3>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connecting Line (Desktop Only) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent -translate-y-12"></div>

            {[
              {
                step: "01",
                title: "Sign Up",
                desc: "Create your free account in 30 seconds. No credit card needed.",
                icon: <ShieldCheck className="w-6 h-6" />,
                color: "bg-blue-600",
              },
              {
                step: "02",
                title: "Talk Naturally",
                desc: "Type or speak: 'Schedule dentist appointment next Friday at 2pm'",
                icon: <MessageSquare className="w-6 h-6" />,
                color: "bg-indigo-600",
              },
              {
                step: "03",
                title: "AI Does the Work",
                desc: "Our AI understands, organizes, and schedules everything automatically.",
                icon: <Layers className="w-6 h-6" />,
                color: "bg-purple-600",
              },
              {
                step: "04",
                title: "Stay Organized",
                desc: "Your dashboard updates instantly. Never miss a deadline again.",
                icon: <Zap className="w-6 h-6" />,
                color: "bg-rose-600",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                {...fadeIn}
                transition={{ delay: i * 0.1 }}
                className="relative z-10 flex flex-col items-center text-center group"
              >
                <div
                  className={`w-16 h-16 ${item.color} text-white rounded-2xl flex items-center justify-center shadow-xl mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  {item.icon}
                </div>
                <div className="text-xs font-black text-slate-300 mb-2">
                  {item.step}
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">
                  {item.title}
                </h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed px-4">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Live Demo Callout */}
          <motion.div
            {...fadeIn}
            className="mt-24 md:p-10 p-6 max-w-4xl rounded-[3rem] bg-gradient-to-br from-white/10 to-white/40 border border-white/10 backdrop-blur-xl flex flex-col md:flex-row items-center gap-10 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <Terminal className="w-12 h-12 text-white" />
            </div>

            <div className="flex-1 relative">
              <h4 className="text-3xl font-black text-gray-700 mb-4">
                Try It Live
              </h4>
              <p className="text-gray-500 font-medium mb-2">
                After logging in, type this into the AI Workspace:
              </p>
              <code className="block bg-black/50 backdrop-blur-xl px-6 py-4 rounded-2xl text-cyan-300 font-mono text-sm border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                "Add a task: Review Q1 reports by Friday 5pm high priority"
              </code>
              <p className="text-slate-400 text-sm mt-6 font-medium">
                Watch the magic happen. No buttons, no forms, no hassle.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- ABOUT ME SECTION (SHOWCASE) --- */}
      <section id="about" className="md:py-32 py-24 relative overflow-hidden">
        {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(168,85,247,0.15),transparent_60%)]"></div>
         */}
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            {/* Image Column */}
            <motion.div {...scaleIn} className="relative group ">
              {/* Decorative Elements */}
              <div className="absolute -top-6 -left-6 w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-[4rem] -z-10 group-hover:rotate-6 transition-transform duration-700"></div>
              <div className="absolute -bottom-6 -right-6 w-full h-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-[4rem] -z-10 group-hover:-rotate-3 transition-transform duration-700"></div>

              {/* Main Image Container */}
              <div className="relative w-full  bg-gradient-to-br from-slate-800 to-slate-900 rounded-[3.5rem] overflow-hidden border-4 border-white/10 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>

                {/* Placeholder - Replace with your actual image */}
                <img
                  src="/me.jpg"
                  alt="Full-Stack Developer"
                  className="w-full h-full object-cover"
                />
                {/* Floating Tech Stack Pills */}
                <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-2">
                  {["React", "Next.js", "FastAPI", "PostgreSQL", "AI/ML"].map(
                    (tech, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/20 text-white text-xs font-bold"
                      >
                        {tech}
                      </motion.div>
                    ),
                  )}
                </div>

                {/* Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-purple-500/30 via-transparent to-blue-500/30"></div>
              </div>
            </motion.div>

            {/* Content Column */}
            <motion.div {...fadeIn} className="space-y-8 ">
              <div>
                <div className="flex flex-row items-start gap-2">
                  <Heart className="w-5 h-5 text-gray-700 animate-pulse" />
                  <h2 className="text-base font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-500 to-rose-500 uppercase tracking-[0.1em] mb-6 flex items-center justify-center gap-2">
                    Crafted With Passion
                  </h2>
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-gray-700 mb-2 tracking-tight leading-tight">
                  Hi, It's{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                    Urooj Sadiq
                  </span>
                </h3>
                <h4 className="text-xl font-bold text-gray-600 mb-8">
                  Full-Stack Developer • AI Enthusiast
                </h4>

                <div className="space-y-2 text-gray-500 text-sm leading-relaxed">
                  <p>
                    I built AuraTask because I was tired of task managers that
                    felt like work themselves.
                    <span className="text-black font-bold">
                      {" "}
                      Why can't organizing be as simple as talking?
                    </span>
                  </p>
                  <p>
                    By combining{" "}
                    <span className="text-cyan-400 font-bold">
                      GROQ's blazing-fast AI
                    </span>{" "}
                    with a smart backend, I created something that actually
                    feels helpful not like another tool to learn.
                  </p>
                  <p className="text-sm italic text-slate-400">
                    "Technology should work for you, not the other way around."
                  </p>
                </div>
              </div>

              {/* Skills Grid */}
              <div className="grid md:grid-cols-2 gap-2">
                {[
                  {
                    icon: <Code2 />,
                    label: "Backend Architecture",
                    tech: "FastAPI • Python",
                  },
                  {
                    icon: <Palette />,
                    label: "Frontend Mastery",
                    tech: "Next.js 14 • React",
                  },
                  {
                    icon: <Database />,
                    label: "Database Design",
                    tech: "PostgreSQL",
                  },
                  {
                    icon: <Brain />,
                    label: "AI Integration",
                    tech: "LangChain • GROQ",
                  },
                ].map((skill, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-3 flex flex-row gap-4 items-center rounded-2xl bg-white/5 border border-black/50 backdrop-blur-xl hover:bg-white/10 transition-all group"
                  >
                    <div className="flex items-center gap-3 text-cyan-400 group-hover:text-cyan-300 transition-colors">
                      {skill.icon}
                    </div>
                    <div className="flex flex-col mb-2 text-cyan-400 group-hover:text-cyan-300 transition-colors">
                      <span className="font-black text-sm">{skill.label}</span>
                      <p className="text-slate-400 text-xs font-medium">
                        {skill.tech}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* CTA Buttons */}

              <div className="flex flex-col sm:flex-row flex-wrap w-full gap-5">
                <Link
                  href="https://uroojsadiq.vercel.app"
                  className="w-full sm:w-auto px-10 py-5 bg-white border border-slate-200 hover:border-rose-300 text-slate-700 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  View My Work
                </Link>

                <Link
                  href="/register"
                  className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white hover:bg-indigo-600 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-2xl shadow-indigo-100 group"
                >
                  Get In Touch{" "}
                  <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:rotate-45 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      {/* <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[50px] p-12 md:p-20 flex flex-col items-center text-center relative overflow-hidden shadow-3xl">
            <Quote className="text-white/10 w-32 h-32 absolute -top-5 -left-5" />
            <div className="relative z-10">
              <div className="flex gap-1 justify-center mb-8">
                {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-5 h-5 fill-rose-500 text-rose-500" />)}
              </div>
              <h2 className="text-2xl md:text-4xl font-medium text-white leading-snug mb-10 max-w-4xl">
                "AuraTask has completely changed how I handle my projects. The AI doesn't just list tasks, it <span className="text-rose-400 italic">understands</span> them."
              </h2>
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white">FK</div>
                <div className="text-left">
                  <p className="text-white font-bold">Farhan Khan</p>
                  <p className="text-slate-400 text-sm">Lead Developer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* <section className="py-32 bg-[#F8FAFC]">
         <div className="max-w-7xl mx-auto px-6">
           <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[50px] p-12 md:p-24 flex flex-col md:flex-row items-center gap-16 relative overflow-hidden shadow-2xl shadow-indigo-200">
             <Quote className="absolute top-10 right-10 w-40 h-40 text-white/5 -rotate-12" />
             <div className="flex-1 text-center md:text-left">
               <div className="flex gap-1 justify-center md:justify-start mb-6">
                 {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
               </div>
               <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-8 italic">
                 "This isn't just a todo app. It's like having a project manager inside my browser."
               </h2>
               <p className="text-indigo-100 text-lg font-semibold">— Farhan Khan, Lead Developer</p>
             </div>
           </div>
         </div>
       </section> */}

      {/* --- PRICING --- */}
      <section id="pricing" className="md:py-32 py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <motion.div {...fadeIn}>
              <div className="flex flex-row items-start justify-center gap-2">
                <Coins className="w-6 h-6 text-gray-700 animate-pulse" />
                <h2 className="text-lg font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-500 to-rose-500 uppercase tracking-[0.1em] mb-6 flex items-center justify-center gap-2">
                  Pricing
                </h2>
              </div>
              <h3 className="text-5xl md:text-7xl font-black text-gray-700 mb-6 tracking-tight">
                Choose Your
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                  {" "}
                  Superpower
                </span>
              </h3>
              <p className="text-slate-400 text-xl">
                Transparent pricing. No hidden fees. Upgrade anytime.
              </p>
            </motion.div>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-8 items-center max-w-5xl mx-auto">
            {/* Free Plan */}
            <motion.div
              {...scaleIn}
              className="md:p-10 p-6 border border-black/10 rounded-[3rem] w-full max-w-md bg-white/50 backdrop-blur-xl hover:border-cyan-600/30 transition-all group"
            >
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-cyan-400 mb-6">
                Starter
              </h3>
              <p className="text-6xl font-black text-gray-600 mb-2">$0</p>
              <p className="text-slate-500 font-medium mb-10">Forever free</p>

              <ul className="space-y-4 mb-10">
                {[
                  "Unlimited tasks",
                  "AI-powered organization",
                  "Fast responses",
                  "Community support",
                ].map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-slate-300 font-medium"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button className="w-full py-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 font-bold  transition-all text-black hover:scale-105">
                Current Plan
              </button>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              {...scaleIn}
              transition={{ delay: 0.1 }}
              className="md:p-12 p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-cyan-400/50 rounded-[3rem] w-full max-w-md shadow-2xl shadow-cyan-500/20 relative z-10 md:scale-110 backdrop-blur-xl group "
            >
              {/* Popular Badge */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white md:text-xs text-[10px] md:px-8 px-4 py-2 rounded-full font-black tracking-widest uppercase shadow-2xl">
                Most Popular
              </div>

              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-cyan-400 mb-6">
                Pro Agent
              </h3>
              <p className="text-6xl font-black text-gray-600 mb-2">$12</p>
              <p className="text-slate-500 font-medium mb-10">per month</p>

              <ul className="space-y-4 mb-10">
                {[
                  "Everything in Starter",
                  "Priority AI processing",
                  "Advanced analytics",
                  "Custom AI personas",
                  "Collaboration tools",
                  "Priority support",
                ].map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-black/50 font-bold"
                  >
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button className="w-full py-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-rose-500 text-white font-black hover:from-cyan-400 hover:to-rose-400 transition-all shadow-2xl shadow-cyan-500/50 hover:shadow-cyan-500/70 hover:scale-105">
                Unlock Everything →
              </button>

              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-[3rem] opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 -z-10"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- ANIMATED CONTACT SECTION --- */}
      <section id="contact" className="md:py-32 py-24 relative overflow-hidden">
        {/* Animated Background Elements */}
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-64 h-64 bg-pink-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            {...fadeIn}
            className="relative p-1 bg-gradient-to-tr from-gray-600 via-transparent to-gray-500 rounded-[3rem]"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-indigo-500 via-purple-400 to-rose-400 rounded-[2.9rem] p-12 md:p-20 backdrop-blur-3xl"
            >
              <div className="grid md:grid-cols-2 gap-16 items-center">
                {/* Left Column */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <motion.h3
                    className="text-4xl md:text-5xl text-gray-200 mb-8 tracking-tight font-black uppercase leading-tight"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    Let's Talk
                    <motion.span
                      className="text-gray-700"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                    >
                      .
                    </motion.span>
                  </motion.h3>

                  <motion.p
                    className="text-gray-800 font-medium mb-10 leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    Questions? Ideas? Feedback? I'd love to hear from you.
                  </motion.p>

                  <div className="space-y-6">
                    {/* Email Contact */}
                    <motion.div
                      className="flex items-center gap-4 group cursor-pointer"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      whileHover={{ x: 10 }}
                    >
                      <motion.div
                        className="w-12 h-12 rounded-2xl bg-white/50 border border-indigo-500/50 flex items-center justify-center group-hover:bg-indigo-500 transition-all duration-500"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <MessageSquare className="w-5 h-5 text-indigo-400 group-hover:text-white transition-colors" />
                      </motion.div>
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          Email
                        </p>
                        <p className="text-white font-bold tracking-tight">
                          hello@auratask.com
                        </p>
                      </div>
                    </motion.div>

                    {/* Twitter Contact */}
                    <motion.div
                      className="flex items-center gap-4 group cursor-pointer"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      whileHover={{ x: 10 }}
                    >
                      <motion.div
                        className="w-12 h-12 rounded-2xl bg-white/50 border border-rose-500/50 flex items-center justify-center group-hover:bg-rose-500 transition-all duration-500"
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Twitter className="w-5 h-5 text-rose-400 group-hover:text-white transition-colors" />
                      </motion.div>
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          Quick Response
                        </p>
                        <p className="text-white font-bold tracking-tight">
                          DM on Twitter
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Right Column - Form */}
                <motion.form
                  className="space-y-4"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  {/* Name Input */}
                  <motion.div
                    className="group relative"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <motion.input
                      type="text"
                      placeholder="Your Name"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600"
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.div>

                  {/* Email Input */}
                  <motion.div
                    className="group relative"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <motion.input
                      type="email"
                      placeholder="Email Address"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600"
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.div>

                  {/* Message Textarea */}
                  <motion.div
                    className="group relative"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <motion.textarea
                      placeholder="Your Message"
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600 resize-none"
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    ></motion.textarea>
                  </motion.div>

                  {/* Submit Button */}
                  <Link href="/">
                    <motion.div
                      className={`group relative w-full sm:w-auto px-10 py-5 mt-6 bg-slate-900 text-white rounded-2xl font-bold overflow-hidden cursor-pointer `}
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
                        Send Message
                        <motion.span
                          className="inline-flex"
                          initial={{ x: 0, y: 0 }}
                          whileHover={{ x: 5, y: -5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                        </motion.span>
                      </span>

                      {/* Glow Effect */}
                      <motion.div
                        className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl opacity-0 blur-xl group-hover:opacity-50 transition-opacity duration-500"
                        style={{ zIndex: -1 }}
                      />
                    </motion.div>
                  </Link>
                </motion.form>
              </div>
            </motion.div>

            {/* Decorative Dots */}
            <motion.div
              className="absolute -top-4 -right-4 flex gap-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- FAQ --- */}
      <section id="faq" className="md:py-32 py-24 relative">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <motion.div {...fadeIn}>
              <div className="flex flex-row items-start justify-center gap-2">
                <Search className="w-7 h-7 text-gray-700 animate-pulse" />
                <h2 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-500 to-rose-500 uppercase tracking-[0.1em] mb-6 flex items-center justify-center gap-2">
                  FAQs
                </h2>
              </div>

              <h3 className="text-5xl md:text-6xl font-black text-gray-700 mb-8 tracking-tight leading-tight">
                Questions?
                <span className="bg-clip-text text-transparent bg-gradient-to-tr from-indigo-600  to-cyan-300">
                  {" "}
                  Answered.
                </span>
              </h3>
            </motion.div>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "How does the AI understand my tasks?",
                a: "Our AI (powered by GROQ) reads your natural language, extracts important details like dates and priorities, then organizes everything automatically. No manual entry needed.",
              },
              {
                q: "Is my data secure?",
                a: "Yes. We use bank-level encryption to protect your information. Your tasks are private and never shared with anyone.",
              },
              {
                q: "Can I use it offline?",
                a: "Not yet. The AI needs internet to process your commands. But we're working on an offline mode!",
              },
              {
                q: "What makes AuraTask different?",
                a: "Unlike other task managers, you don't need to fill out forms or click through menus. Just talk naturally, and the AI does the rest. It's the easiest way to stay organized.",
              },
            ].map((item, i) => (
              <motion.details
                key={i}
                {...fadeIn}
                transition={{ delay: i * 0.1 }}
                className="group bg-white/5 backdrop-blur-xl md:p-8 p-4 rounded-3xl border border-black/10 hover:border-cyan-700/30 cursor-pointer transition-all"
              >
                <summary className="flex items-start justify-between font-bold  list-none">
                  <div className="flex items-start gap-4 text-gray-600 flex-1">
                    <HelpCircle className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                    <span className="text-lg">{item.q}</span>
                  </div>
                  <ArrowRight className="w-6 h-6 group-open:rotate-90 group-hover:scale-150 transition-transform flex-shrink-0 text-slate-400" />
                </summary>
                <p className="mt-6 text-slate-400 leading-relaxed pl-10 font-medium">
                  {item.a}
                </p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="relative pt-32 pb-12 bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px]"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-20 mb-20">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900 group-hover:scale-110 transition-transform">
                  <Sparkles className="text-white w-6 h-6" />
                </div>
                <span className="text-4xl font-black tracking-tighter">
                  Aura<span className="text-purple-400">Task</span>
                </span>
              </div>
              <p className="text-purple-200 leading-relaxed mb-6 max-w-sm text-lg">
                The future of task management. Built with passion, precision,
                and cutting-edge AI.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://github.com"
                  className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 hover:border-purple-400 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all"
                >
                  <Github className="w-6 h-6" />
                </a>
                <a
                  href="https://twitter.com"
                  className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 hover:border-blue-400 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all"
                >
                  <Twitter className="w-6 h-6" />
                </a>
                <a
                  href="https://linkedin.com"
                  className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 hover:border-blue-400 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
            </div>

            <div className="flex flex-row gap-20 items-center justify-center">
              {/* Platform */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-purple-300 mb-6">
                  Platform
                </h4>
                <ul className="space-y-3 text-sm text-purple-200">
                  <li>
                    <a
                      href="#features"
                      className="hover:text-white transition-colors font-medium"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#how-it-works"
                      className="hover:text-white transition-colors font-medium"
                    >
                      How it Works
                    </a>
                  </li>
                  <li>
                    <a
                      href="#pricing"
                      className="hover:text-white transition-colors font-medium"
                    >
                      Pricing
                    </a>
                  </li>
                  <li>
                    <Link
                      href="/"
                      className="hover:text-white transition-colors font-medium"
                    >
                      Workspace
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-pink-300 mb-6">
                  Resources
                </h4>
                <ul className="space-y-3 text-sm text-purple-200">
                  <li>
                    <a
                      href="#about"
                      className="hover:text-white transition-colors font-medium"
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      href="#faq"
                      className="hover:text-white transition-colors font-medium"
                    >
                      FAQ
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-white transition-colors font-medium"
                    >
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-white transition-colors font-medium"
                    >
                      Support
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-white/10 backdrop-blur-xl md:p-8 p-6 rounded-2xl border border-white/20 col-span-1 md:col-span-2">
              <h4 className="font-black mb-4 text-xl">Ready to Start?</h4>
              <p className="text-purple-200 text-sm mb-6">
                Join thousands who've already simplified their lives.
              </p>
              <Link
                href="/register"
                className="block w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center rounded-xl font-bold hover:shadow-2xl hover:shadow-pink-500/50 transition-all"
              >
                Get Started Free
              </Link>
            </div>
          </div>

          <div className="pt-12 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col md:flex-row items-center gap-4 text-purple-300 text-sm">
              <p className="font-medium">
                &copy; 2026 AuraTask. All rights reserved.
              </p>
              <span className="hidden md:inline">•</span>
              <p className="flex items-center gap-2 font-medium">
                Crafted with{" "}
                <Heart className="w-4 h-4 text-pink-400 fill-pink-400" /> by{" "}
                <a
                  href="#about"
                  className="text-purple-400 font-black hover:text-pink-400 transition-colors"
                >
                  Urooj Sadiq
                </a>
              </p>
            </div>
            <div className="flex items-center gap-6 text-xs text-purple-300 uppercase tracking-widest font-bold">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                Next.js
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-pink-400"></div>
                FastAPI
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                Neon DB
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                GROQ AI
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

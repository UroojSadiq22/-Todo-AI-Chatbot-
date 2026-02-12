// "use client";
// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { Bot, Sparkles, Zap, CheckCircle2, ArrowRight, Menu, X, Github, Star, Quote, HelpCircle } from 'lucide-react';
// import Link from 'next/link';

// export default function LandingPage() {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => setIsScrolled(window.scrollY > 20);
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const fadeIn = {
//     initial: { opacity: 0, y: 30 },
//     whileInView: { opacity: 1, y: 0 },
//     viewport: { once: true },
//     transition: { duration: 0.7, ease: "easeOut" }
//   };

//   return (
//     <div className=" bg-[#F8FAFC] text-slate-900 selection:bg-indigo-100 selection:text-indigo-700 font-sans">
      
//       {/* --- NAVIGATION BAR --- */}
//       {/* <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/70 backdrop-blur-xl border-b border-slate-200 py-3' : 'bg-transparent py-6'}`}>
//         <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
//           <div className="flex items-center gap-2.5 group cursor-pointer">
//             <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
//               <Bot className="text-white w-6 h-6" />
//             </div>
//             <span className="text-xl font-bold tracking-tight text-slate-900 italic">Speckit<span className="text-indigo-600">Plus</span></span>
//           </div>

//           <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-slate-600">
//             <Link href="#features" className="hover:text-indigo-600 transition-colors">Features</Link>
//             <Link href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</Link>
//             <Link href="#faq" className="hover:text-indigo-600 transition-colors">FAQ</Link>
//             <Link href="/register" className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full transition-all shadow-md active:scale-95">
//               Get Started
//             </Link>
//           </div>

//           <button className="md:hidden p-2 text-slate-900" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
//             {mobileMenuOpen ? <X /> : <Menu />}
//           </button>
//         </div>
//       </nav> */}

//       {/* --- HERO SECTION --- */}
//       <section className="relative py-20 pb-28 px-6 overflow-hidden">
//         {/* Soft Decorative Background Circles */}
//         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
//           <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-50 rounded-full blur-[120px] opacity-60"></div>
//           <div className="absolute bottom-0 right-[-10%] w-[40%] h-[40%] bg-purple-50 rounded-full blur-[120px] opacity-60"></div>
//         </div>
        
//         <div className="max-w-5xl mx-auto text-center">
//           <motion.div {...fadeIn}>
//             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold mb-10 tracking-wider">
//               <Sparkles className="w-3.5 h-3.5" /> REVOLUTIONIZING PRODUCTIVITY
//             </div>
//             <h1 className="text-6xl md:text-8xl font-[900] text-slate-900 mb-8 leading-[1] tracking-tight">
//               Tasks that talk <br />
//               <span className="text-indigo-600">back to you.</span>
//             </h1>
//             <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
//               Experience the power of an AI Agent integrated with MCP. Manage your life through natural conversation, not just ticking boxes.
//             </p>
//             <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
//               <Link href="/chat" className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-200 group">
//                 Open AI Workspace <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//               </Link>
//               <Link href="https://github.com" className="w-full sm:w-auto px-10 py-5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm">
//                 <Github className="w-5 h-5" /> Source Code
//               </Link>
//             </div>
//           </motion.div>
//         </div>
//       </section>

//       {/* --- FEATURES SECTION --- */}
//       <section id="features" className="py-32 bg-white border-y border-slate-100">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="text-center max-w-3xl mx-auto mb-20">
//             <h2 className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">Everything is AI-First.</h2>
//             <p className="text-slate-500 text-lg leading-relaxed">Phase 3 introduces the Model Context Protocol (MCP) server, bridging the gap between LLMs and your personal database.</p>
//           </div>
          
//           <div className="grid md:grid-cols-3 gap-10">
//             {[
//               { icon: <Bot />, color: "bg-blue-600", title: "Smart MCP Server", desc: "A backend that allows Gemini to read and write directly to your tasks database with secure context." },
//               { icon: <Zap />, color: "bg-amber-500", title: "Instant Execution", desc: "No more long forms. Type 'Buy milk' and our agent determines priority, category, and due date." },
//               { icon: <Star />, color: "bg-purple-600", title: "Contextual Memory", desc: "The agent remembers your previous interactions to give more personalized task suggestions." }
//             ].map((f, i) => (
//               <motion.div key={i} {...fadeIn} className="group p-10 rounded-[40px] bg-[#F8FAFC] border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500">
//                 <div className={`w-14 h-14 rounded-2xl ${f.color} text-white flex items-center justify-center mb-8 shadow-lg transition-transform group-hover:rotate-6`}>
//                   {f.icon}
//                 </div>
//                 <h3 className="text-2xl font-bold text-slate-900 mb-4">{f.title}</h3>
//                 <p className="text-slate-500 leading-relaxed font-medium">{f.desc}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* --- TESTIMONIALS SECTION --- */}
//       <section className="py-32 bg-[#F8FAFC]">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="bg-indigo-600 rounded-[50px] p-12 md:p-24 flex flex-col md:flex-row items-center gap-16 relative overflow-hidden shadow-2xl shadow-indigo-200">
//             <Quote className="absolute top-10 right-10 w-40 h-40 text-white/5 -rotate-12" />
//             <div className="flex-1 text-center md:text-left">
//               <div className="flex gap-1 justify-center md:justify-start mb-6">
//                 {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
//               </div>
//               <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-8 italic">
//                 "This isn't just a todo app. It's like having a project manager inside my browser."
//               </h2>
//               <p className="text-indigo-100 text-lg font-semibold">— Farhan Khan, Lead Developer</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* --- PRICING SECTION --- */}
//       <section id="pricing" className="py-32 bg-white">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="text-center mb-20">
//             <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Transparent Pricing</h2>
//             <p className="text-slate-500">Choose the plan that fits your workflow.</p>
//           </div>
//           <div className="flex flex-col md:flex-row justify-center gap-8">
//              {/* Simple Card Example */}
//              <div className="p-10 border border-slate-200 rounded-[40px] w-full max-w-sm hover:border-indigo-400 transition-colors">
//                 <h3 className="text-xl font-bold mb-2">Personal</h3>
//                 <p className="text-4xl font-black mb-6">$0 <span className="text-sm text-slate-400">/mo</span></p>
//                 <ul className="space-y-4 mb-8">
//                   <li className="flex items-center gap-2 text-slate-600"><CheckCircle2 className="w-4 h-4 text-green-500"/> Unlimited Tasks</li>
//                   <li className="flex items-center gap-2 text-slate-600"><CheckCircle2 className="w-4 h-4 text-green-500"/> Basic AI Chat</li>
//                 </ul>
//                 <button className="w-full py-4 rounded-2xl border border-slate-900 font-bold hover:bg-slate-50 transition-colors">Current Plan</button>
//              </div>
//              {/* Featured Card */}
//              <div className="p-10 bg-slate-950 text-white rounded-[40px] w-full max-w-sm shadow-2xl shadow-slate-200 scale-105 relative">
//                 <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-xs px-4 py-1.5 rounded-full font-bold">MOST POPULAR</div>
//                 <h3 className="text-xl font-bold mb-2">Professional</h3>
//                 <p className="text-4xl font-black mb-6">$12 <span className="text-sm text-slate-500">/mo</span></p>
//                 <ul className="space-y-4 mb-8">
//                   <li className="flex items-center gap-2 text-slate-300"><CheckCircle2 className="w-4 h-4 text-indigo-400"/> Advanced MCP Tools</li>
//                   <li className="flex items-center gap-2 text-slate-300"><CheckCircle2 className="w-4 h-4 text-indigo-400"/> Custom AI Voice</li>
//                 </ul>
//                 <button className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 font-bold transition-all shadow-lg shadow-indigo-600/30">Go Pro</button>
//              </div>
//           </div>
//         </div>
//       </section>

//       {/* --- FAQ SECTION --- */}
//       <section id="faq" className="py-32 bg-[#F8FAFC]">
//         <div className="max-w-4xl mx-auto px-6">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl font-extrabold mb-4">Frequently Asked Questions</h2>
//           </div>
//           <div className="space-y-6">
//             {[
//               { q: "How does the AI Agent manage my tasks?", a: "We use Gemini-2.0-Flash to parse your text and connect it via our custom MCP server to your PostgreSQL database." },
//               { q: "Is my data secure?", a: "Yes, we use Bcrypt hashing and JWT tokens for authentication, ensuring only you can access your tasks." },
//               { q: "Can I use it offline?", a: "Currently, our AI features require an internet connection to process natural language." }
//             ].map((item, i) => (
//               <details key={i} className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm cursor-pointer">
//                 <summary className="flex items-center justify-between font-bold text-slate-800 list-none">
//                   <div className="flex items-center gap-3">
//                     <HelpCircle className="w-5 h-5 text-indigo-500" /> {item.q}
//                   </div>
//                   <ArrowRight className="w-5 h-5 group-open:rotate-90 transition-transform" />
//                 </summary>
//                 <p className="mt-4 text-slate-500 leading-relaxed pl-8 font-medium">{item.a}</p>
//               </details>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* --- FOOTER --- */}
//       <footer className="py-20 bg-white border-t border-slate-100">
//         <div className="max-w-7xl mx-auto px-6 text-center">
//           <div className="flex items-center justify-center gap-2 mb-8">
//             <Bot className="w-6 h-6 text-indigo-600" />
//             <span className="text-2xl font-black italic">Speckit<span className="text-indigo-600">Plus</span></span>
//           </div>
//           <p className="text-slate-400 text-sm font-medium mb-10 italic">Built for the future of productivity by the Speckit Team.</p>
//           <div className="flex justify-center gap-10 text-slate-500 text-sm font-bold">
//             <a href="#" className="hover:text-indigo-600 transition-colors uppercase tracking-widest">Twitter</a>
//             <a href="#" className="hover:text-indigo-600 transition-colors uppercase tracking-widest">GitHub</a>
//             <a href="#" className="hover:text-indigo-600 transition-colors uppercase tracking-widest">LinkedIn</a>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }



"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles, Zap, CheckCircle2, ArrowRight, Github, Star, Quote, HelpCircle, Layers, ShieldCheck, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.7, ease: "easeOut" }
  };

  return (
    <div className="bg-[#FDFEFF] text-slate-900 selection:bg-rose-100 selection:text-rose-700 font-sans">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-50/50 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-[-10%] w-[50%] h-[50%] bg-rose-50/50 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="max-w-6xl mx-auto text-center">
          <motion.div {...fadeIn}>
            {/* Live MCP Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-[0.15em] mb-10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              MCP Server Online
            </div>

            <h1 className="text-6xl md:text-[5.5rem] font-[1000] text-slate-900 mb-8 leading-[0.95] tracking-[-0.04em]">
              Your tasks, <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-500 to-rose-500">
                evolved with AI.
              </span>
            </h1>
            
            <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
              AuraTask combines Model Context Protocol (MCP) with Gemini to turn your simple list into an intelligent, self-organizing workspace.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link href="/chat" className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white hover:bg-indigo-600 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-2xl shadow-indigo-100 group">
                Start Chatting <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/register" className="w-full sm:w-auto px-10 py-5 bg-white border border-slate-200 hover:border-rose-300 text-slate-700 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm">
                Join AuraTask
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- STATS SECTION (NEW) --- */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-slate-100">
                {[
                    { label: "AI Response", val: "< 2s" },
                    { label: "Uptime", val: "99.9%" },
                    { label: "Encryption", val: "AES-256" },
                    { label: "Models", val: "Gemini 2.0" }
                ].map((stat, i) => (
                    <div key={i} className="text-center">
                        <div className="text-2xl font-black text-slate-900">{stat.val}</div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="features" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-[900] text-slate-900 mb-6 tracking-tight">The Future of Coordination.</h2>
            <p className="text-slate-500 text-lg leading-relaxed">Experience features that feel like magic, powered by our custom MCP bridge.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: <Layers />, color: "text-indigo-600", bg: "bg-indigo-50", title: "MCP Integration", desc: "Direct database access for AI agents through the secure Model Context Protocol." },
              { icon: <Zap />, color: "text-rose-600", bg: "bg-rose-50", title: "Natural Language", desc: "Just say it. Our agent understands context, intent, and priority instantly." },
              { icon: <ShieldCheck />, color: "text-emerald-600", bg: "bg-emerald-50", title: "Secure Hashing", desc: "Your data is protected with Bcrypt 4.0.1 and industry-standard JWT tokens." }
            ].map((f, i) => (
              <motion.div key={i} {...fadeIn} className="group p-10 rounded-[40px] bg-slate-50/50 border border-slate-100/50 hover:bg-white hover:shadow-2xl hover:shadow-indigo-100/40 transition-all duration-500">
                <div className={`w-14 h-14 rounded-2xl ${f.bg} ${f.color} flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* --- HOW IT WORKS SECTION --- */}
      <section id="how-it-works" className="py-32 bg-slate-50/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-sm font-[900] text-indigo-600 uppercase tracking-[0.3em] mb-4">The Workflow</h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">How AuraTask Magic Happens</h3>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connecting Line (Desktop Only) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent -translate-y-12"></div>

            {[
              {
                step: "01",
                title: "Authentication",
                desc: "Register or Login to secure your personal workspace and task database.",
                icon: <ShieldCheck className="w-6 h-6" />,
                color: "bg-blue-600"
              },
              {
                step: "02",
                title: "Natural Command",
                desc: "Talk to the AI Agent. Example: 'Remind me to submit the project by Friday'.",
                icon: <MessageSquare className="w-6 h-6" />,
                color: "bg-indigo-600"
              },
              {
                step: "03",
                title: "AI & MCP Bridge",
                desc: "Gemini AI parses your intent and calls the MCP Server tools to execute logic.",
                icon: <Layers className="w-6 h-6" />,
                color: "bg-purple-600"
              },
              {
                step: "04",
                title: "Instant Update",
                desc: "Your database updates in real-time, and your dashboard reflects the new task.",
                icon: <Zap className="w-6 h-6" />,
                color: "bg-rose-600"
              }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                {...fadeIn} 
                transition={{ delay: i * 0.1 }}
                className="relative z-10 flex flex-col items-center text-center group"
              >
                <div className={`w-16 h-16 ${item.color} text-white rounded-2xl flex items-center justify-center shadow-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>
                <div className="text-xs font-black text-slate-300 mb-2">{item.step}</div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed px-4">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* User Experience Guide */}
          <motion.div 
            {...fadeIn}
            className="mt-20 p-8 rounded-[40px] bg-white border border-slate-100 shadow-2xl shadow-indigo-100/50 flex flex-col md:flex-row items-center gap-8"
          >
            <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center flex-shrink-0">
              <Bot className="w-10 h-10 text-indigo-600" />
            </div>
            <div>
              <h4 className="text-xl font-black text-slate-900 mb-2">Want to see it in action?</h4>
              <p className="text-slate-600 font-medium leading-relaxed">
                After you <span className="text-indigo-600 font-bold underline underline-offset-4 cursor-pointer">Log In</span>, open the AI Workspace and type: 
                <code className="mx-2 bg-slate-100 px-3 py-1.5 rounded-lg text-rose-500 font-bold text-sm border border-slate-200 shadow-sm">
                  "Add a task to buy groceries tomorrow at 10 am"
                </code>. 
                Our AI Agent will automatically extract the date, time, and content to update your database.
              </p>
            </div>
          </motion.div>
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

             <section className="py-32 bg-[#F8FAFC]">
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
       </section>

      {/* --- PRICING SECTION --- */}
      <section id="pricing" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter italic">CHOOSE YOUR POWER.</h2>
            <p className="text-slate-500 font-medium">Simple plans for complex lives.</p>
          </div>
          <div className="flex flex-col md:flex-row justify-center gap-8 items-center">
             <div className="p-10 border border-slate-100 rounded-[40px] w-full max-w-sm hover:border-indigo-200 transition-all bg-slate-50/30">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Starter</h3>
                <p className="text-5xl font-black text-slate-900 mb-8">$0</p>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3 text-slate-600 font-medium text-sm"><CheckCircle2 className="w-5 h-5 text-emerald-500"/> Unlimited Local Tasks</li>
                  <li className="flex items-center gap-3 text-slate-600 font-medium text-sm"><CheckCircle2 className="w-5 h-5 text-emerald-500"/> Basic Gemini Integration</li>
                </ul>
                <button className="w-full py-4 rounded-2xl bg-white border border-slate-200 font-bold hover:bg-slate-50 transition-colors shadow-sm">Current Plan</button>
             </div>

             <div className="p-12 bg-white border-2 border-indigo-600 rounded-[40px] w-full max-w-md shadow-2xl shadow-indigo-100 relative z-10 scale-105">
                <div className="absolute -top-4 right-10 bg-rose-500 text-white text-[10px] px-4 py-1 rounded-full font-black tracking-widest uppercase">Popular</div>
                <h3 className="text-sm font-black uppercase tracking-widest text-indigo-600 mb-4">Pro Agent</h3>
                <p className="text-5xl font-black text-slate-900 mb-8">$12<span className="text-lg text-slate-400">/mo</span></p>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3 text-slate-700 font-bold text-sm"><CheckCircle2 className="w-5 h-5 text-indigo-600"/> Full MCP Tool Access</li>
                  <li className="flex items-center gap-3 text-slate-700 font-bold text-sm"><CheckCircle2 className="w-5 h-5 text-indigo-600"/> Priority AI Processing</li>
                  <li className="flex items-center gap-3 text-slate-700 font-bold text-sm"><CheckCircle2 className="w-5 h-5 text-indigo-600"/> Custom AI Personas</li>
                </ul>
                <button className="w-full py-5 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200">Unlock Everything</button>
             </div>
          </div>
        </div>
      </section>

             {/* --- FAQ SECTION --- */}
       <section id="faq" className="py-32 bg-[#F8FAFC]">
         <div className="max-w-4xl mx-auto px-6">
           <div className="text-center mb-16">
             <h2 className="text-4xl font-extrabold mb-4">Frequently Asked Questions</h2>
           </div>
           <div className="space-y-6">
             {[
               { q: "How does the AI Agent manage my tasks?", a: "We use Gemini-2.0-Flash to parse your text and connect it via our custom MCP server to your PostgreSQL database." },
               { q: "Is my data secure?", a: "Yes, we use Bcrypt hashing and JWT tokens for authentication, ensuring only you can access your tasks." },
               { q: "Can I use it offline?", a: "Currently, our AI features require an internet connection to process natural language." }
             ].map((item, i) => (
               <details key={i} className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm cursor-pointer">
                 <summary className="flex items-center justify-between font-bold text-slate-800 list-none">
                   <div className="flex items-center gap-3">
                     <HelpCircle className="w-5 h-5 text-indigo-500" /> {item.q}
                   </div>
                   <ArrowRight className="w-5 h-5 group-open:rotate-90 transition-transform" />
                 </summary>
                 <p className="mt-4 text-slate-500 leading-relaxed pl-8 font-medium">{item.a}</p>
               </details>
             ))}
           </div>
         </div>
       </section>


      {/* --- FOOTER --- */}
      <footer className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center font-black text-white text-xs italic">A</div>
            <span className="text-2xl font-black tracking-tighter italic text-slate-900">Aura<span className="text-indigo-600">Task</span></span>
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.3em] mb-10">Beyond the Ordinary To-Do</p>
          <div className="flex justify-center gap-10 text-slate-400 text-xs font-black uppercase tracking-widest">
            <a href="#" className="hover:text-rose-500 transition-colors">Twitter</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">GitHub</a>
            <a href="#" className="hover:text-purple-600 transition-colors">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
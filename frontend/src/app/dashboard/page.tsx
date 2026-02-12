// /** Dashboard page for todo management. */

// 'use client';

// import React, { useState, useEffect } from 'react';
// import { Todo, TodoCreate, TodoUpdate } from '../../types';
// import TodoForm from '../../components/TodoForm';
// import TodoList from '../../components/TodoList';
// import ProtectedRoute from '../../components/ProtectedRoute';
// import { todoAPI } from '../../services/api';

// const DashboardPage: React.FC = () => {
//   const [todos, setTodos] = useState<Todo[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   // Load todos when component mounts
//   useEffect(() => {
//     fetchTodos();
//   }, []);

//   const fetchTodos = async () => {
//     try {
//       setLoading(true);
//       const response = await todoAPI.getTodos();
//       setTodos(response.data);
//       setError(null);
//     } catch (err) {
//       setError('Failed to load todos. Please try again later.');
//       console.error('Error fetching todos:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateTodo = async (todoData: TodoCreate) => {
//     try {
//       const response = await todoAPI.createTodo(todoData);
//       setTodos([...todos, response.data]);
//     } catch (err) {
//       setError('Failed to create todo. Please try again.');
//       console.error('Error creating todo:', err);
//     }
//   };

//   const handleToggleTodo = async (id: string) => {
//     try {
//       const response = await todoAPI.toggleTodo(id);
//       setTodos(todos.map(todo =>
//         todo.id === id ? response.data : todo
//       ));
//     } catch (err) {
//       setError('Failed to update todo. Please try again.');
//       console.error('Error toggling todo:', err);
//     }
//   };

//   const handleDeleteTodo = async (id: string) => {
//     try {
//       await todoAPI.deleteTodo(id);
//       setTodos(todos.filter(todo => todo.id !== id));
//     } catch (err) {
//       setError('Failed to delete todo. Please try again.');
//       console.error('Error deleting todo:', err);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//       </div>
//     );
//   }

//   return (
//     <ProtectedRoute>
//       <div className="max-w-3xl mx-auto p-4">
//         <h1 className="text-2xl font-bold mb-6">Todo Dashboard</h1>

//         {error && (
//           <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
//             {error}
//           </div>
//         )}

//         <TodoForm onSubmit={handleCreateTodo} />

//         <div className="mb-6">
//           <div className="flex justify-between items-center mb-2">
//             <h2 className="text-lg font-semibold">Your Todos</h2>
//             <span className="text-sm text-gray-500">
//               {todos.length} {todos.length === 1 ? 'item' : 'items'}
//             </span>
//           </div>

//           <TodoList
//             todos={todos}
//             onToggle={handleToggleTodo}
//             onDelete={handleDeleteTodo}
//           />
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// };

// export default DashboardPage;


// 'use client';

// import React, { useState, useEffect } from 'react';
// import { Todo, TodoCreate } from '../../types';
// import TodoForm from '../../components/TodoForm';
// import TodoList from '../../components/TodoList';
// import ProtectedRoute from '../../components/ProtectedRoute';
// import { todoAPI } from '../../services/api';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   LayoutDashboard, 
//   ListChecks, 
//   PieChart, 
//   CheckCircle, 
//   Clock, 
//   AlertCircle,
//   Plus
// } from 'lucide-react';

// const DashboardPage: React.FC = () => {
//   const [todos, setTodos] = useState<Todo[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [activeTab, setActiveTab] = useState<'stats' | 'tasks'>('stats');

//   useEffect(() => {
//     fetchTodos();
//   }, []);

//   const fetchTodos = async () => {
//     try {
//       setLoading(true);
//       const response = await todoAPI.getTodos();
//       setTodos(response.data);
//       setError(null);
//     } catch (err) {
//       setError('Failed to load todos. Please try again later.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Logic for Statistics
//   const stats = {
//     total: todos.length,
//     completed: todos.filter(t => t.completed).length,
//     pending: todos.filter(t => !t.completed).length,
//     completionRate: todos.length > 0 ? Math.round((todos.filter(t => t.completed).length / todos.length) * 100) : 0
//   };

//   const handleCreateTodo = async (todoData: TodoCreate) => {
//     try {
//       const response = await todoAPI.createTodo(todoData);
//       setTodos([...todos, response.data]);
//       setActiveTab('tasks'); // Auto switch to tasks after creation
//     } catch (err) {
//       setError('Failed to create todo.');
//     }
//   };

//   const handleToggleTodo = async (id: string) => {
//     try {
//       const response = await todoAPI.toggleTodo(id);
//       setTodos(todos.map(todo => todo.id === id ? response.data : todo));
//     } catch (err) {
//       setError('Failed to update todo.');
//     }
//   };

//   const handleDeleteTodo = async (id: string) => {
//     try {
//       await todoAPI.deleteTodo(id);
//       setTodos(todos.filter(todo => todo.id !== id));
//     } catch (err) {
//       setError('Failed to delete todo.');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex justify-center items-center">
//         <motion.div 
//           animate={{ rotate: 360 }}
//           transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
//           className="h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full"
//         />
//       </div>
//     );
//   }

//   return (
//     <ProtectedRoute>
//       <div className="min-h-screen  py-20">
//         {/* Header Section */}
//         <header className="max-w-6xl mx-auto pt-10 px-6">
//           <motion.div 
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             className="flex flex-col md:flex-row md:items-center justify-between gap-4"
//           >
//             <div>
//               <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
//                 Workspace
//               </h1>
//               <p className="text-gray-400 mt-1">Manage your tasks and track progress</p>
//             </div>
            
//             {/* Tab Switcher */}
//             <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-md">
//               <button
//                 onClick={() => setActiveTab('stats')}
//                 className={`flex items-center gap-2 px-6 py-2.5 rounded-lg transition-all ${activeTab === 'stats' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-gray-400 hover:text-white'}`}
//               >
//                 <PieChart size={18} />
//                 <span>Overview</span>
//               </button>
//               <button
//                 onClick={() => setActiveTab('tasks')}
//                 className={`flex items-center gap-2 px-6 py-2.5 rounded-lg transition-all ${activeTab === 'tasks' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-gray-400 hover:text-white'}`}
//               >
//                 <ListChecks size={18} />
//                 <span>Tasks</span>
//               </button>
//             </div>
//           </motion.div>
//         </header>

//         <main className="max-w-6xl mx-auto px-6 mt-10">
//           <AnimatePresence mode="wait">
//             {activeTab === 'stats' ? (
//               <motion.div
//                 key="stats-tab"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
//               >
//                 {/* Stat Cards */}
//                 <StatCard title="Total Tasks" value={stats.total} icon={<LayoutDashboard className="text-blue-400" />} color="blue" />
//                 <StatCard title="Completed" value={stats.completed} icon={<CheckCircle className="text-emerald-400" />} color="emerald" />
//                 <StatCard title="Pending" value={stats.pending} icon={<Clock className="text-amber-400" />} color="amber" />
//                 <StatCard title="Efficiency" value={`${stats.completionRate}%`} icon={<AlertCircle className="text-purple-400" />} color="purple" />

//                 {/* Mini Create Box in Stats */}
//                 <div className="md:col-span-2 lg:col-span-4 mt-4 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
//                    <div className="flex items-center gap-4 mb-6">
//                       <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400">
//                         <Plus size={24} />
//                       </div>
//                       <h3 className="text-xl font-semibold">Quick Create</h3>
//                    </div>
//                    <TodoForm onSubmit={handleCreateTodo} />
//                 </div>
//               </motion.div>
//             ) : (
//               <motion.div
//                 key="tasks-tab"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm"
//               >
//                 <div className="flex justify-between items-center mb-6 px-2">
//                   <h2 className="text-xl font-bold">Your Task List</h2>
//                   <span className="px-4 py-1 bg-white/10 rounded-full text-xs font-mono text-indigo-300 border border-white/10">
//                     {todos.length} TOTAL
//                   </span>
//                 </div>
                
//                 <TodoList
//                   todos={todos}
//                   onToggle={handleToggleTodo}
//                   onDelete={handleDeleteTodo}
//                 />
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </main>

//         {error && (
//           <motion.div 
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="fixed bottom-10 right-10 p-4 bg-red-500/20 border border-red-500/50 backdrop-blur-xl text-red-200 rounded-2xl shadow-2xl z-50 flex items-center gap-3"
//           >
//             <AlertCircle size={20} />
//             {error}
//           </motion.div>
//         )}
//       </div>
//     </ProtectedRoute>
//   );
// };

// // Sub-component for Stats Card
// const StatCard = ({ title, value, icon, color }: any) => (
//   <motion.div 
//     whileHover={{ y: -5 }}
//     className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm hover:bg-white/10 transition-all shadow-xl"
//   >
//     <div className="flex justify-between items-start mb-4">
//       <div className={`p-3 rounded-2xl bg-${color}-500/10`}>
//         {icon}
//       </div>
//     </div>
//     <div className="text-3xl font-bold">{value}</div>
//     <div className="text-gray-400 text-sm mt-1">{title}</div>
//   </motion.div>
// );

// export default DashboardPage;



'use client';

import React, { useState, useEffect } from 'react';
import { Todo, TodoCreate } from '../../types';
import TodoForm from '../../components/TodoForm';
import TodoList from '../../components/TodoList';
import ProtectedRoute from '../../components/ProtectedRoute';
import { todoAPI } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, ListChecks, CheckCircle, Clock, 
  AlertCircle, Plus, TrendingUp, Target, Calendar
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';

const DashboardPage: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks'>('overview');

  useEffect(() => { fetchTodos(); }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await todoAPI.getTodos();
      setTodos(response.data);
    } catch (err) {
      setError('Failed to load todos.');
    } finally {
      setLoading(false);
    }
  };

  // Advanced Stats Logic
  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    pending: todos.filter(t => !t.completed).length,
    rate: todos.length > 0 ? Math.round((todos.filter(t => t.completed).length / todos.length) * 100) : 0
  };

  // Mock Data for Graph (Real-time analytics feature)
  const chartData = [
    { name: 'Mon', completed: 4, pending: 2 },
    { name: 'Tue', completed: 3, pending: 5 },
    { name: 'Wed', completed: 6, pending: 1 },
    { name: 'Thu', completed: 8, pending: 3 },
    { name: 'Fri', completed: stats.completed, pending: stats.pending },
  ];

  // API Handlers (Keep your existing logic)
  const handleCreateTodo = async (todoData: TodoCreate) => {
    try {
      const response = await todoAPI.createTodo(todoData);
      setTodos([...todos, response.data]);
      setActiveTab('tasks');
    } catch (err) { setError('Create failed.'); }
  };
  
  const handleDeleteTodo = async (id: string) => {
    try {
      await todoAPI.deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      setError('Failed to delete todo.');
    }
  };

  const handleToggleTodo = async (id: string) => {
    try {
      const response = await todoAPI.toggleTodo(id);
      setTodos(todos.map(t => t.id === id ? response.data : t));
    } catch (err) { setError('Update failed.'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#F8FAFC] flex">
        {/* Main Content Area */}
        <div className="flex-1 px-4 md:px-10 py-8 mt-16">
          
          {/* Top Welcome Bar */}
          <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Focus Workspace</h1>
              <p className="text-slate-500 font-medium">Hello! Here's what's happening today.</p>
            </div>
            
            <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
              <TabBtn active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<TrendingUp size={18}/>} label="Overview" />
              <TabBtn active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} icon={<ListChecks size={18}/>} label="My Tasks" />
            </div>
          </header>

          <AnimatePresence mode="wait">
            {activeTab === 'overview' ? (
              <motion.div key="ov" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="space-y-8">
                
                {/* Stat Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard title="Total Tasks" value={stats.total} icon={<LayoutDashboard/>} color="indigo" accent="bg-indigo-500" />
                  <StatCard title="Completed" value={stats.completed} icon={<CheckCircle/>} color="emerald" accent="bg-emerald-500" />
                  <StatCard title="In Progress" value={stats.pending} icon={<Clock/>} color="orange" accent="bg-orange-500" />
                  <StatCard title="Success Rate" value={`${stats.rate}%`} icon={<Target/>} color="purple" accent="bg-purple-500" />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                      <TrendingUp size={20} className="text-indigo-600"/> Activity Analysis
                    </h3>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                          <YAxis hide />
                          <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                          <Area type="monotone" dataKey="completed" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorComp)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Quick Add Section */}
                  <div className="bg-indigo-600 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-200 flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                        <Plus size={24} />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Next Big Thing?</h3>
                      <p className="text-indigo-100 text-sm mb-6">Quickly add a task to your backlog and stay organized.</p>
                    </div>
                    <div className="bg-white/10 p-2 rounded-2xl backdrop-blur-md">
                        <TodoForm onSubmit={handleCreateTodo} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="tk" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-black text-slate-800">Task Inventory</h2>
                  <div className="flex gap-2">
                    <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider">
                      {stats.total} Tasks Total
                    </span>
                  </div>
                </div>
                <TodoList todos={todos} onToggle={handleToggleTodo} onDelete={handleDeleteTodo} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ProtectedRoute>
  );
};

// Reusable Components
const StatCard = ({ title, value, icon, color, accent }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
    <div className="flex items-center gap-4">
      <div className={`p-4 rounded-2xl ${accent} text-white shadow-lg shadow-${color}-200 group-hover:scale-110 transition-transform`}>
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <div>
        <div className="text-3xl font-black text-slate-800">{value}</div>
        <div className="text-slate-500 text-sm font-medium">{title}</div>
      </div>
    </div>
  </div>
);

const TabBtn = ({ active, onClick, icon, label }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
      active ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
    }`}
  >
    {icon} {label}
  </button>
);

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full" />
  </div>
);

export default DashboardPage;





// "use client"
//  // dashboard/page.tsx (Updated sections)
//  import React, { useState, useEffect } from 'react';
//  import { Todo, TodoCreate } from '../../types';
//  import TodoForm from '../../components/TodoForm';
//  import TodoList from '../../components/TodoList';
//  import ProtectedRoute from '../../components/ProtectedRoute';
//  import { todoAPI } from '../../services/api';
//  import { motion, AnimatePresence } from 'framer-motion';
//  import { 
//    LayoutDashboard, 
//    ListChecks, 
//    PieChart, 
//    CheckCircle, 
//    Clock, 
//    AlertCircle,
//    Plus,
//    Target,
//    PieChartIcon,
//    Calendar
//  } from 'lucide-react';
// import { 
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
//   ResponsiveContainer, AreaChart, Area,  Pie, Cell, Legend 
// } from 'recharts';

// // Pie Chart Colors
// const COLORS = ['#6366f1', '#e2e8f0']; // Indigo for Completed, Slate for Pending

// const DashboardPage: React.FC = () => {
//      const [todos, setTodos] = useState<Todo[]>([]);
//    const [loading, setLoading] = useState<boolean>(true);
//    const [error, setError] = useState<string | null>(null);
//    const [activeTab, setActiveTab] = useState<'overview' | 'tasks'>('overview');

//    useEffect(() => { fetchTodos(); }, []);

//    const fetchTodos = async () => {
//      try {
//        setLoading(true);
//        const response = await todoAPI.getTodos();
//        setTodos(response.data);
//      } catch (err) {
//        setError('Failed to load todos.');
//      } finally {
//        setLoading(false);
//      }
//    };

//    // Advanced Stats Logic
//    const stats = {
//      total: todos.length,
//      completed: todos.filter(t => t.completed).length,
//      pending: todos.filter(t => !t.completed).length,
//      rate: todos.length > 0 ? Math.round((todos.filter(t => t.completed).length / todos.length) * 100) : 0
//    };

//    // Mock Data for Graph (Real-time analytics feature)
//    const chartData = [
//      { name: 'Mon', completed: 4, pending: 2 },
//      { name: 'Tue', completed: 3, pending: 5 },
//      { name: 'Wed', completed: 6, pending: 1 },
//      { name: 'Thu', completed: 8, pending: 3 },
//      { name: 'Fri', completed: stats.completed, pending: stats.pending },
//    ];

//    // API Handlers (Keep your existing logic)
//    const handleCreateTodo = async (todoData: TodoCreate) => {
//      try {
//        const response = await todoAPI.createTodo(todoData);
//        setTodos([...todos, response.data]);
//        setActiveTab('tasks');
//      } catch (err) { setError('Create failed.'); }
//    };
  
//    const handleDeleteTodo = async (id: string) => {
//      try {
//        await todoAPI.deleteTodo(id);
//        setTodos(todos.filter(todo => todo.id !== id));
//      } catch (err) {
//        setError('Failed to delete todo.');
//      }
//    };

//    const handleToggleTodo = async (id: string) => {
//      try {
//        const response = await todoAPI.toggleTodo(id);
//        setTodos(todos.map(t => t.id === id ? response.data : t));
//      } catch (err) { setError('Update failed.'); }
//    };

//    if (loading) return <LoadingSpinner />;
//   // ... (existing logic)

//   // const pieData = [
//   //   { name: 'Completed', value: stats.completed },
//   //   { name: 'Pending', value: stats.pending },
//   // ];

//    const pieData = [
//     { name: 'Completed', value: 10},
//     { name: 'Pending', value: 50 },
//   ];

//   return (
//     <ProtectedRoute>
//       <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row">
        
//         {/* Modern Sidebar (Responsive) */}
//         <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-6 flex flex-col gap-8">
//           <div className="flex items-center gap-3 px-2">
//             <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black">S</div>
//             <span className="font-black text-xl tracking-tight text-slate-800">SmartTask</span>
//           </div>
          
//           <nav className="flex flex-col gap-2">
//             <SidebarItem icon={<LayoutDashboard size={20}/>} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
//             <SidebarItem icon={<ListChecks size={20}/>} label="My Tasks" active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} />
//             <div className="mt-10 mb-2 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Insights</div>
//             <SidebarItem icon={<PieChartIcon size={20}/>} label="Analytics" active={false} />
//             <SidebarItem icon={<Calendar size={20}/>} label="Schedule" active={false} />
//           </nav>
//         </aside>

//         {/* Main Content Area */}
//         <div className="flex-1 px-4 md:px-10 py-8 overflow-y-auto">
//           {/* Header */}
//           <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
//             <div>
//               <h1 className="text-3xl font-black text-slate-900">Workspace Insights</h1>
//               <p className="text-slate-500 font-medium">Tracking your performance for this week.</p>
//             </div>
//             <div className="flex items-center gap-4">
//                <span className="text-sm font-bold text-slate-400">{new Date().toDateString()}</span>
//                <div className="h-10 w-10 bg-slate-200 rounded-full border-2 border-white shadow-sm"></div>
//             </div>
//           </header>

//           <AnimatePresence mode="wait">
//             {activeTab === 'overview' ? (
//               <motion.div key="ov" initial={{opacity:0}} animate={{opacity:1}} className="space-y-8">
                
//                 {/* Stat Grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                   <StatCard title="Total" value={stats.total} icon={<LayoutDashboard/>} accent="bg-indigo-600" />
//                   <StatCard title="Done" value={stats.completed} icon={<CheckCircle/>} accent="bg-emerald-500" />
//                   <StatCard title="Waiting" value={stats.pending} icon={<Clock/>} accent="bg-orange-500" />
//                   <StatCard title="Focus Score" value={`${stats.rate}%`} icon={<Target/>} accent="bg-purple-600" />
//                 </div>

//                 {/* Secondary Charts Row */}
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
//                   {/* Performance Distribution (Pie Chart) */}
//                   <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
//                     <h3 className="text-lg font-bold text-slate-800 mb-6">Task Distribution</h3>
//                     <div className="h-[250px]">
//                       <ResponsiveContainer width="100%" height="100%">
//                         <PieChart>
//                           <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
//                             {pieData.map((entry, index) => (
//                               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                             ))}
//                           </Pie>
//                           <Tooltip />
//                           <Legend verticalAlign="bottom" height={36}/>
//                         </PieChart>
//                       </ResponsiveContainer>
//                     </div>
//                   </div>

//                   {/* Productivity Bar Chart */}
//                   <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
//                     <h3 className="text-lg font-bold text-slate-800 mb-6">Weekly Productivity</h3>
//                     <div className="h-[250px]">
//                       <ResponsiveContainer width="100%" height="100%">
//                         <BarChart data={chartData}>
//                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
//                           <XAxis dataKey="name" axisLine={false} tickLine={false} />
//                           <Tooltip cursor={{fill: '#f8fafc'}} />
//                           <Bar dataKey="completed" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
//                         </BarChart>
//                       </ResponsiveContainer>
//                     </div>
//                   </div>

//                 </div>

//                 {/* Activity Area Graph (The one we made earlier) */}
//                 <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
//                    <h3 className="text-lg font-bold text-slate-800 mb-6">Efficiency Trend</h3>
//                    {/* ... (previous AreaChart code) */}
//                 </div>

//               </motion.div>
//             ) : (
//               /* Tasks Tab */
//               <motion.div key="tk" className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
//                  <TodoList todos={todos} onToggle={handleToggleTodo} onDelete={handleDeleteTodo} />
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// };

// // Sidebar Item Component
// const SidebarItem = ({ icon, label, active, onClick }: any) => (
//   <button
//     onClick={onClick}
//     className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
//       active 
//       ? 'bg-indigo-50 text-indigo-600' 
//       : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
//     }`}
//   >
//     {icon}
//     {label}
//   </button>
// );

//  // Reusable Components
//  const StatCard = ({ title, value, icon, color, accent }: any) => (
//    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
//      <div className="flex items-center gap-4">
//        <div className={`p-4 rounded-2xl ${accent} text-white shadow-lg shadow-${color}-200 group-hover:scale-110 transition-transform`}>
//          {React.cloneElement(icon, { size: 24 })}
//        </div>
//        <div>
//          <div className="text-3xl font-black text-slate-800">{value}</div>
//          <div className="text-slate-500 text-sm font-medium">{title}</div>
//        </div>
//      </div>
//    </div>
//  );
//  const TabBtn = ({ active, onClick, icon, label }: any) => (
//    <button
//      onClick={onClick}
//      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
//        active ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
//      }`}
//    >
//      {icon} {label}
//    </button>
//  );
//  const LoadingSpinner = () => (
//    <div className="min-h-screen flex items-center justify-center bg-white">
//      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full" />
//    </div>
//  );

//  export default DashboardPage;
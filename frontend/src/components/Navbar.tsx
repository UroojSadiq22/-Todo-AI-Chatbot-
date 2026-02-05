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


/** Responsive Navbar component for the Todo application. */
"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { isAuthenticated, logout, getCurrentUser } from '../services/auth';

const Navbar: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Check auth status on mount and when it changes
    const checkAuth = () => {
      const isAuth = isAuthenticated();
      setAuthenticated(isAuth);
      
      if (isAuth) {
        const user = getCurrentUser();
        setUserName(user?.name || user?.email?.split('@')[0] || 'User');
      }
    };

    checkAuth();

    // Re-check periodically or when window gains focus
    window.addEventListener('focus', checkAuth);
    
    return () => {
      window.removeEventListener('focus', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    setUserName('');
    window.location.href = '/';
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">Todo App</span>
            </Link>
            {/* <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-white hover:border-white"
              >
                Dashboard
              </Link>
            </div> */}
          </div>

          <div className="flex items-center">
            {authenticated ? (
              <div className="flex items-center">
                <span className="mr-4 hidden md:block">Welcome, {userName}</span>
                <button
                  onClick={handleLogout}
                  className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-800"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  href="/login"
                  className="text-sm font-medium text-white hover:text-indigo-200"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="ml-8 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">
        <div className="pt-2 pb-3 space-y-1 px-2">
          {authenticated && (
            <Link
              href="/dashboard"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-white hover:bg-indigo-500"
            >
              Dashboard
            </Link>
          )}
          {!authenticated ? (
            <>
              <Link
                href="/login"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-white hover:bg-indigo-500"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-white hover:bg-indigo-500"
              >
                Sign up
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-white hover:bg-indigo-500"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
// "use client";

// /** Authentication context for the Todo application. */

// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { User } from '../types';
// import { verifyToken, getToken } from '../services/auth';
//  import { 
//    isAuthenticated as checkAuth, 
//    getCurrentUser, 
//    login as authLogin, 
//    register as authRegister, 
//    logout as authLogout, 
//  } from '../services/auth';
// import LogoutDialog from '@/components/Logoutdialog';
// import { useRouter } from 'next/navigation';

// interface AuthContextType {
//   user: User | null;
//   isAuthenticated: boolean;
//   loading: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   register: (email: string, name: string, password: string) => Promise<void>;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [showLogoutDialog, setShowLogoutDialog] = useState(false);
//   const router = useRouter();

//   // Check authentication status on initial load
//   useEffect(() => {
//     const checkAuthStatus = async () => {
//       try {
//         const token = getToken();
//         if (token) {
//           const isValid = await verifyToken();
//           if (isValid) {
//             // In a real app, we would fetch the user details using the token
//             // For now, we'll just set isAuthenticated to true
//             setIsAuthenticated(true);

//             // Mock user data - in a real app, fetch this from the API
//             setUser({
//               id: 'mock-user-id',
//               email: 'mock@example.com',
//               name: 'Mock User',
//               created_at: new Date().toISOString(),
//               updated_at: new Date().toISOString(),
//             });
//           } else {
//             setIsAuthenticated(false);
//           }
//         } else {
//           setIsAuthenticated(false);
//         }
//       } catch (error) {
//         console.error('Error checking auth status:', error);
//         setIsAuthenticated(false);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuthStatus();
//   }, []);

//   const login = async (email: string, password: string) => {
//     // This would normally call the login function from auth service
//     // For now, we'll simulate the process
//     setLoading(true);
//     try {
//       // In a real app, this would be:
//       // const { user: loggedInUser, token } = await loginService(email, password);

//       // Mock login - in real app, replace with actual API call
//       const mockUser: User = {
//         id: 'mock-user-id',
//         email,
//         name: 'Mock User', // In a real app, this would come from the API
//         created_at: new Date().toISOString(),
//         updated_at: new Date().toISOString(),
//       };

//       setUser(mockUser);
//       setIsAuthenticated(true);
//     } catch (error) {
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const register = async (email: string, name: string, password: string) => {
//     // This would normally call the register function from auth service
//     // For now, we'll simulate the process
//     setLoading(true);
//     try {
//       // In a real app, this would be:
//       // const { user: registeredUser, token } = await registerService(email, name, password);

//       // Mock registration - in real app, replace with actual API call
//       const mockUser: User = {
//         id: 'mock-user-id',
//         email,
//         name,
//         created_at: new Date().toISOString(),
//         updated_at: new Date().toISOString(),
//       };

//       setUser(mockUser);
//       setIsAuthenticated(true);
//     } catch (error) {
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//    const logout = () => {
//      // In a real app, this would call the logout function from auth service
//      setUser(null);
//      setIsAuthenticated(false);
//   setShowLogoutDialog(true);
//    };


//   // const logout = () => {
//   //   // Clear user data and auth state
//   //   setUser(null);
//   //   setIsAuthenticated(false);
    
//   //   // Clear token from storage (in real app)
//   //   localStorage.removeItem('token');
    
//   //   // Show logout dialog
//   //   setShowLogoutDialog(true);
//   // };

//   const handleCloseLogoutDialog = () => {
//     setShowLogoutDialog(false);
//     // Navigate to home page
//     router.push('/');
//   };

//   const value = {
//     user,
//     isAuthenticated,
//     loading,
//     login,
//     register,
//     logout
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//       <LogoutDialog 
//         isOpen={showLogoutDialog} 
//         onClose={handleCloseLogoutDialog} 
//       />
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };



// // "use client";

// // /** Authentication context that integrates with existing auth service */

// // import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// // import { useRouter } from 'next/navigation';
// // import { User } from '../types';
// // import { 
// //   isAuthenticated as checkAuth, 
// //   getCurrentUser, 
// //   login as authLogin, 
// //   register as authRegister, 
// //   logout as authLogout,
// //   verifyToken 
// // } from '../services/auth';
// // import LogoutDialog from '@/components/Logoutdialog';

// // interface AuthContextType {
// //   user: User | null;
// //   isAuthenticated: boolean;
// //   loading: boolean;
// //   login: (email: string, password: string) => Promise<void>;
// //   register: (email: string, username: string, password: string) => Promise<void>;
// //   logout: () => void;
// // }

// // const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // interface AuthProviderProps {
// //   children: ReactNode;
// // }

// // export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
// //   const [user, setUser] = useState<User | null>(null);
// //   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
// //   const [loading, setLoading] = useState<boolean>(true);
// //   const [showLogoutDialog, setShowLogoutDialog] = useState(false);
// //   const router = useRouter();

// //   // ✅ Check authentication on initial load using existing service
// //   useEffect(() => {
// //     const checkAuthStatus = async () => {
// //       try {
// //         // Use your existing isAuthenticated function
// //         const isAuth = checkAuth();
        
// //         if (isAuth) {
// //           // Verify token is still valid
// //           const isValid = await verifyToken();
          
// //           if (isValid) {
// //             // Get user from existing service
// //             const currentUser = getCurrentUser();
// //             if (currentUser) {
// //               setUser(currentUser);
// //               setIsAuthenticated(true);
// //             } else {
// //               // Token exists but no user data, clear it
// //               setIsAuthenticated(false);
// //               setUser(null);
// //             }
// //           } else {
// //             // Token expired, clear everything
// //             setIsAuthenticated(false);
// //             setUser(null);
// //           }
// //         } else {
// //           setIsAuthenticated(false);
// //           setUser(null);
// //         }
// //       } catch (error) {
// //         console.error('Error checking auth status:', error);
// //         setIsAuthenticated(false);
// //         setUser(null);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     checkAuthStatus();
// //   }, []);

// //   // ✅ Login using existing auth service
// //   const login = async (email: string, password: string) => {
// //     setLoading(true);
// //     try {
// //       // Use your existing login function
// //       const { user: loggedInUser } = await authLogin(email, password);
      
// //       setUser(loggedInUser);
// //       setIsAuthenticated(true);
// //     } catch (error: any) {
// //       console.error('Login error:', error);
// //       throw error; // Re-throw so login page can handle it
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // ✅ Register using existing auth service
// //   const register = async (email: string, username: string, password: string) => {
// //     setLoading(true);
// //     try {
// //       // Use your existing register function
// //       const { user: registeredUser } = await authRegister(username, email, password);
      
// //       setUser(registeredUser);
// //       setIsAuthenticated(true);
// //     } catch (error: any) {
// //       console.error('Registration error:', error);
// //       throw error; // Re-throw so register page can handle it
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // ✅ Logout using existing auth service + show dialog
// //   const logout = () => {
// //     // Use your existing logout function (clears token & currentUser)
// //     authLogout();
    
// //     // Update context state
// //     setUser(null);
// //     setIsAuthenticated(false);
    
// //     // Show logout dialog
// //     setShowLogoutDialog(true);
// //   };

// //   const handleCloseLogoutDialog = () => {
// //     setShowLogoutDialog(false);
// //     // Navigate to home page
// //     router.push('/');
// //   };

// //   const value = {
// //     user,
// //     isAuthenticated,
// //     loading,
// //     login,
// //     register,
// //     logout
// //   };

// //   return (
// //     <AuthContext.Provider value={value}>
// //       {children}
// //       <LogoutDialog 
// //         isOpen={showLogoutDialog} 
// //         onClose={handleCloseLogoutDialog} 
// //       />
// //     </AuthContext.Provider>
// //   );
// // };

// // export const useAuth = () => {
// //   const context = useContext(AuthContext);
// //   if (context === undefined) {
// //     throw new Error('useAuth must be used within an AuthProvider');
// //   }
// //   return context;
// // };



































































"use client";

/** Authentication context - Production Ready */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '../types';
import { 
  isAuthenticated as checkAuth, 
  getCurrentUser, 
  login as authLogin, 
  register as authRegister, 
  logout as authLogout,
  verifyToken 
} from '../services/auth';
import LogoutDialog from '@/components/Logoutdialog';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const router = useRouter();

  /**
   * Check authentication status on initial load
   */
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check if user has valid token
        const isAuth = checkAuth();
        
        if (isAuth) {
          // Verify token hasn't expired
          const isValid = await verifyToken();
          
          if (isValid) {
            // Get user data from localStorage
            const currentUser = getCurrentUser();
            
            if (currentUser) {
              setUser(currentUser);
              setIsAuthenticated(true);
            } else {
              // Token exists but no user data
              setIsAuthenticated(false);
              setUser(null);
            }
          } else {
            // Token expired
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          // No token found
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  /**
   * Login user with email and password
   */
  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // Call auth service login (hits your API)
      const { user: loggedInUser } = await authLogin(email, password);
      
      // Update context state
      setUser(loggedInUser);
      setIsAuthenticated(true);
    } catch (error: any) {
      console.error('Login error:', error);
      throw error; // Re-throw so login page can handle error
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register new user
   */
  const register = async (username: string, email: string, password: string) => {
    setLoading(true);
    
    try {
      // Call auth service register (hits your API)
      const { user: registeredUser } = await authRegister(username, email, password);
      
      // Update context state
      setUser(registeredUser);
      setIsAuthenticated(true);
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error; // Re-throw so register page can handle error
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user and show confirmation dialog
   */
  const logout = () => {
    // Call auth service logout (clears localStorage)
    authLogout();
    
    // Clear context state
    setUser(null);
    setIsAuthenticated(false);
    
    // Show logout confirmation dialog
    setShowLogoutDialog(true);
  };

  /**
   * Handle closing logout dialog and redirect to home
   */
  const handleCloseLogoutDialog = () => {
    setShowLogoutDialog(false);
    router.push('/');
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <LogoutDialog 
        isOpen={showLogoutDialog} 
        onClose={handleCloseLogoutDialog} 
      />
    </AuthContext.Provider>
  );
};

/**
 * Hook to access auth context
 * Must be used within AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
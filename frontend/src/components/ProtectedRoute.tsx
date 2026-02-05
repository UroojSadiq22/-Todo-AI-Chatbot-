/** Higher-order component to protect routes that require authentication. */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { verifyToken } from '../services/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await verifyToken();
      setIsAuthenticated(isValid);

      if (!isValid) {
        // Redirect to login if not authenticated
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  // While checking authentication, show loading state
  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // If authenticated, render the child components
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // If not authenticated (and we've finished checking), return nothing as redirect has happened
  return null;
};

export default ProtectedRoute;
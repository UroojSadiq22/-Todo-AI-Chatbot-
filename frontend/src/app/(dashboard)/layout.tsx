import DashboardNavbar from '@/components/DashboardNavbar';
import FloatingChatButton from '@/components/FloatingChatButton';
import ProtectedRoute from '@/components/ProtectedRoute';
import { AuthProvider } from '@/context/AuthContext';

export default function DashboardLayout({ children }) {
  return (
    <AuthProvider>
      <div className="lg:flex">
        <DashboardNavbar />
        <main className="lg:flex-1">
          {children}
        </main>
        <FloatingChatButton />
      </div>
    </AuthProvider>
  );
}
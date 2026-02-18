/** Root layout for the Todo application. */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import FloatingChatButton from '@/components/FloatingChatButton';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AuraTask',
  icons: {
    icon: "/favicon.ico",
  },
  description: 'A secure, multi-user todo application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <AuthProvider>
          <div className="min-h-screen">
       
            {/* Main content */}
            <main>
             
                {children}
             
            </main>
            <FloatingChatButton />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}


// 'use client';

// import { Inter } from 'next/font/google';
// import './globals.css';
// import { AuthProvider } from '../context/AuthContext';
// import Navbar from '../components/Navbar';
// import FloatingChatButton from '@/components/FloatingChatButton';
// import { usePathname } from 'next/navigation';

// const inter = Inter({ subsets: ['latin'] });

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   const pathname = usePathname();
  
//   // In pages par Navbar aur Chatbot hide ho jayenge
//   const isAuthPage = pathname === '/login' || pathname === '/register';

//   return (
//     <html lang="en">
//       <body className={`${inter.className} bg-white`}>
//         <AuthProvider>
//           <div className="min-h-screen flex flex-col">
//             {!isAuthPage && <Navbar />}
//             <main className="flex-grow">
//               {children}
//             </main>
//             {!isAuthPage && <FloatingChatButton />}
//           </div>
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }




// 'use client';

// import { Inter } from 'next/font/google';
// import './globals.css';
// import { AuthProvider } from '../context/AuthContext';
// import Navbar from '../components/Navbar';
// import FloatingChatButton from '@/components/FloatingChatButton';
// import { usePathname } from 'next/navigation';
// import DashboardNavbar from '@/components/DashboardNavbar';
// import LandingNavbar from '@/components/LandingNavbar';

// const inter = Inter({ subsets: ['latin'] });

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   const pathname = usePathname();
  
//   // Page type detection
//   const isAuthPage = pathname === '/login' || pathname === '/register';
//   const isLandingPage = pathname === '/';
//   const isDashboardPage = pathname.startsWith('/dashboard') || pathname === '/todos';
//   const isChatPage = pathname === '/chat';

//   // Navbar logic:
//   // - Auth pages (login/register): NO navbar
//   // - Landing page: LandingNavbar with "Go to Dashboard" if logged in
//   // - Dashboard pages: DashboardNavbar (sidebar) with "Go to Home"
//   // - Chat page: NO navbar (floating button only)

//   // Chatbot button logic:
//   // - Show on: Landing page + Dashboard pages
//   // - Hide on: Auth pages + Chat page (since chat is already open)

//   const showLandingNavbar = isLandingPage;
//   const showDashboardNavbar = isDashboardPage;
//   const showChatButton = (isLandingPage || isDashboardPage) && !isChatPage;

//   return (
//     <html lang="en">
//       <body className={`${inter.className} bg-white`}>
//         <AuthProvider>
//           <div className="min-h-screen flex">
//             {/* Dashboard Sidebar (Left side for dashboard pages) */}
//             {showDashboardNavbar && <DashboardNavbar />}
            
//             <div className="flex-1 flex flex-col">
//               {/* Landing Navbar (Top for landing page) */}
//               {showLandingNavbar && <LandingNavbar />}
              
//               {/* Main Content */}
//               <main className={`flex-grow ${showDashboardNavbar ? 'ml-0' : ''}`}>
//                 {children}
//               </main>
//             </div>

//             {/* Floating Chat Button */}
//             {showChatButton && <FloatingChatButton />}
//           </div>
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }
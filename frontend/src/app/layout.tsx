// /** Root layout for the Todo application. */

// import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
// import './globals.css';
// import { AuthProvider } from '../context/AuthContext';
// import Navbar from '../components/Navbar';
// import FloatingChatButton from '@/components/FloatingChatButton';

// const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: 'Todo App',
//   description: 'A secure, multi-user todo application',
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body className={`${inter.className} bg-gray-50`}>
//         <AuthProvider>
//           <div className="min-h-screen">
//             <Navbar />
//             {/* Main content */}
//             <main>
             
//                 {children}
             
//             </main>
//             <FloatingChatButton />
//           </div>
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }


'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import FloatingChatButton from '@/components/FloatingChatButton';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // In pages par Navbar aur Chatbot hide ho jayenge
  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <html lang="en">
      <body className={`${inter.className} bg-white`}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            {!isAuthPage && <Navbar />}
            <main className="flex-grow">
              {children}
            </main>
            {!isAuthPage && <FloatingChatButton />}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
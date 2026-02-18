// export default function AuthLayout({ children }) {
//   return (
//     <div>
//       {children}
//     </div>
//   );
// }

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';


import FloatingChatButton from '@/components/FloatingChatButton';
import LandingNavbar from '@/components/LandingNavbar';



export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
          <div className="min-h-screen">
        
            {/* Main content */}
            <main>
             
                {children}
             
            </main>
           
          </div>
        
  );
}
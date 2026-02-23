/** Root layout for the Todo application. */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import FloatingChatButton from "@/components/FloatingChatButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AuraTask",
  icons: {
    icon: "/favicon.ico",
  },
  description: "A secure, multi-user todo application",
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
            <main>{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

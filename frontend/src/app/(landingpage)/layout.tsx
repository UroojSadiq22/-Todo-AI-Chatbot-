import type { Metadata } from "next";
import { Inter } from "next/font/google";

import FloatingChatButton from "@/components/FloatingChatButton";
import LandingNavbar from "@/components/LandingNavbar";

export default function LandingpageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <LandingNavbar />
      {/* Main content */}
      <main>{children}</main>
      <FloatingChatButton />
    </div>
  );
}

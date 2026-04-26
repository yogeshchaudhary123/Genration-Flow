"use client";

import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { FloatingAIChat } from "../chat/FloatingAIChat";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="flex-1 pt-16">
        {children}
      </div>
      <Footer />
      <FloatingAIChat />
    </>
  );
}

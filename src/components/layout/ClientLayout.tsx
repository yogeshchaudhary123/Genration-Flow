"use client";

import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { FloatingAIChat } from "../chat/FloatingAIChat";
import { Toaster } from "react-hot-toast";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />
      <div className="flex-1 pt-16">
        {children}
      </div>
      <Footer />
      <FloatingAIChat />
    </>
  );
}

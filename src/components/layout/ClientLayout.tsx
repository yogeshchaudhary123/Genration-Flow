"use client";

import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { FloatingAIChat } from "../chat/FloatingAIChat";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import { CartDrawer } from "./CartDrawer";
import { useStore } from "@/lib/store";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user } = useStore();
  return (
    <SessionProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />
      <div className="flex-1 pt-16">
        {children}
      </div>
      <Footer />
      {user && (
        <FloatingAIChat />
      )}
      <CartDrawer />
    </SessionProvider>
  );
}

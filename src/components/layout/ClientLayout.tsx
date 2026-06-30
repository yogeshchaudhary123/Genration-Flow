"use client";

import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { FloatingAIChat } from "../chat/FloatingAIChat";
import { Toaster } from "react-hot-toast";
import { SessionProvider, useSession } from "next-auth/react";
import { CartDrawer } from "./CartDrawer";

function ClientLayoutContent({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <>
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
    </>
  );
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ClientLayoutContent>{children}</ClientLayoutContent>
    </SessionProvider>
  );
}

"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { Menu, User as UserIcon, Bell } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { usePathname } from "next/navigation";

interface AdminHeaderProps {
  onOpenMobileSidebar: () => void;
}

export function AdminHeader({ onOpenMobileSidebar }: AdminHeaderProps) {
  const { data: session } = useSession();
  const pathname = usePathname();

  // Simple breadcrumbs logic
  const getBreadcrumbs = () => {
    const parts = pathname.split("/").filter(Boolean);
    return parts.map((part, index) => {
      const formatted = part.charAt(0).toUpperCase() + part.slice(1);
      return (
        <span key={part} className="flex items-center">
          {index > 0 && <span className="mx-2 text-muted-foreground">/</span>}
          <span
            className={
              index === parts.length - 1
                ? "text-foreground font-semibold"
                : "text-muted-foreground"
            }
          >
            {formatted}
          </span>
        </span>
      );
    });
  };

  return (
    <header className="h-16 fixed top-0 right-0 left-0 lg:left-[var(--sidebar-width)] z-30 glass border-b border-border/40 flex items-center justify-between px-6 transition-all">
      {/* Left side: Mobile menu trigger & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMobileSidebar}
          className="p-2 -ml-2 rounded-lg hover:bg-white/5 lg:hidden text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <Menu size={20} />
        </button>

        <nav className="hidden sm:flex items-center text-sm font-medium">
          {getBreadcrumbs()}
        </nav>
      </div>

      {/* Right side: Actions & User profile */}
      <div className="flex items-center gap-4">
        <ThemeToggle />

        <button className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-pink" />
        </button>

        <div className="h-8 w-px bg-border/40" />

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-sm font-medium text-foreground">
              {session?.user?.name || "Admin User"}
            </span>
            <span className="text-xs text-muted-foreground">
              {(session?.user as any)?.role || "ADMIN"}
            </span>
          </div>

          <div className="w-9 h-9 rounded-full bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple shadow-inner">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <UserIcon size={18} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

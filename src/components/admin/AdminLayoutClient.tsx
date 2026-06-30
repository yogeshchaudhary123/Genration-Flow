"use client";

import React, { useState, useEffect } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

interface AdminLayoutClientProps {
  children: React.ReactNode;
}

export function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Sync collapse state with localStorage if available
  useEffect(() => {
    const saved = localStorage.getItem("admin-sidebar-collapsed");
    if (saved) {
      setIsCollapsed(saved === "true");
    }
  }, []);

  const handleToggleCollapse = () => {
    const newVal = !isCollapsed;
    setIsCollapsed(newVal);
    localStorage.setItem("admin-sidebar-collapsed", String(newVal));
  };

  return (
    <div
      className="min-h-screen bg-background text-foreground flex"
      style={{
        // Define dynamic sidebar width variables
        "--sidebar-width": isCollapsed ? "80px" : "260px",
      } as React.CSSProperties}
    >
      {/* Sidebar */}
      <AdminSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-[var(--sidebar-width)] transition-all duration-300">
        {/* Header */}
        <AdminHeader onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)} />

        {/* Content Wrapper */}
        <main className="flex-1 pt-24 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

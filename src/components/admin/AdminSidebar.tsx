"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Receipt,
  CreditCard,
  Settings,
  Bot,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Home,
} from "lucide-react";
import { motion } from "framer-motion";
import { signOut } from "next-auth/react";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function AdminSidebar({
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Products", href: "/admin/products", icon: ShoppingBag },
    { name: "Orders", href: "/admin/orders", icon: Receipt },
    { name: "Payments", href: "/admin/payments", icon: CreditCard },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const sidebarVariants = {
    expanded: { width: "260px" },
    collapsed: { width: "80px" },
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <motion.aside
        initial={false}
        animate={isCollapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col h-full glass border-r border-border/40 transition-transform lg:transition-none ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header/Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border/20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(139,92,246,0.5)]">
              <Bot size={20} />
            </div>
            {!isCollapsed && (
              <span className="font-bold text-lg tracking-tight">
                Gen<span className="text-gradient">Flow</span> Admin
              </span>
            )}
          </Link>

          {/* Close buttons */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/5 lg:hidden text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all group relative ${
                  isActive
                    ? "bg-brand-purple/10 text-brand-purple"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                <Icon
                  size={20}
                  className={isActive ? "text-brand-purple" : "text-muted-foreground group-hover:text-foreground"}
                />
                {!isCollapsed && <span>{item.name}</span>}

                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute right-2 w-1.5 h-1.5 rounded-full bg-brand-purple"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-3 border-t border-border/20 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
          >
            <Home size={20} />
            {!isCollapsed && <span>View Store</span>}
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
          >
            <LogOut size={20} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>

        {/* Collapse Toggle Button (Desktop only) */}
        <button
          onClick={onToggleCollapse}
          className="absolute bottom-20 -right-4 hidden lg:flex w-8 h-8 rounded-full border border-border bg-background hover:bg-accent text-muted-foreground hover:text-foreground items-center justify-center cursor-pointer shadow-md z-50"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </motion.aside>
    </>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, User, Search, Menu, X, Bot, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useSession } from "next-auth/react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const cartCount = useStore((state) => state.cart.reduce((n, i) => n + i.quantity, 0));
  const user = useStore((state) => state.user);
  const isSyncing = useStore((state) => state.isSyncing);

  const { data: session, status } = useSession();
  const login = useStore((state) => state.login);
  const logout = useStore((state) => state.logout);

  useEffect(() => {
    setMounted(true);
    
    // Sync NextAuth session with store
    if (status === "authenticated" && session?.user) {
      login({
        id: (session.user as any).id || "user_session",
        name: session.user.name || "",
        email: session.user.email || "",
      });
    } else if (status === "unauthenticated") {
      logout();
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [session, status, login, logout]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/70 backdrop-blur-xl border-b border-black/10 dark:border-white/10 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(139,92,246,0.5)] group-hover:shadow-[0_0_25px_rgba(139,92,246,0.8)] transition-shadow">
            <Bot size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:block">
            Generation<span className="text-gradient">Flow</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-brand-purple relative ${
                pathname === link.href ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {link.name}
              {pathname === link.href && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-purple to-brand-blue rounded-full"
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            <Search size={20} />
          </button>
          
          <Link href={user ? "/orders" : "/login"} className="p-2 text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            <User size={20} />
          </Link>
          
          <button 
            onClick={() => useStore.getState().toggleCart(true)}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors relative group"
          >
            <div className="relative">
              <ShoppingBag size={20} className={isSyncing ? "opacity-20 transition-opacity" : "transition-opacity"} />
              {isSyncing && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 size={16} className="animate-spin text-brand-purple" />
                </div>
              )}
            </div>
            {mounted && cartCount > 0 && (
              <motion.span
                key={cartCount}
                initial={{ scale: 0, y: -4 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-brand-pink text-[10px] font-bold flex items-center justify-center rounded-full text-white leading-none shadow-sm z-10"
              >
                {cartCount > 99 ? "99+" : cartCount}
              </motion.span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-muted-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-black/10 dark:border-white/10 overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-lg font-medium p-2 rounded-lg transition-colors ${
                    pathname === link.href ? "bg-black/5 dark:bg-white/5 text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-black/10 dark:bg-white/10 my-2" />
              <Link
                href={user ? "/orders" : "/login"}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium p-2 rounded-lg text-muted-foreground flex items-center gap-2"
              >
                <User size={20} />
                {user ? "My Account" : "Login"}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

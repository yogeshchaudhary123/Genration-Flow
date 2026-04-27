"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bot, Mail, Lock, ArrowRight, User } from "lucide-react";
import { useStore } from "@/lib/store";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useStore();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Registration failed");
      }

      const data = await res.json();
      
      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        throw new Error(signInRes.error);
      }

      login({ id: data.userId, name, email });
      router.push("/");
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-brand-pink/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] left-[0%] w-[40%] h-[40%] bg-brand-purple/20 blur-[100px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 relative z-10 flex items-center justify-center py-20">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-0 glass rounded-[2.5rem] overflow-hidden shadow-2xl flex-row-reverse">
          
          {/* Left Side - Form */}
          <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-black/5 dark:bg-black/20 order-2 lg:order-1">
            <div className="w-full max-w-md mx-auto">
              <Link href="/" className="flex items-center gap-2 mb-12 lg:hidden">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center text-white font-bold">
                  <Bot size={20} />
                </div>
                <span className="font-bold text-xl tracking-tight">
                  Generation<span className="text-gradient">Flow</span>
                </span>
              </Link>

              <h1 className="text-3xl font-bold mb-2">Create Account</h1>
              <p className="text-muted-foreground mb-8">Join the next generation of eCommerce</p>

              <form onSubmit={handleRegister} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium pl-1 text-foreground/80">Full Name</label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Alex Carter"
                      className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3 pl-11 pr-4 focus:outline-none focus:border-brand-pink focus:bg-black/10 dark:focus:bg-white/10 transition-all text-foreground placeholder:text-foreground/30"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium pl-1 text-foreground/80">Email Address</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="alex@example.com"
                      className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3 pl-11 pr-4 focus:outline-none focus:border-brand-pink focus:bg-black/10 dark:focus:bg-white/10 transition-all text-foreground placeholder:text-foreground/30"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80 pl-1">Password</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3 pl-11 pr-4 focus:outline-none focus:border-brand-pink focus:bg-black/10 dark:focus:bg-white/10 transition-all text-foreground placeholder:text-foreground/30"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-pink to-brand-purple text-white font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mt-4 shadow-[0_0_20px_rgba(236,72,153,0.3)] disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Sign Up <ArrowRight size={18} /></>
                  )}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-brand-pink hover:text-brand-purple font-medium transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Right Side - Visual */}
          <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-black/5 dark:bg-white/5 border-l border-black/10 dark:border-white/10 relative overflow-hidden order-1 lg:order-2">
            <div className="absolute inset-0 bg-gradient-to-bl from-brand-pink/10 to-transparent" />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-10 w-64 h-64 flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-gradient-to-bl from-brand-pink to-brand-purple opacity-20 blur-3xl rounded-full animate-pulse" />
              <Bot size={120} className="text-white drop-shadow-[0_0_30px_rgba(236,72,153,0.8)]" />
            </motion.div>
            <div className="relative z-10 text-center mt-12">
              <h2 className="text-3xl font-bold mb-4">Experience the future.</h2>
              <p className="text-muted-foreground text-lg max-w-sm mx-auto">
                Discover a personalized shopping experience driven by artificial intelligence.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

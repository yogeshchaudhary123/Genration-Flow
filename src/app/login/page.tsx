"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bot, Mail, Lock, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useStore();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        throw new Error("Invalid email or password");
      }

      // After successful login, update Zustand store
      // In a full implementation we'd fetch user details here
      login({ id: "user_session", name: email.split("@")[0], email });
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
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-brand-purple/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[0%] w-[40%] h-[40%] bg-brand-blue/20 blur-[100px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 relative z-10 flex items-center justify-center py-20">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-0 glass rounded-[2.5rem] overflow-hidden shadow-2xl">
          
          {/* Left Side - Visual */}
          <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-black/5 dark:bg-white/5 border-r border-black/10 dark:border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/10 to-transparent" />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-10 w-64 h-64 flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-purple to-brand-blue opacity-20 blur-3xl rounded-full animate-pulse" />
              <Bot size={120} className="text-white drop-shadow-[0_0_30px_rgba(139,92,246,0.8)]" />
            </motion.div>
            <div className="relative z-10 text-center mt-12">
              <h2 className="text-3xl font-bold mb-4">Welcome back to the future.</h2>
              <p className="text-muted-foreground text-lg max-w-sm mx-auto">
                Sign in to continue your AI-powered shopping journey with Generation Flow.
              </p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-black/5 dark:bg-black/20">
            <div className="w-full max-w-md mx-auto">
              <Link href="/" className="flex items-center gap-2 mb-12 lg:hidden">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center text-white font-bold">
                  <Bot size={20} />
                </div>
                <span className="font-bold text-xl tracking-tight">
                  Generation<span className="text-gradient">Flow</span>
                </span>
              </Link>

              <h1 className="text-3xl font-bold mb-2">Sign In</h1>
              <p className="text-muted-foreground mb-8">Enter your credentials to access your account</p>

              <form onSubmit={handleLogin} className="space-y-5">
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
                      className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3 pl-11 pr-4 focus:outline-none focus:border-brand-purple focus:bg-black/10 dark:focus:bg-white/10 transition-all text-foreground placeholder:text-foreground/30"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between pl-1">
                    <label className="text-sm font-medium text-foreground/80">Password</label>
                    <Link href="#" className="text-xs text-brand-purple hover:text-brand-pink transition-colors">Forgot password?</Link>
                  </div>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3 pl-11 pr-4 focus:outline-none focus:border-brand-purple focus:bg-black/10 dark:focus:bg-white/10 transition-all text-foreground placeholder:text-foreground/30"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-purple to-brand-blue text-white font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mt-4 shadow-[0_0_20px_rgba(139,92,246,0.3)] disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Sign In <ArrowRight size={18} /></>
                  )}
                </button>
              </form>

              <div className="mt-8 flex items-center gap-4 before:flex-1 before:h-px before:bg-black/10 dark:before:bg-white/10 after:flex-1 after:h-px after:bg-black/10 dark:after:bg-white/10">
                <span className="text-sm text-muted-foreground">or continue with</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <button className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 transition-colors font-medium text-sm">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" fill="currentColor"/></svg>
                  Google
                </button>
                <button className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 transition-colors font-medium text-sm">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2C6.477,2,2,6.477,2,12c0,4.991,3.657,9.128,8.438,9.879V14.89h-2.54V12h2.54V9.797c0-2.506,1.492-3.89,3.777-3.89c1.094,0,2.238,0.195,2.238,0.195v2.46h-1.26c-1.243,0-1.63,0.771-1.63,1.562V12h2.773l-0.443,2.89h-2.33v6.989C18.343,21.129,22,16.99,22,12C22,6.477,17.523,2,12,2z" fill="currentColor"/></svg>
                  Facebook
                </button>
              </div>

              <p className="mt-8 text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/register" className="text-brand-purple hover:text-brand-pink font-medium transition-colors">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

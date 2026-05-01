"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bot, Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSuccess(true);
      toast.success("Password reset successful!");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
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
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full glass rounded-[2.5rem] p-8 sm:p-12 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 to-transparent pointer-events-none" />

          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center text-white shadow-lg">
              <Bot size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Reset Password</h1>
              <p className="text-sm text-muted-foreground">Create your new password</p>
            </div>
          </div>

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium pl-1 text-foreground/80">New Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-brand-purple focus:bg-black/10 dark:focus:bg-white/10 transition-all text-foreground placeholder:text-foreground/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium pl-1 text-foreground/80">Confirm New Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-brand-purple focus:bg-black/10 dark:focus:bg-white/10 transition-all text-foreground placeholder:text-foreground/30"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-purple to-brand-blue text-white font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(139,92,246,0.3)] disabled:opacity-50 mt-4"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Update Password <ArrowRight size={18} /></>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} className="text-green-500" />
              </div>
              <h3 className="text-2xl font-bold mb-3">All set!</h3>
              <p className="text-muted-foreground mb-8">
                Your password has been reset successfully. You'll be redirected to the login page in a few seconds.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-brand-purple font-bold hover:text-brand-pink transition-colors"
              >
                Go to Login now <ArrowRight size={18} />
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

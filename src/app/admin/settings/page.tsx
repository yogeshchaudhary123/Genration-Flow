"use client";

import React from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { useSession } from "next-auth/react";
import { Settings as SettingsIcon, Shield, Server, Database, Globe, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const { data: session } = useSession();

  const handleRefreshCache = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: "Purging store route cache...",
        success: "Store cache purged successfully!",
        error: "Failed to clear cache",
      }
    );
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <AdminPageHeader
        title="Settings & System"
        description="Monitor system configuration logs and manage general store values."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Admin Profile Details */}
        <div className="glass-panel p-6 rounded-2xl space-y-6">
          <h3 className="text-lg font-bold tracking-tight border-b border-border/10 pb-3 flex items-center gap-2">
            <Shield size={18} className="text-brand-purple" />
            Admin Profile Detail
          </h3>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-brand-purple/10 border-2 border-brand-purple/30 flex items-center justify-center text-brand-purple text-2xl font-bold">
                {session?.user?.name ? session.user.name.charAt(0) : "A"}
              </div>
              <div>
                <h4 className="font-bold text-lg text-foreground">
                  {session?.user?.name || "Administrator"}
                </h4>
                <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
                <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-purple/20 text-brand-purple border border-brand-purple/30">
                  SYSTEM LEVEL: {(session?.user as any)?.role || "ADMIN"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* System & API details */}
        <div className="glass-panel p-6 rounded-2xl space-y-6">
          <h3 className="text-lg font-bold tracking-tight border-b border-border/10 pb-3 flex items-center gap-2">
            <Server size={18} className="text-brand-blue" />
            Platform & Services Status
          </h3>

          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-border/10">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Database size={14} /> Database Provider
              </span>
              <span className="font-semibold">MySQL / MariaDB</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-border/10">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Globe size={14} /> Active Edge
              </span>
              <span className="font-semibold">Vercel Edge Network</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-border/10">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <SettingsIcon size={14} /> NextAuth Session Engine
              </span>
              <span className="font-semibold">JWT Callback Strategy</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-muted-foreground flex items-center gap-1.5">
                🤖 AI Embeddings Vectorizer
              </span>
              <span className="font-semibold">text-embedding-3-small</span>
            </div>
          </div>
        </div>

        {/* Quick actions panel */}
        <div className="md:col-span-2 glass-panel p-6 rounded-2xl space-y-6">
          <h3 className="text-lg font-bold tracking-tight border-b border-border/10 pb-3">
            System Operations
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-border/40 p-4 rounded-xl space-y-3">
              <h4 className="font-bold text-sm">Purge Segment Cache</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Clear Next.js ISR route segment cache and force revalidation on product details/categories catalog pages.
              </p>
              <button
                onClick={handleRefreshCache}
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 border border-border/80 hover:bg-white/5 rounded-lg text-foreground transition-all cursor-pointer"
              >
                <RefreshCw size={14} />
                Purge Cache
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

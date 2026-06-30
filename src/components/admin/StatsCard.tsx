"use client";

import React from "react";
import { LucideIcon, DollarSign, ShoppingCart, Users, Package } from "lucide-react";
import { motion } from "framer-motion";

const iconMap = {
  "dollar": DollarSign,
  "shopping-cart": ShoppingCart,
  "users": Users,
  "package": Package,
};

export type StatsIconType = keyof typeof iconMap;

interface StatsCardProps {
  title: string;
  value: string | number;
  iconName: StatsIconType;
  description?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({
  title,
  value,
  iconName,
  description,
  trend,
  className = "",
}: StatsCardProps) {
  const Icon = iconMap[iconName] || Package;
  
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className={`glass-panel p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden group ${className}`}
    >
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-tr from-brand-purple/10 to-brand-blue/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
            {title}
          </p>
          <h3 className="text-3xl font-bold mt-2 tracking-tight">
            {value}
          </h3>
        </div>
        
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-purple/20 to-brand-blue/20 flex items-center justify-center text-brand-purple shadow-[0_0_15px_rgba(139,92,246,0.1)] group-hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all">
          <Icon size={24} />
        </div>
      </div>

      {(description || trend) && (
        <div className="mt-4 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={`font-semibold px-2 py-0.5 rounded-full ${
                trend.isPositive
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-rose-500/10 text-rose-400"
              }`}
            >
              {trend.value}
            </span>
          )}
          {description && (
            <span className="text-muted-foreground">{description}</span>
          )}
        </div>
      )}
    </motion.div>
  );
}

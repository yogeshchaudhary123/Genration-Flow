"use client";

import React from "react";

type StatusType =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "COMPLETED"
  | "REFUNDED";

interface StatusBadgeProps {
  status: StatusType;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles: { [key in StatusType]: string } = {
    PENDING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    PAID: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    FAILED: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    SHIPPED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    DELIVERED: "bg-teal-500/10 text-teal-500 border-teal-500/20",
    CANCELLED: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
    COMPLETED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    REFUNDED: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  };

  const formatted = status.charAt(0) + status.slice(1).toLowerCase();

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
        styles[status] || "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
      }`}
    >
      {formatted}
    </span>
  );
}

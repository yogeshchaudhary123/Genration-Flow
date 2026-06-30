"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDanger?: boolean;
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isDanger = true,
  isLoading = false,
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="glass-panel w-full max-w-md p-6 rounded-2xl relative z-10 shadow-2xl overflow-hidden"
          >
            <div className="flex gap-4 items-start">
              <div
                className={`p-3 rounded-xl flex-shrink-0 ${
                  isDanger
                    ? "bg-rose-500/10 text-rose-500"
                    : "bg-brand-purple/10 text-brand-purple"
                }`}
              >
                <AlertTriangle size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold tracking-tight">{title}</h3>
                <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                  {message}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium border border-border rounded-xl hover:bg-white/5 disabled:opacity-50 transition-colors cursor-pointer"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className={`px-4 py-2 text-sm font-medium rounded-xl text-white shadow-sm flex items-center gap-2 disabled:opacity-50 transition-colors cursor-pointer ${
                  isDanger
                    ? "bg-rose-600 hover:bg-rose-700"
                    : "bg-brand-purple hover:bg-brand-purple/90"
                }`}
              >
                {isLoading ? "Processing..." : confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

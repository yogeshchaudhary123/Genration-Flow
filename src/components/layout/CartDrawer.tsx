"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, Shield, Loader2 } from "lucide-react";
import { useStore } from "@/lib/store";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

export function CartDrawer() {
  const { isCartOpen, toggleCart, cart, removeFromCart, updateQuantity, cartTotal, isSyncing } = useStore();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") toggleCart(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [toggleCart]);

  // Prevent scroll when open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isCartOpen]);

  const subtotal = cartTotal();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => toggleCart(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-white/10 shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-purple/20 flex items-center justify-center text-brand-purple">
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Your Cart</h2>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">{cart.length} items</p>
                    {isSyncing && (
                      <span className="flex items-center gap-1 text-[10px] text-brand-purple font-medium uppercase tracking-wider animate-pulse">
                        <Loader2 size={10} className="animate-spin" /> Syncing...
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => toggleCart(false)}
                className="p-2 hover:bg-white/5 rounded-full transition-colors text-muted-foreground hover:text-foreground"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag size={40} />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Cart is empty</h3>
                  <p className="text-sm mb-8">Add some products to get started!</p>
                  <button
                    onClick={() => {
                      toggleCart(false);
                      window.location.href = "/products";
                    }}
                    className="text-brand-purple font-medium hover:underline flex items-center gap-1"
                  >
                    Browse Products <ArrowRight size={16} />
                  </button>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 group"
                    >
                      <div className="relative w-20 h-20 rounded-xl bg-white/5 overflow-hidden shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-medium text-sm line-clamp-1 group-hover:text-brand-purple transition-colors">
                            {item.name}
                          </h4>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">
                          {item.color} {item.size && `• ${item.size}`}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 bg-white/5 rounded-lg p-0.5 border border-white/5">
                            <button
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="p-1 hover:bg-white/10 rounded transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-white/10 rounded transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <span className="font-bold text-brand-purple">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-black/20 backdrop-blur-xl">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-brand-purple">${subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  onClick={() => toggleCart(false)}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-purple to-brand-blue text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] mb-3"
                >
                  Checkout Now <ArrowRight size={18} />
                </Link>
                
                <Link
                  href="/cart"
                  onClick={() => toggleCart(false)}
                  className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-foreground font-medium flex items-center justify-center gap-2 transition-colors border border-white/5"
                >
                  View Full Cart
                </Link>

                <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest">
                  <Shield size={12} />
                  Secure Checkout Guaranteed
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

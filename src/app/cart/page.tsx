"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Shield } from "lucide-react";
import { useStore } from "@/lib/store";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useStore();
  const subtotal = cartTotal();
  const shipping = subtotal > 0 ? (subtotal > 500 ? 0 : 25) : 0;
  const tax = subtotal * 0.08; // 8% dummy tax
  const total = subtotal + shipping + tax;

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center min-h-[70vh]">
        <div className="w-48 h-48 bg-white/5 rounded-full flex items-center justify-center mb-8 relative">
          <div className="absolute inset-0 bg-brand-purple/20 blur-3xl rounded-full" />
          <ShoppingBag size={80} className="text-brand-purple opacity-50 relative z-10" />
        </div>
        <h1 className="text-4xl font-bold mb-4 tracking-tight">Your cart is empty</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-md">
          Looks like you haven't added anything yet. Discover our amazing products and start shopping!
        </p>
        <Link
          href="/products"
          className="px-8 py-4 rounded-full bg-gradient-to-r from-brand-purple to-brand-blue text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
        >
          Explore Products <ArrowRight size={20} />
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-4xl font-bold mb-12 tracking-tight">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items */}
        <div className="flex-1 space-y-6">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3 }}
                className="glass rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6"
              >
                <div className="relative w-full sm:w-32 h-32 rounded-2xl bg-white/5 overflow-hidden shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>

                <div className="flex-1 w-full">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg line-clamp-1">{item.name}</h3>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-4 text-sm text-muted-foreground">
                    {item.color && <span>Color: {item.color}</span>}
                    {item.size && <span>Size: {item.size}</span>}
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3 bg-white/5 p-1 rounded-xl border border-white/10">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-muted-foreground"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-6 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-muted-foreground"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className="font-bold text-xl">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-[400px] shrink-0">
          <div className="glass rounded-3xl p-8 sticky top-24">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6 text-muted-foreground">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span className="text-white">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-white">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
              </div>
            </div>

            <div className="h-px w-full bg-white/10 mb-6" />

            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-bold">Total</span>
              <span className="text-3xl font-bold text-brand-purple">${total.toFixed(2)}</span>
            </div>

            <Link
              href="/checkout"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-purple to-brand-blue text-white font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(139,92,246,0.3)]"
            >
              Proceed to Checkout <ArrowRight size={20} />
            </Link>

            <div className="mt-6 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Shield size={16} />
              Secure Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

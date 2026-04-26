"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CreditCard, MapPin, Package, ArrowRight, ShieldCheck, Wallet } from "lucide-react";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";

const steps = [
  { id: 1, title: "Shipping Address", icon: MapPin },
  { id: 2, title: "Payment Method", icon: CreditCard },
  { id: 3, title: "Review Order", icon: Package },
];

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const { cart, cartTotal, clearCart } = useStore();
  const router = useRouter();

  const subtotal = cartTotal();
  const shipping = subtotal > 0 ? (subtotal > 500 ? 0 : 25) : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const [isProcessing, setIsProcessing] = useState(false);

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      clearCart();
      setIsProcessing(false);
      router.push("/orders"); // In a real app, go to success page or orders
    }, 2000);
  };

  if (cart.length === 0 && !isProcessing) {
    router.push("/cart");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-24 max-w-6xl">
      {/* Progress Indicator */}
      <div className="mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 rounded-full hidden md:block" />
        <div 
          className="absolute top-1/2 left-0 h-1 bg-brand-purple -translate-y-1/2 rounded-full hidden md:block transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
        
        <div className="flex flex-col md:flex-row justify-between relative z-10 gap-4 md:gap-0">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center md:flex-col gap-3 md:gap-2">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500 ${
                  currentStep > step.id 
                    ? "bg-brand-purple text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]" 
                    : currentStep === step.id 
                      ? "bg-white text-background shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
                      : "bg-background border border-white/20 text-muted-foreground"
                }`}
              >
                {currentStep > step.id ? <Check size={18} /> : <step.icon size={18} />}
              </div>
              <span className={`font-medium ${currentStep >= step.id ? "text-white" : "text-muted-foreground"}`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 glass rounded-3xl p-6 sm:p-8 min-h-[400px]">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground pl-1">First Name</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-purple transition-colors" defaultValue="Alex" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground pl-1">Last Name</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-purple transition-colors" defaultValue="Carter" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm text-muted-foreground pl-1">Address</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-purple transition-colors" defaultValue="123 Neon Avenue, Cyber District" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground pl-1">City</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-purple transition-colors" defaultValue="San Francisco" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground pl-1">Zip Code</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-purple transition-colors" defaultValue="94105" />
                  </div>
                </div>
                <button onClick={handleNext} className="w-full py-4 rounded-xl bg-brand-purple text-white font-medium mt-8 hover:bg-brand-purple/90 transition-colors">
                  Continue to Payment
                </button>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
                
                <div className="grid grid-cols-1 gap-4 mb-8">
                  <label className="relative p-4 border border-brand-purple bg-brand-purple/10 rounded-2xl cursor-pointer flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <CreditCard size={24} className="text-brand-purple" />
                      <div>
                        <p className="font-semibold text-white">Credit Card</p>
                        <p className="text-sm text-muted-foreground">Mastercard ending in 4242</p>
                      </div>
                    </div>
                    <div className="w-5 h-5 rounded-full border-4 border-brand-purple" />
                  </label>
                  
                  <label className="relative p-4 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors rounded-2xl cursor-pointer flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Wallet size={24} className="text-white/70" />
                      <div>
                        <p className="font-semibold text-white">UPI / Digital Wallet</p>
                        <p className="text-sm text-muted-foreground">Google Pay, Apple Pay, etc.</p>
                      </div>
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 border-white/20" />
                  </label>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground pl-1">Card Number</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-purple transition-colors" defaultValue="**** **** **** 4242" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground pl-1">Expiry Date</label>
                      <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-purple transition-colors" defaultValue="12/26" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground pl-1">CVC</label>
                      <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-purple transition-colors" defaultValue="***" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button onClick={() => setCurrentStep(1)} className="px-6 py-4 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors">
                    Back
                  </button>
                  <button onClick={handleNext} className="flex-1 py-4 rounded-xl bg-brand-purple text-white font-medium hover:bg-brand-purple/90 transition-colors">
                    Review Order
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold mb-6">Review Your Order</h2>
                
                <div className="space-y-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 py-2 border-b border-white/5 last:border-0">
                      <div className="w-16 h-16 rounded-lg bg-white/5 overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <div className="font-semibold">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 mt-6 flex items-start gap-4">
                  <ShieldCheck size={24} className="text-green-400 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-medium mb-1">Secure Transaction</h4>
                    <p className="text-sm text-muted-foreground">Your order is protected by enterprise-grade encryption. Generation Flow never stores your full card details.</p>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button onClick={() => setCurrentStep(2)} className="px-6 py-4 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors">
                    Back
                  </button>
                  <button 
                    onClick={handlePlaceOrder} 
                    disabled={isProcessing}
                    className="flex-1 py-4 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Place Order <ArrowRight size={18} /></>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-1">
          <div className="glass rounded-3xl p-8 sticky top-24">
            <h3 className="text-xl font-bold mb-6">Summary</h3>
            <div className="space-y-4 mb-6 text-muted-foreground">
              <div className="flex justify-between">
                <span>Subtotal ({cart.reduce((acc, c) => acc + c.quantity, 0)} items)</span>
                <span className="text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="text-white">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-white">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
              </div>
            </div>
            <div className="h-px w-full bg-white/10 mb-6" />
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">Total</span>
              <span className="text-3xl font-bold text-brand-purple">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

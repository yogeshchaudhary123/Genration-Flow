"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CreditCard, MapPin, Package, ArrowRight, ShieldCheck, Wallet } from "lucide-react";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { toast } from "react-hot-toast";

const steps = [
  { id: 1, title: "Shipping Address", icon: MapPin },
  { id: 2, title: "Payment Method", icon: CreditCard },
  { id: 3, title: "Review Order", icon: Package },
];

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { cart, cartTotal, clearCart } = useStore();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const [shippingData, setShippingData] = useState({
    firstName: "Alex",
    lastName: "Carter",
    address: "123 Neon Avenue, Cyber District",
    city: "San Francisco",
    zipCode: "94105"
  });

  const [paymentMethod, setPaymentMethod] = useState<"STRIPE" | "RAZORPAY">("STRIPE");
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cartTotal();
  const shipping = subtotal > 0 ? (subtotal > 500 ? 0 : 25) : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      const shippingAddress = `${shippingData.firstName} ${shippingData.lastName}, ${shippingData.address}, ${shippingData.city}, ${shippingData.zipCode}`;
      
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shippingAddress, paymentMethod }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Checkout failed");
      }

      // ── STRIPE ──────────────────────────────────────────────────────────
      if (data.paymentData?.type === "STRIPE") {
        toast.success("Redirecting to Stripe...");
        clearCart();
        window.location.href = data.paymentData.url;
        return;
      }

      // ── RAZORPAY ─────────────────────────────────────────────────────────
      // Razorpay does NOT use a redirect page — it opens a modal on this page.
      if (data.paymentData?.type === "RAZORPAY") {
        const { razorpayOrderId, amount, currency, key, orderId, successUrl } =
          data.paymentData;

        // Ensure Razorpay SDK is loaded
        if (typeof (window as any).Razorpay === "undefined") {
          throw new Error("Razorpay SDK not loaded. Please refresh and try again.");
        }

        await new Promise<void>((resolve, reject) => {
          const rzp = new (window as any).Razorpay({
            key,
            amount,
            currency,
            order_id: razorpayOrderId,
            name: "Generation Flow",
            description: `Order #${orderId}`,
            handler: async (response: {
              razorpay_order_id: string;
              razorpay_payment_id: string;
              razorpay_signature: string;
            }) => {
              try {
                // Verify payment on the server
                const verifyRes = await fetch("/api/razorpay/verify", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    orderId,
                  }),
                });
                const verifyData = await verifyRes.json();
                if (!verifyRes.ok) throw new Error(verifyData.error || "Verification failed");

                clearCart();
                toast.success("Payment successful! Redirecting...");
                window.location.href = successUrl;
                resolve();
              } catch (err: any) {
                reject(err);
              }
            },
            prefill: {
              name: `${shippingData.firstName} ${shippingData.lastName}`,
            },
            theme: { color: "#8B5CF6" },
            modal: {
              ondismiss: () => {
                reject(new Error("Payment cancelled"));
              },
            },
          });

          rzp.open();
        });

        return;
      }

      throw new Error("Unknown payment type in response");
    } catch (error: any) {
      toast.error(error.message);
      console.error("Checkout Error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (mounted && cart.length === 0 && !isProcessing) {
      router.push("/cart");
    }
  }, [mounted, cart.length, isProcessing, router]);

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-24 min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (cart.length === 0 && !isProcessing) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-24 max-w-6xl">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      {/* Progress Indicator */}
      <div className="mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-black/10 dark:bg-white/10 -translate-y-1/2 rounded-full hidden md:block" />
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
                      ? "bg-foreground text-background shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
                      : "bg-background border border-black/20 dark:border-white/20 text-muted-foreground"
                }`}
              >
                {currentStep > step.id ? <Check size={18} /> : <step.icon size={18} />}
              </div>
              <span className={`font-medium ${currentStep >= step.id ? "text-foreground" : "text-muted-foreground"}`}>
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
                    <input name="firstName" type="text" className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-purple transition-colors" value={shippingData.firstName} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground pl-1">Last Name</label>
                    <input name="lastName" type="text" className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-purple transition-colors" value={shippingData.lastName} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm text-muted-foreground pl-1">Address</label>
                    <input name="address" type="text" className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-purple transition-colors" value={shippingData.address} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground pl-1">City</label>
                    <input name="city" type="text" className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-purple transition-colors" value={shippingData.city} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground pl-1">Zip Code</label>
                    <input name="zipCode" type="text" className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-purple transition-colors" value={shippingData.zipCode} onChange={handleInputChange} />
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
                  <label 
                    onClick={() => setPaymentMethod("STRIPE")}
                    className={`relative p-4 border rounded-2xl cursor-pointer flex items-center justify-between transition-all ${paymentMethod === "STRIPE" ? "border-brand-purple bg-brand-purple/10" : "border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5"}`}
                  >
                    <div className="flex items-center gap-4">
                      <CreditCard size={24} className={paymentMethod === "STRIPE" ? "text-brand-purple" : "text-foreground/70"} />
                      <div>
                        <p className="font-semibold text-foreground">Stripe</p>
                        <p className="text-sm text-muted-foreground">Secure global payments</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-4 ${paymentMethod === "STRIPE" ? "border-brand-purple" : "border-black/20 dark:border-white/20"}`} />
                  </label>
                  
                  <label 
                    onClick={() => setPaymentMethod("RAZORPAY")}
                    className={`relative p-4 border rounded-2xl cursor-pointer flex items-center justify-between transition-all ${paymentMethod === "RAZORPAY" ? "border-brand-purple bg-brand-purple/10" : "border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5"}`}
                  >
                    <div className="flex items-center gap-4">
                      <Wallet size={24} className={paymentMethod === "RAZORPAY" ? "text-brand-purple" : "text-foreground/70"} />
                      <div>
                        <p className="font-semibold text-foreground">Razorpay</p>
                        <p className="text-sm text-muted-foreground">UPI, Cards & Netbanking</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-4 ${paymentMethod === "RAZORPAY" ? "border-brand-purple" : "border-black/20 dark:border-white/20"}`} />
                  </label>
                </div>

                <div className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/10 dark:border-white/10 flex items-start gap-4">
                  <ShieldCheck size={24} className="text-green-400 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-medium mb-1">Encrypted Payment</h4>
                    <p className="text-sm text-muted-foreground">Your payment details are encrypted and never stored on our servers.</p>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button onClick={() => setCurrentStep(1)} className="px-6 py-4 rounded-xl border border-black/10 dark:border-white/10 text-foreground font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
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
                    <div key={item.id} className="flex items-center gap-4 py-2 border-b border-black/5 dark:border-white/5 last:border-0">
                      <div className="w-16 h-16 rounded-lg bg-black/5 dark:bg-white/5 overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-foreground">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity} | {item.color} | {item.size}</p>
                      </div>
                      <div className="font-semibold text-foreground">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                  <div className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/10 dark:border-white/10">
                    <h4 className="text-sm text-muted-foreground mb-2 flex items-center gap-2 uppercase tracking-wider font-semibold">
                      <MapPin size={14} /> Shipping
                    </h4>
                    <p className="text-sm">{shippingData.firstName} {shippingData.lastName}</p>
                    <p className="text-sm text-muted-foreground">{shippingData.address}, {shippingData.city} {shippingData.zipCode}</p>
                  </div>
                  <div className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/10 dark:border-white/10">
                    <h4 className="text-sm text-muted-foreground mb-2 flex items-center gap-2 uppercase tracking-wider font-semibold">
                      <CreditCard size={14} /> Payment
                    </h4>
                    <p className="text-sm text-foreground">{paymentMethod === "STRIPE" ? "Stripe" : "Razorpay"}</p>
                    <p className="text-sm text-muted-foreground">Secure Payment Gateway</p>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button onClick={() => setCurrentStep(2)} className="px-6 py-4 rounded-xl border border-black/10 dark:border-white/10 text-foreground font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    Back
                  </button>
                  <button 
                    onClick={handlePlaceOrder} 
                    disabled={isProcessing}
                    className="flex-1 py-4 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                  >
                    {isProcessing ? (
                      <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Pay & Place Order <ArrowRight size={18} /></>
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
                <span className="text-foreground">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="text-foreground">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-foreground">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
              </div>
            </div>
            <div className="h-px w-full bg-black/10 dark:bg-white/10 mb-6" />
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

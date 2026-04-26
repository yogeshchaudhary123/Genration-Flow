"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      setTimeout(() => setIsSent(false), 3000);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-24 max-w-6xl">
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
        >
          Get in Touch
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-muted-foreground"
        >
          Have a question or need assistance? Our team is here to help.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Contact Info */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          <div className="glass p-8 rounded-3xl">
            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                  <Mail className="text-brand-purple" />
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">Email Us</h4>
                  <p className="text-muted-foreground">support@generationflow.com</p>
                  <p className="text-muted-foreground">partners@generationflow.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                  <Phone className="text-brand-blue" />
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">Call Us</h4>
                  <p className="text-muted-foreground">+1 (555) 123-4567</p>
                  <p className="text-sm text-white/50 mt-1">Mon-Fri from 8am to 5pm</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                  <MapPin className="text-brand-pink" />
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">Headquarters</h4>
                  <p className="text-muted-foreground">123 Neon Avenue</p>
                  <p className="text-muted-foreground">Cyber District, SF 94105</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-3xl h-64 relative overflow-hidden flex items-center justify-center">
             {/* Map Placeholder */}
            <div className="absolute inset-0 bg-[#0a0a0a] opacity-80 z-10" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center" />
            <div className="relative z-20 text-center">
              <MapPin size={32} className="text-brand-purple mx-auto mb-2 drop-shadow-lg" />
              <p className="font-medium text-white drop-shadow-md">San Francisco, CA</p>
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass p-8 md:p-10 rounded-3xl"
        >
          <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium pl-1">First Name</label>
                <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-purple transition-colors" placeholder="Jane" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium pl-1">Last Name</label>
                <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-purple transition-colors" placeholder="Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium pl-1">Email</label>
              <input required type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-purple transition-colors" placeholder="jane@example.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium pl-1">Subject</label>
              <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-purple transition-colors" placeholder="How can we help?" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium pl-1">Message</label>
              <textarea required rows={5} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-purple transition-colors resize-none" placeholder="Your message here..." />
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting || isSent}
              className={`w-full py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                isSent 
                  ? "bg-green-500/20 text-green-400 border border-green-500/50" 
                  : "bg-gradient-to-r from-brand-purple to-brand-blue text-white hover:opacity-90 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
              }`}
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : isSent ? (
                "Message Sent!"
              ) : (
                <>Send Message <Send size={18} /></>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

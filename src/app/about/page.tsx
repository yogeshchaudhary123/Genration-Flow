"use client";

import { motion } from "framer-motion";
import { Bot, Sparkles, Shield, Zap } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-purple/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
            >
              Reimagining <br />
              <span className="text-gradient">Commerce</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-muted-foreground leading-relaxed"
            >
              We believe shopping should be an intuitive, seamless, and intelligent experience. Generation Flow brings AI-first design to the modern consumer.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-black/20 border-y border-white/5">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative aspect-square rounded-[3rem] overflow-hidden bg-white/5 glass p-4"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-purple/30 to-brand-blue/30 z-10 mix-blend-overlay" />
              <div className="w-full h-full relative rounded-[2.5rem] overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000" 
                  alt="Futuristic eCommerce"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Born from the desire to eliminate choice paralysis, Generation Flow was built on a simple premise: what if your favorite store knew exactly what you were looking for?
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                By integrating state-of-the-art conversational AI with premium design aesthetics, we've created a platform that doesn't just list products—it understands you.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Generation Flow?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Experience the benefits of an AI-driven ecosystem.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Bot, title: "Intelligent Discovery", desc: "Our AI assistant analyzes your preferences to recommend products you'll genuinely love." },
              { icon: Zap, title: "Frictionless Experience", desc: "From browsing to checkout, every interaction is designed to be smooth and responsive." },
              { icon: Shield, title: "Uncompromising Security", desc: "Your data and transactions are protected by industry-leading encryption protocols." }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass p-8 rounded-3xl"
              >
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon size={24} className="text-brand-purple" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

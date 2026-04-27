"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Shield, Bot } from "lucide-react";
import { categories } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import Image from "next/image";

export default function Home() {
  const { toggleAiChat } = useStore();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products?featured=true");
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-purple/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/20 blur-[100px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 mb-8 backdrop-blur-md"
            >
              <Sparkles size={16} className="text-brand-pink" />
              <span className="text-sm font-medium text-foreground/80">Experience AI-Driven Commerce</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tight mb-8"
            >
              Shop Smarter with <br className="hidden md:block" />
              <span className="text-gradient">Generation Flow</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Discover the perfect products with our AI assistant. Browse, compare, and buy in a futuristic, immersive shopping experience.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button
                onClick={toggleAiChat}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-brand-purple to-brand-blue text-white font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(139,92,246,0.3)]"
              >
                <Bot size={20} />
                Start Shopping with AI
              </button>
              <Link
                href="/products"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-foreground font-medium flex items-center justify-center gap-2 hover:bg-black/10 dark:hover:bg-white/10 transition-colors backdrop-blur-md"
              >
                Browse Catalog
                <ArrowRight size={20} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products Carousel */}
      <section className="py-20 bg-black/5 dark:bg-black/20 border-y border-black/5 dark:border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold">Trending Now</h2>
            <Link href="/products" className="text-brand-purple hover:text-brand-pink transition-colors flex items-center gap-1">
              View all <ArrowRight size={16} />
            </Link>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-thin scrollbar-thumb-black/10 dark:scrollbar-thumb-white/10 snap-x snap-mandatory min-h-[400px]">
            {loading ? (
              <div className="w-full flex justify-center items-center">
                <div className="w-12 h-12 border-4 border-brand-purple border-t-transparent rounded-full animate-spin" />
              </div>
            ) : products.length === 0 ? (
              <div className="w-full text-center text-muted-foreground py-20">
                No products found. Add some in the database to see them here!
              </div>
            ) : (
              products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="min-w-[300px] md:min-w-[400px] snap-center glass rounded-3xl p-4 group cursor-pointer"
                >
                  <div className="relative h-[250px] md:h-[300px] rounded-2xl overflow-hidden mb-4 bg-black/5 dark:bg-white/5">
                    {product.images && (
                      <Image
                        src={product.images.split(',')[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                    {product.isNew && (
                      <div className="absolute top-4 left-4 px-3 py-1 bg-brand-purple text-white text-xs font-bold rounded-full backdrop-blur-md">
                        NEW
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/90 dark:from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <Link href={`/products/${product.id}`} className="w-full py-3 bg-black/10 dark:bg-white/20 backdrop-blur-md text-foreground dark:text-white text-center rounded-xl font-medium hover:bg-black/20 dark:hover:bg-white/30 transition-colors">
                        View Details
                      </Link>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold">{product.name}</h3>
                      <p className="font-medium text-lg">${product.price}</p>
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-2">{product.description}</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>


      {/* Categories Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category, i) => (
              <Link key={category.id} href={`/products?category=${category.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="glass rounded-3xl p-6 flex flex-col items-center justify-center gap-4 aspect-square hover:bg-black/5 dark:hover:bg-white/10 transition-colors group"
                >
                  <div className="w-16 h-16 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-purple/20 transition-all">
                    {/* Placeholder for icons */}
                    <div className="w-8 h-8 border-2 border-current rounded-md opacity-70 group-hover:opacity-100 group-hover:text-brand-purple transition-colors" />
                  </div>
                  <span className="font-medium text-center">{category.name}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Benefits */}
      <section className="py-24 bg-black/5 dark:bg-black/20 border-t border-black/5 dark:border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Bot, title: "AI Shopping Assistant", desc: "Chat with our intelligent bot to find exactly what you need in seconds." },
              { icon: Zap, title: "Smart Suggestions", desc: "Personalized recommendations based on your preferences and browsing history." },
              { icon: Shield, title: "Secure Checkout", desc: "Enterprise-grade security for your payments and personal data." },
            ].map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="text-center"
              >
                <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-brand-purple/20 to-brand-blue/20 rounded-3xl flex items-center justify-center mb-6 border border-black/10 dark:border-white/10">
                  <benefit.icon size={32} className="text-brand-pink" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

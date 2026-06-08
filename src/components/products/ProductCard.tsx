"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Eye } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string;
    category: string;
  };
  variant?: "default" | "compact";
}

export function ProductCard({ product, variant = "default" }: ProductCardProps) {
  const imageUrl = product.images.split(",")[0];

  if (variant === "compact") {
    return (
      <div className="bg-white/5 rounded-xl p-2 border border-white/10 hover:bg-white/10 transition-colors group">
        <div className="flex gap-3">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
            <Image src={imageUrl} alt={product.name} fill className="object-cover" />
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold truncate text-foreground">{product.name}</p>
              <p className="text-[10px] text-muted-foreground line-clamp-1">{product.category}</p>
            </div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-brand-pink font-bold">${product.price}</p>
              <Link 
                href={`/products/${product.id}`}
                className="text-[10px] bg-brand-blue/20 text-brand-blue px-2 py-0.5 rounded-full hover:bg-brand-blue/30 transition-colors"
              >
                View
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="glass rounded-3xl p-4 group cursor-pointer border border-white/10"
    >
      <div className="relative h-[200px] rounded-2xl overflow-hidden mb-4 bg-black/5 dark:bg-white/5">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Link 
            href={`/products/${product.id}`}
            className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
          >
            <Eye size={20} />
          </Link>
          <button className="p-3 bg-brand-purple text-white rounded-full hover:bg-brand-purple/80 transition-colors">
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
      <div>
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-lg font-bold truncate pr-2">{product.name}</h3>
          <p className="font-bold text-brand-pink">${product.price}</p>
        </div>
        <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed">
          {product.description}
        </p>
      </div>
    </motion.div>
  );
}

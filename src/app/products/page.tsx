"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Filter, LayoutGrid, List as ListIcon, Star, ShoppingCart, Heart } from "lucide-react";
import { mockProducts, categories, Product } from "@/lib/mock-data";
import { useStore } from "@/lib/store";

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");
  
  const [activeCategory, setActiveCategory] = useState<string | null>(initialCategory);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { addToCart } = useStore();

  const filteredProducts = activeCategory
    ? mockProducts.filter((p) => p.category === activeCategory)
    : mockProducts;

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      color: product.variants.color?.[0],
      size: product.variants.size?.[0],
    });
  };

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="glass rounded-3xl p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-6 text-xl font-semibold">
              <Filter size={20} />
              <h3>Filters</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-3">Categories</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveCategory(null)}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                      activeCategory === null ? "bg-brand-purple/20 text-brand-purple font-medium" : "hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                  >
                    All Products
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setActiveCategory(c.id)}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                        activeCategory === c.id ? "bg-brand-purple/20 text-brand-purple font-medium" : "hover:bg-black/5 dark:hover:bg-white/5"
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-3">Price Range</h4>
                <input type="range" className="w-full accent-brand-purple" min="0" max="5000" />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>$0</span>
                  <span>$5000+</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h1 className="text-3xl font-bold">
              {activeCategory ? categories.find(c => c.id === activeCategory)?.name : "All Products"}
              <span className="text-muted-foreground text-lg ml-2 font-normal">({filteredProducts.length})</span>
            </h1>

            <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/10 dark:border-white/10">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-black/10 dark:bg-white/10 text-foreground dark:text-white" : "text-muted-foreground hover:text-foreground dark:hover:text-white"}`}
              >
                <LayoutGrid size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-black/10 dark:bg-white/10 text-foreground dark:text-white" : "text-muted-foreground hover:text-foreground dark:hover:text-white"}`}
              >
                <ListIcon size={20} />
              </button>
            </div>
          </div>

          {/* Product Grid/List */}
          {filteredProducts.length > 0 ? (
            <div className={viewMode === "grid" 
              ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" 
              : "flex flex-col gap-6"
            }>
              {filteredProducts.map((product, i) => (
                <Link href={`/products/${product.id}`} key={product.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className={`glass rounded-3xl p-4 group flex ${viewMode === "list" ? "flex-row gap-6 items-center" : "flex-col"} h-full`}
                  >
                    <div className={`relative rounded-2xl overflow-hidden bg-black/5 dark:bg-white/5 shrink-0 ${viewMode === "list" ? "w-48 h-48" : "w-full aspect-[4/3] mb-4"}`}>
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {product.isNew && (
                        <div className="absolute top-3 left-3 px-2 py-1 bg-brand-purple text-white text-[10px] font-bold rounded-full backdrop-blur-md">
                          NEW
                        </div>
                      )}
                      <button className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-black/40 backdrop-blur-md rounded-full text-black/70 dark:text-white/70 hover:text-brand-pink dark:hover:text-brand-pink transition-colors opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0 duration-300">
                        <Heart size={16} />
                      </button>
                    </div>

                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-1 gap-2">
                        <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
                        <p className="font-medium text-lg shrink-0">${product.price}</p>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm text-yellow-500 mb-2">
                        <Star size={14} className="fill-current" />
                        <span className="text-foreground/80">{product.rating}</span>
                        <span className="text-muted-foreground text-xs ml-1">({product.reviews})</span>
                      </div>

                      {viewMode === "list" && (
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{product.description}</p>
                      )}

                      <div className="mt-auto pt-4 flex gap-2">
                        <button 
                          onClick={(e) => handleAddToCart(e, product)}
                          className="flex-1 py-2.5 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors text-sm"
                        >
                          <ShoppingCart size={16} />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="glass rounded-3xl p-12 text-center">
              <h3 className="text-2xl font-bold mb-2">No products found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or browsing all categories.</p>
              <button 
                onClick={() => setActiveCategory(null)}
                className="mt-6 px-6 py-2 bg-brand-purple rounded-full font-medium hover:bg-brand-purple/90 transition-colors text-white"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-24 text-center">Loading products...</div>}>
      <ProductsContent />
    </Suspense>
  );
}

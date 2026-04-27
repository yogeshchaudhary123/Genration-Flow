"use client";

import { useState, use, useEffect } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Shield, Truck, Sparkles, ShoppingBag, Plus, Minus, Check, Bot } from "lucide-react";
import { mockReviews } from "@/lib/mock-data";
import { useStore } from "@/lib/store";

export default function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const { addToCart, toggleAiChat } = useStore();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${resolvedParams.slug}`);
        if (res.ok) {
          const data = await res.json();
          // Transform database format to match component needs
          const transformedProduct = {
            ...data,
            images: data.images.split(','),
            variants: {
              color: data.colors ? data.colors.split(',') : [],
              size: data.sizes ? data.sizes.split(',') : [],
            },
            features: data.features.split(','),
          };
          setProduct(transformedProduct);
          if (transformedProduct.variants.color.length > 0) setSelectedColor(transformedProduct.variants.color[0]);
          if (transformedProduct.variants.size.length > 0) setSelectedSize(transformedProduct.variants.size[0]);
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [resolvedParams.slug]);

  if (loading) {
    return <div className="container mx-auto px-4 py-24 text-center">Loading product details...</div>;
  }

  if (!product) {
    notFound();
  }

  const handleAddToCart = async () => {
    await addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images[0],
      color: selectedColor,
      size: selectedSize,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        {/* Image Gallery */}
        <div className="space-y-6">
          <div className="glass rounded-3xl p-4 aspect-square relative flex items-center justify-center overflow-hidden group">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full relative rounded-2xl overflow-hidden"
              >
                <Image
                  src={product.images[activeImage]}
                  alt={product.name}
                  fill
                  className="object-cover cursor-zoom-in"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto scrollbar-none snap-x">
              {product.images.map((img: any, i: any) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 snap-center transition-all ${activeImage === i ? "ring-2 ring-brand-purple ring-offset-2 ring-offset-background" : "opacity-50 hover:opacity-100"
                    }`}
                >
                  <Image src={img} alt={`Thumbnail ${i}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{product.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1 text-yellow-500 bg-black/5 dark:bg-white/5 px-3 py-1 rounded-full border border-black/10 dark:border-white/10">
                <Star size={16} className="fill-current" />
                <span className="text-foreground dark:text-white font-medium">{product.rating}</span>
                <span className="text-muted-foreground text-sm ml-1">({product.reviews} reviews)</span>
              </div>
            </div>

            <div className="flex items-end gap-3 mb-6">
              <span className="text-4xl font-bold">${product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-muted-foreground line-through mb-1">${product.originalPrice}</span>
                  <span className="text-brand-pink font-medium bg-brand-pink/10 px-2 py-0.5 rounded text-sm mb-1">
                    Save {product.discount}%
                  </span>
                </>
              )}
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          <div className="h-px w-full bg-black/10 dark:bg-white/10 my-6" />

          {/* Variants */}
          <div className="space-y-6 mb-8">
            {product.variants.color && (
              <div>
                <h3 className="font-medium mb-3">Color: <span className="text-muted-foreground">{selectedColor}</span></h3>
                <div className="flex flex-wrap gap-3">
                  {product.variants.color.map((color: any) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-xl border transition-all ${selectedColor === color
                        ? "border-brand-purple bg-brand-purple/20 text-foreground dark:text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                        : "border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:border-black/20 dark:hover:border-white/30 text-muted-foreground"
                        }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.variants.size && (
              <div>
                <h3 className="font-medium mb-3">Size/Capacity: <span className="text-muted-foreground">{selectedSize}</span></h3>
                <div className="flex flex-wrap gap-3">
                  {product.variants.size.map((size: any) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-xl border transition-all ${selectedSize === size
                        ? "border-brand-blue bg-brand-blue/20 text-foreground dark:text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                        : "border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:border-black/20 dark:hover:border-white/30 text-muted-foreground"
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <div className="flex items-center justify-between glass rounded-2xl p-1 w-full sm:w-32 h-14">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                <Minus size={18} />
              </button>
              <span className="font-medium text-lg w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className={`flex-1 h-14 rounded-2xl font-medium flex items-center justify-center gap-2 transition-all duration-300 ${isAdded
                ? "bg-green-500/20 text-green-400 border border-green-500/50"
                : "bg-gradient-to-r from-brand-purple to-brand-blue text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:opacity-90"
                }`}
            >
              {isAdded ? (
                <>
                  <Check size={20} />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingBag size={20} />
                  Add to Cart
                </>
              )}
            </button>
          </div>

          {/* Features/Trust Badges */}
          <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-black/10 dark:border-white/10">
            <div className="flex items-center gap-3 text-muted-foreground text-sm">
              <Shield size={20} className="text-brand-purple" />
              <span>1 Year Warranty</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground text-sm">
              <Truck size={20} className="text-brand-blue" />
              <span>Free Global Shipping</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Assistant Panel */}
      <div className="mb-20">
        <div className="glass-panel p-1 rounded-[2.5rem] bg-gradient-to-r from-brand-purple/20 via-brand-pink/20 to-brand-blue/20">
          <div className="bg-background/90 backdrop-blur-3xl rounded-[2.25rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <Bot size={24} className="text-brand-purple" />
                <h2 className="text-2xl font-bold">Unsure if this is right for you?</h2>
              </div>
              <p className="text-muted-foreground text-lg mb-6">
                Our AI shopping assistant can analyze your needs, compare {product.name} with alternatives, and help you make the perfect choice.
              </p>
              <button
                onClick={toggleAiChat}
                className="px-6 py-3 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 border border-black/10 dark:border-white/20 rounded-full font-medium transition-colors flex items-center gap-2"
              >
                <Sparkles size={18} className="text-brand-pink" />
                Ask AI about this product
              </button>
            </div>
            <div className="relative w-48 h-48 shrink-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-purple to-brand-blue opacity-30 blur-3xl rounded-full animate-pulse" />
              <Bot size={80} className="text-white relative z-10 opacity-80" />
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-1">
          <h2 className="text-3xl font-bold mb-6">Customer Reviews</h2>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl font-bold">{product.rating}</span>
            <div className="flex flex-col gap-1">
              <div className="flex text-yellow-500">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={18} className={i <= Math.floor(product.rating) ? "fill-current" : "text-black/10 dark:text-white/20"} />
                ))}
              </div>
              <span className="text-muted-foreground text-sm">Based on {product.reviews} reviews</span>
            </div>
          </div>
          <button className="w-full py-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors mt-6">
            Write a Review
          </button>
        </div>

        <div className="md:col-span-2 space-y-6">
          {mockReviews.map((review) => (
            <div key={review.id} className="glass p-6 rounded-3xl">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center font-bold text-lg">
                    {review.user[0]}
                  </div>
                  <div>
                    <h4 className="font-semibold">{review.user}</h4>
                    <span className="text-xs text-muted-foreground">{review.date}</span>
                  </div>
                </div>
                <div className="flex text-yellow-500">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={14} className={i <= review.rating ? "fill-current" : "text-black/10 dark:text-white/20"} />
                  ))}
                </div>
              </div>
              <p className="text-foreground/80 leading-relaxed">{review.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

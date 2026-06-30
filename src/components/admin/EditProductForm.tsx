"use client";

import React, { useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ArrowLeft, Loader2, Save, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface ProductType {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string;
  category: string;
  stock: number;
  features: string;
  colors: string | null;
  sizes: string | null;
}

interface EditProductFormProps {
  product: ProductType;
}

export function EditProductForm({ product }: EditProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(String(product.price));
  const [category, setCategory] = useState(product.category);
  const [stock, setStock] = useState(String(product.stock));
  const [images, setImages] = useState(product.images);
  const [features, setFeatures] = useState(product.features);
  const [colors, setColors] = useState(product.colors || "");
  const [sizes, setSizes] = useState(product.sizes || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !description || !price || !images || !category || !stock || !features) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product.id,
          name,
          description,
          price: parseFloat(price),
          images,
          category,
          stock: parseInt(stock),
          features,
          colors: colors || "",
          sizes: sizes || "",
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update product");
      }

      toast.success("Product updated successfully!");
      router.push("/admin/products");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  // Split images for preview
  const getPreviewImages = () => {
    return images
      .split(",")
      .map((url) => url.trim())
      .filter((url) => url.length > 5);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="p-2 rounded-xl border border-border/60 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
        </Link>
        <AdminPageHeader
          title={`Edit: ${product.name}`}
          description={`Update details for product ID: ${product.id}`}
        />
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-6">
            <h3 className="text-lg font-bold tracking-tight border-b border-border/10 pb-3">
              Basic Details
            </h3>

            {/* Name */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Product Name <span className="text-brand-pink">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. CyberSphere Pro VR Headset"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-border/40 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-purple/60 focus:ring-1 focus:ring-brand-purple/20 transition-all placeholder:text-muted-foreground"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Description <span className="text-brand-pink">*</span>
              </label>
              <textarea
                placeholder="Enter rich details about features, specs, compatibility..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full bg-white/5 border border-border/40 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-purple/60 focus:ring-1 focus:ring-brand-purple/20 transition-all placeholder:text-muted-foreground"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Category <span className="text-brand-pink">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white/5 border border-border/40 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-purple/60 transition-all"
                  required
                >
                  <option value="tech" className="bg-background">Tech</option>
                  <option value="wearables" className="bg-background">Wearables</option>
                  <option value="audio" className="bg-background">Audio</option>
                  <option value="smart-home" className="bg-background">Smart Home</option>
                  <option value="accessories" className="bg-background">Accessories</option>
                </select>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Price (INR) <span className="text-brand-pink">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="e.g. 12999"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-white/5 border border-border/40 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-purple/60 focus:ring-1 focus:ring-brand-purple/20 transition-all placeholder:text-muted-foreground"
                  required
                />
              </div>

              {/* Stock */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Stock Quantity <span className="text-brand-pink">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 50"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full bg-white/5 border border-border/40 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-purple/60 focus:ring-1 focus:ring-brand-purple/20 transition-all placeholder:text-muted-foreground"
                  required
                />
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-6">
            <h3 className="text-lg font-bold tracking-tight border-b border-border/10 pb-3">
              Attributes & Features
            </h3>

            {/* Features list */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Product Features <span className="text-brand-pink">*</span>{" "}
                <span className="text-[10px] text-muted-foreground">(comma separated list)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 8K Resolution, Wireless connectivity, Bluetooth 5.2"
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                className="w-full bg-white/5 border border-border/40 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-purple/60 focus:ring-1 focus:ring-brand-purple/20 transition-all placeholder:text-muted-foreground"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Colors */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Available Colors <span className="text-[10px] text-muted-foreground">(comma separated list)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Matte Black, Arctic White, Neon Green"
                  value={colors}
                  onChange={(e) => setColors(e.target.value)}
                  className="w-full bg-white/5 border border-border/40 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-purple/60 focus:ring-1 focus:ring-brand-purple/20 transition-all placeholder:text-muted-foreground"
                />
              </div>

              {/* Sizes */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Available Sizes <span className="text-[10px] text-muted-foreground">(comma separated list)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. S, M, L, XL"
                  value={sizes}
                  onChange={(e) => setSizes(e.target.value)}
                  className="w-full bg-white/5 border border-border/40 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-purple/60 focus:ring-1 focus:ring-brand-purple/20 transition-all placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Panel: Media Upload/Previews */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-6">
            <h3 className="text-lg font-bold tracking-tight border-b border-border/10 pb-3">
              Media URLs
            </h3>

            {/* Image URLs input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Image URLs <span className="text-brand-pink">*</span>{" "}
                <span className="text-[10px] text-muted-foreground">(comma separated list)</span>
              </label>
              <textarea
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                value={images}
                onChange={(e) => setImages(e.target.value)}
                rows={4}
                className="w-full bg-white/5 border border-border/40 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-purple/60 focus:ring-1 focus:ring-brand-purple/20 transition-all placeholder:text-muted-foreground"
                required
              />
            </div>

            {/* Images visual preview */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Eye size={12} />
                Live Previews ({getPreviewImages().length})
              </span>

              {getPreviewImages().length === 0 ? (
                <div className="border border-dashed border-border/40 rounded-xl h-36 flex items-center justify-center text-xs text-muted-foreground">
                  No images preview available
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
                  {getPreviewImages().map((url, i) => (
                    <div
                      key={i}
                      className="border border-border/40 rounded-xl overflow-hidden aspect-video bg-white/5 relative group"
                    >
                      <img
                        src={url}
                        alt="Preview item"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1594322436404-5a0526db4d13?q=80&w=200"; // fallback
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-brand-purple hover:bg-brand-purple/90 text-white font-semibold rounded-xl text-sm shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Save size={16} />
              )}
              Update Product Listing
            </button>
            <Link
              href="/admin/products"
              className="w-full block text-center py-3 border border-border hover:bg-white/5 text-muted-foreground hover:text-foreground font-semibold rounded-xl text-sm transition-all"
            >
              Cancel Changes
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

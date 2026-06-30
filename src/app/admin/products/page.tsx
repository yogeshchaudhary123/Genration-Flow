"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { Search, Plus, Trash2, Edit, Loader2, ArrowLeft, ArrowRight, Package } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface ProductType {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  rating: number;
  images: string; // JSON or comma separated URLs
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Modals / Actions
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: String(page),
        limit: "10",
        ...(search && { search }),
        ...(categoryFilter && { category: categoryFilter }),
      });

      const res = await fetch(`/api/admin/products?${query}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (error) {
      console.error(error);
      toast.error("Could not load products catalog");
    } finally {
      setLoading(false);
    }
  }, [page, search, categoryFilter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle Search Input Change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // Delete product action
  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/products?id=${selectedProduct.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete product");
      }

      toast.success(`Deleted product: ${selectedProduct.name}`);
      setDeleteModalOpen(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  // Currency helper
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(val);
  };

  // Get image URL to display
  const getProductImage = (imagesStr: string) => {
    if (!imagesStr) return null;
    try {
      // It might be a JSON array string
      if (imagesStr.startsWith("[")) {
        const parsed = JSON.parse(imagesStr);
        return parsed[0];
      }
      // Or comma separated
      return imagesStr.split(",")[0];
    } catch (e) {
      return imagesStr.split(",")[0];
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <AdminPageHeader
        title="Products Catalog"
        description="Add, edit stock level, adjust pricing, or remove items from sale."
        action={
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-4 py-2 bg-brand-purple hover:bg-brand-purple/90 text-white font-semibold rounded-xl text-sm shadow-md transition-colors cursor-pointer"
          >
            <Plus size={16} />
            Add Product
          </Link>
        }
      />

      {/* Filters & Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between glass p-4 rounded-2xl">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search by name, description..."
            value={search}
            onChange={handleSearchChange}
            className="w-full bg-white/5 border border-border/40 pl-10 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:border-brand-purple/60 focus:ring-1 focus:ring-brand-purple/20 transition-all placeholder:text-muted-foreground"
          />
        </div>

        {/* Category Filter */}
        <div className="w-full sm:w-auto flex justify-end">
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-44 bg-white/5 border border-border/40 px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-brand-purple/60 transition-all"
          >
            <option value="" className="bg-background">All Categories</option>
            <option value="tech" className="bg-background">Tech</option>
            <option value="wearables" className="bg-background">Wearables</option>
            <option value="audio" className="bg-background">Audio</option>
            <option value="smart-home" className="bg-background">Smart Home</option>
            <option value="accessories" className="bg-background">Accessories</option>
          </select>
        </div>
      </div>

      {/* Products Catalog Table */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-border/20 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-white/5">
                <th className="py-3 px-6">Product Info</th>
                <th className="py-3 px-6">Category</th>
                <th className="py-3 px-6">Price</th>
                <th className="py-3 px-6">Stock Status</th>
                <th className="py-3 px-6">Rating</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <Loader2 className="animate-spin text-brand-purple mx-auto" size={32} />
                    <p className="text-xs text-muted-foreground mt-2">Loading products index...</p>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    No products catalogued in database yet.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const image = getProductImage(product.images);
                  return (
                    <tr key={product.id} className="hover:bg-white/5 transition-all">
                      {/* Product details */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-white/5 border border-border/40 overflow-hidden flex items-center justify-center flex-shrink-0 relative">
                            {image ? (
                              <img
                                src={image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package size={20} className="text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground text-sm">
                              {product.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              ID: {product.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/5 border border-border/30 capitalize">
                          {product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-6 font-semibold text-foreground">
                        {formatCurrency(product.price)}
                      </td>

                      {/* Stock Level */}
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className={`font-semibold text-xs ${
                            product.stock === 0
                              ? "text-rose-500"
                              : product.stock < 5
                              ? "text-amber-500"
                              : "text-emerald-500"
                          }`}>
                            {product.stock === 0 ? "Out of Stock" : `${product.stock} units`}
                          </span>
                        </div>
                      </td>

                      {/* Rating */}
                      <td className="py-4 px-6 font-medium text-foreground">
                        ⭐ {product.rating.toFixed(1)}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="p-2 rounded-lg text-muted-foreground hover:text-brand-purple hover:bg-brand-purple/10 transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => {
                              setSelectedProduct(product);
                              setDeleteModalOpen(true);
                            }}
                            className="p-2 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border/10 text-xs">
            <span className="text-muted-foreground">
              Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} products)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1 || loading}
                className="p-1.5 rounded-lg border border-border/60 text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors cursor-pointer"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
                disabled={page === pagination.totalPages || loading}
                className="p-1.5 rounded-lg border border-border/60 text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors cursor-pointer"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Catalog Item"
        message={`Are you sure you want to delete ${selectedProduct?.name}? This will remove it from the store catalog, clear associated cart records, and is irreversible.`}
        confirmText="Confirm Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalOpen(false);
          setSelectedProduct(null);
        }}
        isLoading={deleting}
      />
    </div>
  );
}

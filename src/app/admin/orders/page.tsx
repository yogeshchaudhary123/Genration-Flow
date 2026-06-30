"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Search, Loader2, ArrowLeft, ArrowRight, ChevronDown, ChevronUp, MapPin, Package, CreditCard } from "lucide-react";
import toast from "react-hot-toast";

interface OrderItemType {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  color: string;
  size: string;
  product: {
    name: string;
    images: string;
  };
}

interface OrderType {
  id: string;
  totalAmount: number;
  status: "PENDING" | "PAID" | "FAILED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  shippingAddress: string;
  createdAt: string;
  user: {
    name: string | null;
    email: string | null;
  };
  items: OrderItemType[];
  payment: {
    status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
    method: "STRIPE" | "RAZORPAY";
    transactionId: string | null;
  } | null;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: String(page),
        limit: "10",
        ...(statusFilter && { status: statusFilter }),
      });

      const res = await fetch(`/api/admin/orders?${query}`);
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data.orders);
      setPagination(data.pagination);
    } catch (error) {
      console.error(error);
      toast.error("Could not load orders list");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Toggle expand row
  const toggleExpandOrder = (orderId: string) => {
    setExpandedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  // Handle status update
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update status");
      }

      toast.success(`Order status updated to ${newStatus}`);
      // Update local state
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: newStatus as any } : o
        )
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Currency helper
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(val);
  };

  const getProductImage = (imagesStr: string) => {
    if (!imagesStr) return null;
    try {
      if (imagesStr.startsWith("[")) {
        const parsed = JSON.parse(imagesStr);
        return parsed[0];
      }
      return imagesStr.split(",")[0];
    } catch (e) {
      return imagesStr.split(",")[0];
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <AdminPageHeader
        title="Orders Management"
        description="Fulfill pending orders, adjust shipment logs, and manage customer receipts."
      />

      {/* Filter panel */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between glass p-4 rounded-2xl">
        <span className="text-sm text-muted-foreground font-semibold">
          Filter transactions database logs:
        </span>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="w-full sm:w-44 bg-white/5 border border-border/40 px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-brand-purple/60 transition-all"
        >
          <option value="" className="bg-background">All Statuses</option>
          <option value="PENDING" className="bg-background">Pending</option>
          <option value="PAID" className="bg-background">Paid</option>
          <option value="SHIPPED" className="bg-background">Shipped</option>
          <option value="DELIVERED" className="bg-background">Delivered</option>
          <option value="CANCELLED" className="bg-background">Cancelled</option>
          <option value="FAILED" className="bg-background">Failed</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-border/20 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-white/5">
                <th className="py-3 px-6 w-12"></th>
                <th className="py-3 px-6">Order ID</th>
                <th className="py-3 px-6">Customer</th>
                <th className="py-3 px-6">Items count</th>
                <th className="py-3 px-6">Total Amount</th>
                <th className="py-3 px-6">Order Status</th>
                <th className="py-3 px-6">Payment</th>
                <th className="py-3 px-6">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <Loader2 className="animate-spin text-brand-purple mx-auto" size={32} />
                    <p className="text-xs text-muted-foreground mt-2">Loading transactions logs...</p>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground">
                    No orders recorded under current criteria.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const isExpanded = expandedOrders.includes(order.id);
                  return (
                    <React.Fragment key={order.id}>
                      {/* Main row */}
                      <tr
                        className={`hover:bg-white/5 transition-all cursor-pointer ${
                          isExpanded ? "bg-white/5" : ""
                        }`}
                        onClick={() => toggleExpandOrder(order.id)}
                      >
                        <td className="py-4 px-6 text-center">
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </td>
                        <td className="py-4 px-6 font-mono text-xs font-semibold text-brand-purple">
                          #{order.id.slice(-8).toUpperCase()}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground text-sm">
                              {order.user.name || "Guest User"}
                            </span>
                            <span className="text-xs text-muted-foreground">{order.user.email}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-foreground font-medium">
                          {order.items.reduce((sum, item) => sum + item.quantity, 0)} item(s)
                        </td>
                        <td className="py-4 px-6 font-semibold text-foreground">
                          {formatCurrency(order.totalAmount)}
                        </td>
                        <td className="py-4 px-6">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-col">
                            <StatusBadge status={order.payment?.status || "PENDING"} />
                            {order.payment && (
                              <span className="text-[10px] text-muted-foreground mt-0.5 font-semibold">
                                {order.payment.method}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                            disabled={updatingOrderId === order.id}
                            className="bg-white/5 border border-border/40 px-2 py-1 rounded-lg text-xs focus:outline-none focus:border-brand-purple/60 cursor-pointer disabled:opacity-50"
                          >
                            <option value="PENDING" className="bg-background">Pending</option>
                            <option value="PAID" className="bg-background">Paid</option>
                            <option value="SHIPPED" className="bg-background">Shipped</option>
                            <option value="DELIVERED" className="bg-background">Delivered</option>
                            <option value="CANCELLED" className="bg-background">Cancelled</option>
                            <option value="FAILED" className="bg-background">Failed</option>
                          </select>
                        </td>
                      </tr>

                      {/* Expandable details panel */}
                      {isExpanded && (
                        <tr className="bg-black/20" onClick={(e) => e.stopPropagation()}>
                          <td colSpan={8} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {/* Items list */}
                              <div className="md:col-span-2 space-y-4">
                                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 border-b border-border/10 pb-2">
                                  <Package size={14} />
                                  Ordered Products
                                </h4>

                                <div className="space-y-3">
                                  {order.items.map((item) => {
                                    const image = getProductImage(item.product.images);
                                    return (
                                      <div
                                        key={item.id}
                                        className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-border/30"
                                      >
                                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5 border border-border/30 flex-shrink-0">
                                          {image && (
                                            <img
                                              src={image}
                                              alt={item.product.name}
                                              className="w-full h-full object-cover"
                                            />
                                          )}
                                        </div>
                                        <div className="flex-1">
                                          <p className="font-semibold text-xs text-foreground">
                                            {item.product.name}
                                          </p>
                                          <p className="text-[10px] text-muted-foreground mt-0.5">
                                            {item.color && `Color: ${item.color}`}
                                            {item.size && ` | Size: ${item.size}`}
                                          </p>
                                        </div>
                                        <div className="text-right text-xs">
                                          <p className="font-medium text-foreground">
                                            {item.quantity} x {formatCurrency(item.price)}
                                          </p>
                                          <p className="font-bold text-brand-purple mt-0.5">
                                            {formatCurrency(item.price * item.quantity)}
                                          </p>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Shipping & Payment metadata */}
                              <div className="space-y-6">
                                {/* Shipping details */}
                                <div className="space-y-2">
                                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 border-b border-border/10 pb-2">
                                    <MapPin size={14} />
                                    Shipping Address
                                  </h4>
                                  <p className="text-xs text-foreground bg-white/5 p-3 rounded-xl border border-border/30 whitespace-pre-line leading-relaxed">
                                    {order.shippingAddress}
                                  </p>
                                </div>

                                {/* Transaction details */}
                                <div className="space-y-2">
                                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 border-b border-border/10 pb-2">
                                    <CreditCard size={14} />
                                    Transaction Record
                                  </h4>
                                  <div className="text-xs bg-white/5 p-3 rounded-xl border border-border/30 space-y-1">
                                    <p className="flex justify-between">
                                      <span className="text-muted-foreground">Gateway:</span>
                                      <span className="font-semibold">{order.payment?.method || "None"}</span>
                                    </p>
                                    <p className="flex justify-between">
                                      <span className="text-muted-foreground">Transaction ID:</span>
                                      <span className="font-mono text-[10px] select-all">
                                        {order.payment?.transactionId || "N/A"}
                                      </span>
                                    </p>
                                    <p className="flex justify-between">
                                      <span className="text-muted-foreground">Created At:</span>
                                      <span>{new Date(order.createdAt).toLocaleString()}</span>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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
              Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} orders)
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
    </div>
  );
}

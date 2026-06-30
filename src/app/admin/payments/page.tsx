"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Loader2, ArrowLeft, ArrowRight, CreditCard, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

interface PaymentType {
  id: string;
  amount: number;
  currency: string;
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  method: "STRIPE" | "RAZORPAY";
  transactionId: string | null;
  paymentId: string | null;
  createdAt: string;
  order: {
    id: string;
    user: {
      name: string | null;
      email: string | null;
    };
  };
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentType[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  // Fetch payments
  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: String(page),
        limit: "10",
        ...(statusFilter && { status: statusFilter }),
      });

      const res = await fetch(`/api/admin/payments?${query}`);
      if (!res.ok) throw new Error("Failed to fetch payments");
      const data = await res.json();
      setPayments(data.payments);
      setPagination(data.pagination);
    } catch (error) {
      console.error(error);
      toast.error("Could not load transaction registry");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // Currency helper
  const formatCurrency = (val: number, currency: string) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
    }).format(val);
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <AdminPageHeader
        title="Transaction Records"
        description="Inspect credit receipts, gateway callback statuses, and payment reference numbers."
      />

      {/* Filter panel */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between glass p-4 rounded-2xl">
        <span className="text-sm text-muted-foreground font-semibold">
          Filter credit logs database:
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
          <option value="COMPLETED" className="bg-background">Completed</option>
          <option value="FAILED" className="bg-background">Failed</option>
          <option value="REFUNDED" className="bg-background">Refunded</option>
        </select>
      </div>

      {/* Payments Table */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-border/20 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-white/5">
                <th className="py-3 px-6">Payment ID</th>
                <th className="py-3 px-6">Customer</th>
                <th className="py-3 px-6">Amount</th>
                <th className="py-3 px-6">Gateway</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Transaction Ref</th>
                <th className="py-3 px-6">Order ID</th>
                <th className="py-3 px-6">Date</th>
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
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground">
                    No transactions captured under current criteria.
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-white/5 transition-all">
                    {/* Payment ID */}
                    <td className="py-4 px-6 font-mono text-xs text-muted-foreground">
                      {payment.id}
                    </td>

                    {/* User */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground text-sm">
                          {payment.order.user.name || "Guest User"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {payment.order.user.email}
                        </span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-6 font-bold text-foreground">
                      {formatCurrency(payment.amount, payment.currency)}
                    </td>

                    {/* Method */}
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                        <CreditCard size={12} className="text-brand-purple" />
                        {payment.method}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <StatusBadge status={payment.status} />
                    </td>

                    {/* Transaction Reference keys */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-0.5 max-w-[200px] overflow-hidden text-ellipsis">
                        <span className="text-xs font-mono select-all text-foreground">
                          ID: {payment.transactionId || "N/A"}
                        </span>
                        {payment.paymentId && (
                          <span className="text-[10px] text-muted-foreground font-mono select-all">
                            PayId: {payment.paymentId}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Order ID Link */}
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 font-mono text-xs text-brand-purple font-semibold">
                        #{payment.order.id.slice(-8).toUpperCase()}
                      </span>
                    </td>

                    {/* Created Date */}
                    <td className="py-4 px-6 text-xs text-muted-foreground">
                      {new Date(payment.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border/10 text-xs">
            <span className="text-muted-foreground">
              Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} transactions)
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

import React from "react";
import { AdminService } from "@/services/admin.service";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatsCard } from "@/components/admin/StatsCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  DollarSign,
  ShoppingCart,
  Users as UsersIcon,
  Package,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export const revalidate = 0; // force dynamic rendering

export default async function AdminDashboard() {
  const stats = await AdminService.getDashboardStats();

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Find max revenue for scaling chart bars
  const maxRevenueTrend = Math.max(...stats.revenueTrend.map((t) => t.amount), 1);

  // Helper to format date label
  const formatDateLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { weekday: "short" });
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <AdminPageHeader
        title="Dashboard Overview"
        description="Monitor sales, users, orders, and product catalog performance."
        action={
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-purple bg-brand-purple/10 px-3 py-1.5 rounded-full border border-brand-purple/20">
            <TrendingUp size={14} />
            Live Updates Enabled
          </div>
        }
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          iconName="dollar"
          description="Total completed orders value"
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders}
          iconName="shopping-cart"
          description="Across all categories"
        />
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          iconName="users"
          description="Registered store members"
        />
        <StatsCard
          title="Total Products"
          value={stats.totalProducts}
          iconName="package"
          description="Active catalog listings"
        />
      </div>

      {/* Charts & Status Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Trend Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl flex flex-col justify-between min-h-[350px]">
          <div>
            <h3 className="text-lg font-bold tracking-tight">Revenue Trend</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Daily completed order values over the last 7 days
            </p>
          </div>

          {/* Render bar chart with CSS */}
          <div className="flex items-end justify-between gap-4 h-48 mt-6 px-2">
            {stats.revenueTrend.map((day) => {
              const heightPct = Math.max((day.amount / maxRevenueTrend) * 100, 4); // minimum height so bar is visible
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center group h-full justify-end">
                  {/* Tooltip */}
                  <span className="opacity-0 group-hover:opacity-100 bg-popover text-popover-foreground text-[10px] font-bold px-2 py-1 rounded-md border border-border shadow-md -translate-y-2 transition-opacity pointer-events-none whitespace-nowrap">
                    {formatCurrency(day.amount)}
                  </span>
                  
                  {/* Bar */}
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full max-w-[40px] rounded-t-lg bg-gradient-to-t from-brand-blue to-brand-purple group-hover:from-brand-pink group-hover:to-brand-purple transition-all duration-300 shadow-[0_0_15px_rgba(139,92,246,0.15)] group-hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]"
                  />
                  
                  {/* Label */}
                  <span className="text-[10px] font-medium text-muted-foreground mt-2 uppercase tracking-wider">
                    {formatDateLabel(day.date)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold tracking-tight">Order Statuses</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Distribution of order lifecycle states
            </p>
          </div>

          <div className="space-y-4 my-6">
            {stats.orderStatuses.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No orders record found.
              </p>
            ) : (
              stats.orderStatuses.map((statusItem) => {
                // Calculate percentage
                const total = stats.orderStatuses.reduce((acc, c) => acc + c.count, 0);
                const pct = total > 0 ? (statusItem.count / total) * 100 : 0;

                return (
                  <div key={statusItem.status} className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="flex items-center gap-1.5">
                        <StatusBadge status={statusItem.status} />
                      </span>
                      <span>
                        {statusItem.count} ({Math.round(pct)}%)
                      </span>
                    </div>
                    {/* Progress bar wrapper */}
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${pct}%` }}
                        className="h-full bg-gradient-to-r from-brand-purple to-brand-blue rounded-full"
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <Link
            href="/admin/orders"
            className="flex items-center justify-center gap-2 text-xs font-bold py-2.5 rounded-xl border border-border/60 hover:bg-white/5 transition-all w-full text-center"
          >
            Manage Orders
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="glass-panel rounded-2xl overflow-hidden p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold tracking-tight">Recent Orders</h3>
            <p className="text-xs text-muted-foreground">
              Most recent transactions placed on the storefront
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-brand-purple flex items-center gap-1 hover:underline"
          >
            View All Orders
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-border/20 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-white/5">
                <th className="py-3 px-6">Order ID</th>
                <th className="py-3 px-6">Customer</th>
                <th className="py-3 px-6">Amount</th>
                <th className="py-3 px-6">Order Status</th>
                <th className="py-3 px-6">Payment Status</th>
                <th className="py-3 px-6">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {stats.recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    No orders have been placed yet.
                  </td>
                </tr>
              ) : (
                stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-all">
                    <td className="py-3.5 px-6 font-mono text-xs text-brand-purple font-semibold">
                      #{order.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground text-xs md:text-sm">
                          {order.user.name || "Guest User"}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {order.user.email}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 font-semibold">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="py-3.5 px-6">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-3.5 px-6">
                      <StatusBadge status={order.payment?.status || "PENDING"} />
                    </td>
                    <td className="py-3.5 px-6 text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

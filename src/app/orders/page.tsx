"use client";

import { useState, useEffect } from "react";
import { Package, Truck, CheckCircle2, Clock, MapPin, ChevronRight, LogOut, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useStore();
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (Array.isArray(data)) {
          setOrders(data);
          if (data.length > 0) setSelectedOrder(data[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "DELIVERED": 
        return { 
          color: "text-green-400 bg-green-400/10 border-green-400/20", 
          icon: <CheckCircle2 size={16} />,
          text: "Delivered"
        };
      case "SHIPPED": 
        return { 
          color: "text-brand-blue bg-brand-blue/10 border-brand-blue/20", 
          icon: <Truck size={16} />,
          text: "Shipped"
        };
      case "PENDING": 
        return { 
          color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20", 
          icon: <Clock size={16} />,
          text: "Processing"
        };
      case "PAID": 
        return { 
          color: "text-green-500 bg-green-500/10 border-green-500/20", 
          icon: <CheckCircle2 size={16} />,
          text: "Paid"
        };
      case "CANCELLED": 
        return { 
          color: "text-red-400 bg-red-400/10 border-red-400/20", 
          icon: <AlertCircle size={16} />,
          text: "Cancelled"
        };
      default: 
        return { 
          color: "text-muted-foreground bg-white/5 border-white/10", 
          icon: <Clock size={16} />,
          text: status
        };
    }
  };

  const activeOrder = orders.find(o => o.id === selectedOrder);

  return (
    <div className="container mx-auto px-4 py-24 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 text-gradient">My Orders</h1>
          <p className="text-muted-foreground">Manage your orders and track deliveries.</p>
        </div>
        
        {user && (
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="font-medium text-white">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10 text-muted-foreground hover:text-white flex items-center gap-2"
            >
              <LogOut size={18} />
              <span className="sm:hidden">Logout</span>
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="w-12 h-12 border-4 border-brand-purple border-t-transparent rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="glass rounded-3xl p-16 text-center">
          <Package size={64} className="mx-auto text-muted-foreground/30 mb-6" />
          <h2 className="text-2xl font-bold mb-4">No orders yet</h2>
          <p className="text-muted-foreground mb-8">You haven't placed any orders yet. Start shopping to see them here!</p>
          <button onClick={() => router.push("/products")} className="px-8 py-3 bg-brand-purple text-white rounded-full font-medium hover:bg-brand-purple/90 transition-colors">
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Orders List */}
          <div className="lg:col-span-1 space-y-4">
            {orders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              return (
                <motion.div
                  key={order.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedOrder(order.id)}
                  className={`glass p-5 rounded-2xl cursor-pointer transition-all ${
                    selectedOrder === order.id ? "ring-2 ring-brand-purple border-transparent" : "hover:border-white/20"
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-white">#{order.id.slice(-8).toUpperCase()}</h3>
                      <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium ${statusInfo.color}`}>
                      {statusInfo.icon}
                      {statusInfo.text}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-white/5 overflow-hidden shrink-0">
                      <img src={order.items[0]?.product?.images?.split(',')[0]} alt="Product" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-1 mb-1">{order.items[0]?.product?.name}</p>
                      {order.items.length > 1 && (
                        <p className="text-xs text-muted-foreground">+ {order.items.length - 1} more items</p>
                      )}
                      <p className="font-semibold mt-1">${order.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Order Details & Tracking */}
          <div className="lg:col-span-2">
            {activeOrder ? (
              <div className="glass rounded-3xl p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-8 border-b border-white/10">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Order Details</h2>
                    <p className="text-muted-foreground flex items-center gap-2">
                      #{activeOrder.id.toUpperCase()} <span className="w-1 h-1 rounded-full bg-white/20" /> {new Date(activeOrder.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium transition-colors text-sm flex items-center gap-2">
                    Download Invoice <ChevronRight size={16} />
                  </button>
                </div>

                {/* Delivery Info */}
                <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <MapPin size={20} className="text-brand-purple" /> Shipping Address
                    </h3>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{activeOrder.shippingAddress}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <Clock size={20} className="text-brand-blue" /> Order Status
                    </h3>
                    <div className={`p-4 rounded-2xl border ${getStatusInfo(activeOrder.status).color}`}>
                      <p className="font-bold">{getStatusInfo(activeOrder.status).text}</p>
                      <p className="text-sm opacity-80 mt-1">Updated on {new Date(activeOrder.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Items list */}
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Package size={20} className="text-brand-pink" /> Ordered Items
                </h3>
                <div className="space-y-4">
                  {activeOrder.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-4 py-4 bg-white/5 rounded-2xl px-4 border border-white/5">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-background">
                        <img src={item.product?.images?.split(',')[0]} alt={item.product?.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product?.name}</h4>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity} | {item.color} | {item.size}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">${item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-white/10 flex justify-between items-end">
                  <div>
                    <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-1">Payment Method</p>
                    <p className="font-medium uppercase">{activeOrder.payment?.method || "Unknown"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-1">Total Amount</p>
                    <p className="text-3xl font-bold text-brand-purple">${activeOrder.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass rounded-3xl p-12 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
                <Package size={64} className="text-muted-foreground/30 mb-6" />
                <h3 className="text-xl font-bold mb-2">Select an order</h3>
                <p className="text-muted-foreground">Click on an order from the list to view its details and tracking information.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

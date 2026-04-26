"use client";

import { useState } from "react";
import { Package, Truck, CheckCircle2, Clock, MapPin, ChevronRight, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";

// Mock Data for Orders
const mockOrders = [
  {
    id: "ORD-9482-FLOW",
    date: "Oct 24, 2024",
    status: "Delivered",
    total: 3499.00,
    items: [
      { name: "Aura Vision Pro", qty: 1, image: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&q=80&w=200" }
    ],
    tracking: [
      { status: "Order Placed", date: "Oct 22, 10:00 AM", completed: true },
      { status: "Processing", date: "Oct 22, 02:30 PM", completed: true },
      { status: "Shipped", date: "Oct 23, 09:15 AM", completed: true },
      { status: "Delivered", date: "Oct 24, 04:45 PM", completed: true },
    ]
  },
  {
    id: "ORD-7211-FLOW",
    date: "Nov 02, 2024",
    status: "In Transit",
    total: 549.00,
    items: [
      { name: "SonicPods Max", qty: 1, image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=200" }
    ],
    tracking: [
      { status: "Order Placed", date: "Nov 02, 08:00 AM", completed: true },
      { status: "Processing", date: "Nov 02, 11:30 AM", completed: true },
      { status: "Shipped", date: "Nov 03, 10:00 AM", completed: true },
      { status: "Out for Delivery", date: "Pending", completed: false },
    ]
  }
];

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(mockOrders[1].id);
  const { user, logout } = useStore();
  const router = useRouter();

  // In a real app we'd redirect if no user, but since this is a frontend mock without strict auth boundaries:
  // if (!user) router.push('/login');

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "text-green-400 bg-green-400/10 border-green-400/20";
      case "In Transit": return "text-brand-blue bg-brand-blue/10 border-brand-blue/20";
      case "Processing": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      default: return "text-muted-foreground bg-white/5 border-white/10";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Delivered": return <CheckCircle2 size={16} />;
      case "In Transit": return <Truck size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-24 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">My Orders</h1>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Orders List */}
        <div className="lg:col-span-1 space-y-4">
          {mockOrders.map((order) => (
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
                  <h3 className="font-semibold text-white">{order.id}</h3>
                  <p className="text-xs text-muted-foreground">{order.date}</p>
                </div>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-white/5 overflow-hidden shrink-0">
                  <img src={order.items[0].image} alt="Product" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium line-clamp-1 mb-1">{order.items[0].name}</p>
                  {order.items.length > 1 && (
                    <p className="text-xs text-muted-foreground">+ {order.items.length - 1} more items</p>
                  )}
                  <p className="font-semibold mt-1">${order.total.toFixed(2)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Order Details & Tracking */}
        <div className="lg:col-span-2">
          {selectedOrder ? (
            <div className="glass rounded-3xl p-6 sm:p-8">
              {mockOrders.filter(o => o.id === selectedOrder).map(order => (
                <div key={order.id}>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-8 border-b border-white/10">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Order Details</h2>
                      <p className="text-muted-foreground flex items-center gap-2">
                        {order.id} <span className="w-1 h-1 rounded-full bg-white/20" /> {order.date}
                      </p>
                    </div>
                    <button className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium transition-colors text-sm flex items-center gap-2">
                      Download Invoice <ChevronRight size={16} />
                    </button>
                  </div>

                  {/* Delivery Tracking */}
                  <div className="mb-12">
                    <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
                      <MapPin size={20} className="text-brand-purple" /> Tracking Status
                    </h3>
                    
                    <div className="relative">
                      {/* Tracking Line */}
                      <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-white/10" />
                      
                      <div className="space-y-8 relative z-10">
                        {order.tracking.map((track, idx) => (
                          <div key={idx} className="flex gap-6">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                              track.completed 
                                ? "bg-brand-purple text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]" 
                                : "bg-background border-2 border-white/20 text-muted-foreground"
                            }`}>
                              {track.completed ? <CheckCircle2 size={16} /> : <div className="w-2 h-2 rounded-full bg-white/20" />}
                            </div>
                            <div className="pt-1">
                              <p className={`font-medium ${track.completed ? "text-white" : "text-muted-foreground"}`}>{track.status}</p>
                              <p className="text-sm text-muted-foreground">{track.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Items list */}
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Package size={20} className="text-brand-blue" /> Ordered Items
                  </h3>
                  <div className="space-y-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 py-4 bg-white/5 rounded-2xl px-4 border border-white/5">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-background">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">Qty: {item.qty}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
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
    </div>
  );
}

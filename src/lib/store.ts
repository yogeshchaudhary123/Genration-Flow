import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  color?: string;
  size?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface AppState {
  // Cart
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  setCart: (items: CartItem[]) => void;
  fetchCart: () => Promise<void>;
  cartTotal: () => number;
  cartCount: () => number;

  // Auth
  user: User | null;
  login: (user: User) => void;
  logout: () => void;

  // UI
  isAiChatOpen: boolean;
  toggleAiChat: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Cart State
      cart: [],
      setCart: (items) => set({ cart: items }),
      
      fetchCart: async () => {
        const state = get();
        if (!state.user) return;
        
        try {
          const res = await fetch('/api/cart');
          if (res.ok) {
            const data = await res.json();
            const items = data.items.map((item: any) => ({
              id: item.id,
              productId: item.productId,
              name: item.product.name,
              price: item.product.price,
              quantity: item.quantity,
              image: JSON.parse(item.product.images)[0],
              color: item.color,
              size: item.size,
            }));
            set({ cart: items });
          }
        } catch (error) {
          console.error("Failed to fetch cart:", error);
        }
      },

      addToCart: async (item) => {
        const state = get();
        
        // Optimistic update
        set((state) => {
          const existingItemIndex = state.cart.findIndex(
            (c) => c.productId === item.productId && c.color === item.color && c.size === item.size
          );

          if (existingItemIndex > -1) {
            const newCart = [...state.cart];
            newCart[existingItemIndex].quantity += item.quantity;
            return { cart: newCart };
          }
          
          return { cart: [...state.cart, { ...item, id: Math.random().toString(36).substring(7) }] };
        });

        // Sync with backend if user is logged in
        if (state.user) {
          try {
            await fetch('/api/cart', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                productId: item.productId,
                quantity: item.quantity,
                color: item.color,
                size: item.size,
              }),
            });
            // Refetch to get correct IDs from DB
            get().fetchCart();
          } catch (error) {
            console.error("Failed to sync cart item:", error);
          }
        }
      },

      removeFromCart: async (id) => {
        const state = get();
        
        // Optimistic update
        set((state) => ({ cart: state.cart.filter((item) => item.id !== id) }));

        if (state.user) {
          try {
            await fetch('/api/cart', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ itemId: id }),
            });
          } catch (error) {
            console.error("Failed to remove cart item:", error);
          }
        }
      },

      updateQuantity: async (id, quantity) => {
        const state = get();
        
        // Optimistic update
        set((state) => ({
          cart: state.cart.map((item) => (item.id === id ? { ...item, quantity } : item)),
        }));

        if (state.user) {
          try {
            await fetch('/api/cart', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ itemId: id, quantity }),
            });
          } catch (error) {
            console.error("Failed to update cart quantity:", error);
          }
        }
      },

      clearCart: async () => {
        const state = get();
        set({ cart: [] });

        if (state.user) {
          try {
            await fetch('/api/cart', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ clearAll: true }),
            });
          } catch (error) {
            console.error("Failed to clear cart:", error);
          }
        }
      },

      cartTotal: () => {
        return get().cart.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      cartCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      },

      // Auth State
      user: null,
      login: (user) => {
        set({ user });
        get().fetchCart();
      },
      logout: () => set({ user: null, cart: [] }),

      // UI State
      isAiChatOpen: false,
      toggleAiChat: () => set((state) => ({ isAiChatOpen: !state.isAiChatOpen })),
    }),
    {
      name: 'generation-flow-storage',
      partialize: (state) => ({ cart: state.cart, user: state.user }),
    }
  )
);

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
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
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
      addToCart: (item) => {
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
      },
      removeFromCart: (id) => set((state) => ({ cart: state.cart.filter((item) => item.id !== id) })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) => (item.id === id ? { ...item, quantity } : item)),
        })),
      clearCart: () => set({ cart: [] }),
      cartTotal: () => {
        return get().cart.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      cartCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      },

      // Auth State
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),

      // UI State
      isAiChatOpen: false,
      toggleAiChat: () => set((state) => ({ isAiChatOpen: !state.isAiChatOpen })),
    }),
    {
      name: 'generation-flow-storage',
      partialize: (state) => ({ cart: state.cart, user: state.user }), // Persist only cart and user
    }
  )
);

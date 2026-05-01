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
  isCartOpen: boolean;
  toggleCart: (open?: boolean) => void;
  isSyncing: boolean;
}

// ---------------------------------------------------------------------------
// Mutation version counter
// Incremented on EVERY write (add / remove / update / clear).
// fetchCart captures the version before the network call and only applies
// the response if the version hasn't changed — this prevents a slow
// addToCart-fetchCart from resurrecting an item the user just removed.
// ---------------------------------------------------------------------------
let _cartVersion = 0;

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ── Cart State ──────────────────────────────────────────────────────

      cart: [],
      setCart: (items) => set({ cart: items }),

      fetchCart: async () => {
        const state = get();
        if (!state.user) return;

        set({ isSyncing: true });
        // Snapshot the version at call time
        const versionAtStart = _cartVersion;

        try {
          const res = await fetch('/api/cart');
          if (!res.ok) return;

          const data = await res.json();

          // Discard stale response if a mutation happened while we waited
          if (_cartVersion !== versionAtStart) return;

          const items = data.items.map((item: any) => ({
            id: item.id,
            productId: item.productId,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.images,
            color: item.color,
            size: item.size,
          }));

          set({ cart: items });
        } catch (error) {
          console.error('Failed to fetch cart:', error);
        } finally {
          set({ isSyncing: false });
        }
      },

      addToCart: async (item) => {
        const state = get();

        if (state.user) {
          set({ isSyncing: true });
          _cartVersion++;
          const versionAtAdd = _cartVersion;

          try {
            const res = await fetch('/api/cart', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                productId: item.productId,
                quantity: item.quantity,
                color: item.color,
                size: item.size,
              }),
            });

            if (res.ok) {
              const saved = await res.json();
              
              // Only apply if no other mutation started
              if (_cartVersion === versionAtAdd && saved) {
                set((s) => {
                  const existingIndex = s.cart.findIndex(
                    (c) =>
                      c.productId === item.productId &&
                      c.color === item.color &&
                      c.size === item.size
                  );

                  if (existingIndex > -1) {
                    const newCart = [...s.cart];
                    newCart[existingIndex] = {
                      ...newCart[existingIndex],
                      id: saved.id, // Update to real ID
                      quantity: saved.quantity,
                    };
                    return { cart: newCart };
                  }

                  const newItem: CartItem = {
                    ...item,
                    id: saved.id,
                    quantity: saved.quantity,
                    name: saved.product?.name || item.name,
                    price: saved.product?.price || item.price,
                    image: saved.product?.images?.split(',')[0] || item.image,
                  };

                  return { cart: [...s.cart, newItem] };
                });
              }
            }
          } catch (error) {
            console.error('Failed to sync cart item:', error);
          } finally {
            set({ isSyncing: false });
          }
        }
      },

      removeFromCart: async (id) => {
        const state = get();
        if (state.user) {
          set({ isSyncing: true });
          _cartVersion++;
          const versionAtRemove = _cartVersion;

          try {
            const res = await fetch('/api/cart', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ itemId: id }),
            });

            if (res.ok) {
              if (_cartVersion === versionAtRemove) {
                set((s) => ({ cart: s.cart.filter((item) => item.id !== id) }));
              }
            } else {
              await get().fetchCart();
            }
          } catch (error) {
            console.error('Failed to remove cart item:', error);
            await get().fetchCart();
          } finally {
            set({ isSyncing: false });
          }
        }
      },

      updateQuantity: async (id, quantity) => {
        const state = get();
        if (state.user) {
          set({ isSyncing: true });
          _cartVersion++;
          const versionAtUpdate = _cartVersion;

          try {
            const res = await fetch('/api/cart', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ itemId: id, quantity }),
            });

            if (res.ok) {
              if (_cartVersion === versionAtUpdate) {
                set((s) => ({
                  cart: s.cart.map((item) =>
                    item.id === id ? { ...item, quantity } : item
                  ),
                }));
              }
            } else {
              await get().fetchCart();
            }
          } catch (error) {
            console.error('Failed to update cart quantity:', error);
            await get().fetchCart();
          } finally {
            set({ isSyncing: false });
          }
        }
      },

      clearCart: async () => {
        _cartVersion++;
        const state = get();
        set({ cart: [] });

        if (state.user) {
          set({ isSyncing: true });
          try {
            await fetch('/api/cart', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ clearAll: true }),
            });
          } catch (error) {
            console.error('Failed to clear cart:', error);
          } finally {
            set({ isSyncing: false });
          }
        }
      },

      cartTotal: () =>
        get().cart.reduce((total, item) => total + item.price * item.quantity, 0),

      cartCount: () =>
        get().cart.reduce((count, item) => count + item.quantity, 0),

      // ── Auth State ──────────────────────────────────────────────────────
      user: null,
      login: (user) => {
        set({ user });
        get().fetchCart();
      },
      logout: () => set({ user: null, cart: [] }),

      // ── UI State ────────────────────────────────────────────────────────
      isAiChatOpen: false,
      toggleAiChat: () =>
        set((state) => ({ isAiChatOpen: !state.isAiChatOpen })),
      isCartOpen: false,
      toggleCart: (open) =>
        set((state) => ({ isCartOpen: open !== undefined ? open : !state.isCartOpen })),
      isSyncing: false,
    }),
    {
      name: 'generation-flow-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);

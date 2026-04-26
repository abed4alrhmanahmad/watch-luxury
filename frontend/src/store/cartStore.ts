import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Normalized cart product shape — ProductCard converts API/legacy products to this before calling addItem
export interface CartProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  brand: string;
  description: string;
  images: string[];
  inStock: boolean;
  stockCount: number;
  isNew?: boolean;
  isFeatured?: boolean;
}

export interface CartItem {
  product: CartProduct;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isCartOpen: boolean;
  addItem: (product: CartProduct, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: Math.min(i.quantity + quantity, i.product.stockCount) }
                  : i
              ),
            };
          }
          return { items: [...state.items, { product, quantity }] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({ items: state.items.filter((i) => i.product.id !== productId) }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      setCartOpen: (open) => set({ isCartOpen: open }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    }),
    {
      name: 'chronolux-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);

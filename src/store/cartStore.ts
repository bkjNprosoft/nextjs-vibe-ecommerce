import { create } from 'zustand';
import type { Product } from '@prisma/client';

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Product) => void;
  removeItem: (itemId: number) => void;
  updateItemQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (item) =>
    set((state) => {
      const existingItem = state.items.find((i) => i.id === item.id);
      if (existingItem) {
        // If item already exists, just increase quantity
        const updatedItems = state.items.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
        return { items: updatedItems };
      } else {
        // If item is new, add it to the cart with quantity 1
        return { items: [...state.items, { ...item, quantity: 1 }] };
      }
    }),
  removeItem: (itemId) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== itemId),
    })),
  updateItemQuantity: (itemId, quantity) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === itemId ? { ...i, quantity: Math.max(0, quantity) } : i
      ).filter(i => i.quantity > 0), // Remove item if quantity is 0
    })),
  clearCart: () => set({ items: [] }),
}));

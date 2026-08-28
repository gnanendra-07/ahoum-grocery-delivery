import { create } from 'zustand';
import { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  deliveryFee: number;
  taxRate: number; // 0.05 (5%)

  // Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  revalidateCart: (latestProducts: Product[]) => void;

  // Selectors / Calculated getters
  getItemQuantity: (productId: string) => number;
  getTotalItemsCount: () => number;
  getSubtotal: () => number;
  getTaxAmount: () => number;
  getTotalAmount: () => number;
}

const CART_STORAGE_KEY = 'ahoum_cart_items';

/**
 * Resiliently loads and validates cart data from localStorage.
 * Handles malformed JSON, invalid structures, non-positive quantities, and missing product fields.
 */
const loadCartFromStorage = (): CartItem[] => {
  try {
    const rawData = localStorage.getItem(CART_STORAGE_KEY);
    if (!rawData) return [];

    const parsed = JSON.parse(rawData);
    if (!Array.isArray(parsed)) return [];

    // Filter out malformed/corrupted cart items
    return parsed.filter((item): item is CartItem => {
      return (
        item !== null &&
        typeof item === 'object' &&
        item.product !== null &&
        typeof item.product === 'object' &&
        typeof item.product.id === 'string' &&
        typeof item.product.price === 'number' &&
        typeof item.quantity === 'number' &&
        item.quantity > 0 &&
        !isNaN(item.product.price)
      );
    });
  } catch (err) {
    console.error('[CartStore] Failed to load or parse cart from localStorage. Resetting to empty.', err);
    return [];
  }
};

const saveCartToStorage = (items: CartItem[]): void => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('[CartStore] Failed to save cart to localStorage.', err);
  }
};

export const useCartStore = create<CartState>((set, get) => ({
  items: loadCartFromStorage(),
  deliveryFee: 1.99,
  taxRate: 0.05,

  addItem: (product: Product, quantity = 1) => {
    set((state) => {
      const maxAvailableStock = product.stock > 0 ? product.stock : 99;
      const existingIndex = state.items.findIndex((i) => i.product.id === product.id);
      let updatedItems: CartItem[];

      if (existingIndex > -1) {
        updatedItems = state.items.map((item, index) => {
          if (index === existingIndex) {
            const newQty = Math.min(item.quantity + quantity, maxAvailableStock);
            return { ...item, product, quantity: newQty };
          }
          return item;
        });
      } else {
        const initialQty = Math.min(quantity, maxAvailableStock);
        updatedItems = [...state.items, { product, quantity: initialQty }];
      }

      saveCartToStorage(updatedItems);
      return { items: updatedItems };
    });
  },

  removeItem: (productId: string) => {
    set((state) => {
      const updatedItems = state.items.filter((item) => item.product.id !== productId);
      saveCartToStorage(updatedItems);
      return { items: updatedItems };
    });
  },

  updateQuantity: (productId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }

    set((state) => {
      const updatedItems = state.items.map((item) => {
        if (item.product.id === productId) {
          const maxStock = item.product.stock > 0 ? item.product.stock : 99;
          const clampedQty = Math.min(quantity, maxStock);
          return { ...item, quantity: clampedQty };
        }
        return item;
      });

      saveCartToStorage(updatedItems);
      return { items: updatedItems };
    });
  },

  clearCart: () => {
    saveCartToStorage([]);
    set({ items: [] });
  },

  /**
   * Revalidates stored cart items against the latest product dataset:
   * 1. Removes items for products no longer present in catalog.
   * 2. Syncs prices, discount prices, and product metadata.
   * 3. Clamps quantity to current product stock (or drops if stock === 0).
   * 4. Cleanses corrupt or invalid entries.
   */
  revalidateCart: (latestProducts: Product[]) => {
    set((state) => {
      const productMap = new Map<string, Product>(latestProducts.map((p) => [p.id, p]));
      const revalidatedItems: CartItem[] = [];

      for (const item of state.items) {
        const latestProd = productMap.get(item.product.id);

        // Drop item if product no longer exists in dataset or out of stock
        if (!latestProd || latestProd.stock <= 0) {
          continue;
        }

        // Clamp quantity to available stock
        const validQuantity = Math.min(item.quantity, latestProd.stock);

        if (validQuantity > 0) {
          revalidatedItems.push({
            product: latestProd,
            quantity: validQuantity,
          });
        }
      }

      saveCartToStorage(revalidatedItems);
      return { items: revalidatedItems };
    });
  },

  getItemQuantity: (productId: string) => {
    const item = get().items.find((i) => i.product.id === productId);
    return item ? item.quantity : 0;
  },

  getTotalItemsCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  getSubtotal: () => {
    return get().items.reduce((sum, item) => {
      const price = item.product.discountPrice ?? item.product.price;
      return sum + (isNaN(price) ? 0 : price) * item.quantity;
    }, 0);
  },

  getTaxAmount: () => {
    const subtotal = get().getSubtotal();
    return subtotal * get().taxRate;
  },

  getTotalAmount: () => {
    const subtotal = get().getSubtotal();
    if (subtotal === 0) return 0;
    const tax = get().getTaxAmount();
    const delivery = get().deliveryFee;
    return subtotal + tax + delivery;
  },
}));

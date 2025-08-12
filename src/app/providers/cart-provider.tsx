"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { CartItem as LocalCartItem, MenuItem, ItemOptions } from "../types";
import {
  createCart,
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
  getCart,
} from "@/lib/api/cart";
import type { CartResponse } from "@/lib/api";

interface CartContextType {
  items: LocalCartItem[];
  addToCart: (item: MenuItem & { options: ItemOptions }) => Promise<void>;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  tax: number;
  total: number;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  cartId: string | null;
  locationId: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Validation functions
const validateMenuItem = (item: MenuItem & { options: ItemOptions }): void => {
  if (!item.id || !item.name || !item.price) {
    throw new Error("Invalid menu item: missing required fields");
  }

  if (typeof item.price !== "number" || item.price < 0) {
    throw new Error("Invalid menu item: price must be a positive number");
  }

  if (!item.options || typeof item.options !== "object") {
    throw new Error("Invalid menu item: options must be an object");
  }
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<LocalCartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartId, setCartId] = useState<string | null>(null);
  const [apiCart, setApiCart] = useState<CartResponse | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Demo mode - disable API calls for local development
  const locationId = process.env.NEXT_PUBLIC_LOCATION_ID || "demo-location";

  // Demo mode - skip cart initialization (no API calls)
  const initializeCart = useCallback(async () => {
    console.log("Demo mode: Cart running locally without API");
  }, []);

  // Handle hydration - load data only after component has mounted
  useEffect(() => {
    setIsHydrated(true);

    // Load from localStorage after hydration
    const savedItems = localStorage.getItem("tomodachi-cart-items");
    const savedCartId = localStorage.getItem("tomodachi-cart-id");

    if (savedItems) {
      try {
        setItems(JSON.parse(savedItems));
      } catch (error) {
        console.warn("Failed to parse saved cart items:", error);
      }
    }

    if (savedCartId) {
      setCartId(savedCartId);
    }
  }, []);

  // Initialize cart on component mount (only after hydration)
  useEffect(() => {
    if (!isHydrated) return;
    initializeCart();
  }, [initializeCart, isHydrated]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const openCart = useCallback(() => {
    // Opening cart
    setIsCartOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  const addToCart = useCallback(
    async (item: MenuItem & { options: ItemOptions }) => {
      // Adding item to cart
      setIsLoading(true);
      setError(null);

      try {
        // Validate the item
        validateMenuItem(item);

        // Demo mode - no cart initialization needed

        // Demo mode - use local storage only (skip API calls)
        let finalPrice = item.price;
        if (item.options.giftBox) {
          finalPrice += 5.0;
        }

        // Check if item with same id and options already exists
        const existingItemIndex = items.findIndex(
          (cartItem) =>
            cartItem.id === item.id &&
            JSON.stringify(cartItem.options) === JSON.stringify(item.options)
        );

        let newItems: LocalCartItem[];

        if (existingItemIndex >= 0) {
          // Item exists, increment quantity
          newItems = items.map((cartItem, index) =>
            index === existingItemIndex
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          );
        } else {
          // New item, add to cart
          const cartItem: LocalCartItem = {
            ...item,
            price: finalPrice,
            cartId: `${item.id}-${Date.now()}-${Math.random()
              .toString(36)
              .substr(2, 9)}`,
            quantity: 1,
          };
          newItems = [...items, cartItem];
        }
        setItems(newItems);

        // Save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "tomodachi-cart-items",
            JSON.stringify(newItems)
          );
        }

        // Automatically open the cart when an item is added
        // Opening cart when item is added
        setIsCartOpen(true);
      } catch (err: any) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to add item to cart";
        setError(errorMessage);
        console.error("❌ Error adding item to cart:", err);
        console.error("Error details:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
          config: err.config,
        });
        throw err; // Re-throw so UI can handle it
      } finally {
        setIsLoading(false);
      }
    },
    [cartId, locationId, initializeCart, items, apiCart]
  );

  const removeItem = (cartId: string) => {
    const newItems = items.filter((item) => item.cartId !== cartId);
    setItems(newItems);
    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("tomodachi-cart-items", JSON.stringify(newItems));
    }
  };

  const updateQuantity = (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(cartId);
    } else {
      const newItems = items.map((item) =>
        item.cartId === cartId ? { ...item, quantity } : item
      );
      setItems(newItems);
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("tomodachi-cart-items", JSON.stringify(newItems));
      }
    }
  };

  const clearCart = () => {
    setItems([]);
    // Clear localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("tomodachi-cart-items");
      localStorage.removeItem("tomodachi-cart-id");
    }
  };

  const itemCount =
    apiCart?.totalQuantity ||
    items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = apiCart
    ? parseFloat(apiCart.subTotal)
    : items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = apiCart ? parseFloat(apiCart.taxTotal) : subtotal * 0.08875; // NYC tax rate
  const total = apiCart ? parseFloat(apiCart.orderTotal) : subtotal + tax;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        tax,
        total,
        isLoading,
        error,
        clearError,
        isCartOpen,
        openCart,
        closeCart,
        cartId,
        locationId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

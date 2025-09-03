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
import { location_Id as LOCATION_ID } from "@/constants";

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

  const locationId = LOCATION_ID;
  const DEMO_MODE = false; // ← set via env if you want (e.g. NEXT_PUBLIC_DEMO_CART)

  // replace initializeCart with a real one (keeps your localStorage restore)
  const initializeCart = useCallback(async () => {
    if (DEMO_MODE) {
      console.log("Demo mode: Cart running locally without API");
      return;
    }
    try {
      // try restore
      const cid = localStorage.getItem("tomodachi-cart-id");
      if (cid) {
        const cart = await getCart(locationId, cid);
        setCartId(cid);
        setApiCart(cart);
        return;
      }

      // create new for this location
      const created = await createCart(locationId);
      const newCartId = created.cartId;
      const fullCart = await getCart(locationId, newCartId);
      setCartId(newCartId);
      setApiCart(fullCart);
      localStorage.setItem("tomodachi-cart-id", newCartId);
    } catch (err) {
      console.error("cart init failed", err);
      setError("Could not initialize cart");
    }
  }, [locationId]);

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
    setIsCartOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  // in addToCart, call API when not in demo
  const addToCart = useCallback(
    async (item: MenuItem & { options: ItemOptions }) => {
      setIsLoading(true);
      setError(null);

      try {
        validateMenuItem(item);

        if (DEMO_MODE) {
          // keep your existing local add…
          let finalPrice = item.price;
          if (item.options.giftBox) {
            finalPrice += 5.0;
          }

          const existingItemIndex = items.findIndex(
            (cartItem) =>
              cartItem.id === item.id &&
              JSON.stringify(cartItem.options) === JSON.stringify(item.options)
          );

          let newItems: LocalCartItem[];

          if (existingItemIndex >= 0) {
            newItems = items.map((cartItem, index) =>
              index === existingItemIndex
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            );
          } else {
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

          if (typeof window !== "undefined") {
            localStorage.setItem(
              "tomodachi-cart-items",
              JSON.stringify(newItems)
            );
          }

          setIsCartOpen(true);
          return;
        }

        // LIVE API path
        if (!cartId) {
          await initializeCart();
        }
        const cid = cartId ?? localStorage.getItem("tomodachi-cart-id");
        if (!cid) throw new Error("Cart not ready. Please try again.");

        const payload = {
          productId: item.id,
          quantity: 1,
          // If your API needs price/options/modifiers, include them here:
          options: item.options, // matches your MenuItem + ItemOptions
        };

        await addItemToCart(locationId, cid, payload);

        // reflect server cart in UI
        const fresh = await getCart(locationId, cid);
        setApiCart(fresh);
        setCartId(cid);

        // Optionally mirror into local items if your checkout reads from `items`
        const mirrored: LocalCartItem = {
          ...item,
          price: item.price + (item.options.giftBox ? 5 : 0),
          cartId: `${item.id}-${Date.now()}`,
          quantity: 1,
        };
        const newItems = [...items, mirrored];
        setItems(newItems);
        localStorage.setItem("tomodachi-cart-items", JSON.stringify(newItems));

        setIsCartOpen(true);
      } catch (err: any) {
        setError(err?.message ?? "Failed to add item to cart");
        console.error("addToCart failed", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [cartId, initializeCart, items, DEMO_MODE]
  );

  const removeItem = (cartId: string) => {
    const newItems = items.filter((item) => item.cartId !== cartId);
    setItems(newItems);
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
      if (typeof window !== "undefined") {
        localStorage.setItem("tomodachi-cart-items", JSON.stringify(newItems));
      }
    }
  };

  const clearCart = () => {
    setItems([]);
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

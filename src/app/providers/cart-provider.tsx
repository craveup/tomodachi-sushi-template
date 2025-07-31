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
import { menuItems } from "../data/menu-items";

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

  const locationId = process.env.NEXT_PUBLIC_LOCATION_ID;
  if (!locationId) {
    throw new Error("NEXT_PUBLIC_LOCATION_ID environment variable is required");
  }

  // Handle hydration - load data only after component has mounted
  useEffect(() => {
    setIsHydrated(true);

    // Load from localStorage after hydration
    const savedItems = localStorage.getItem("leclerc-cart-items");
    const savedCartId = localStorage.getItem("leclerc-cart-id");

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

    const initializeCart = async () => {
      try {
        // Get existing cart ID from localStorage
        const savedCartId =
          typeof window !== "undefined"
            ? localStorage.getItem("leclerc-cart-id")
            : null;

        // Initializing cart for location
        const newCartResponse = await createCart(
          locationId,
          savedCartId,
          "takeout"
        );
        // Cart created successfully
        // Setting cartId
        setCartId(newCartResponse.cartId);
        // Save cartId to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("leclerc-cart-id", newCartResponse.cartId);
        }
      } catch (error) {
        console.warn("❌ Failed to create cart, using local storage", error);
      }
    };

    initializeCart();
  }, [locationId, isHydrated]);

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

        // Ensure we have a cart
        let currentCartId = cartId;
        if (!currentCartId) {
          console.log("No cart ID found, creating new cart...");
          await initializeCart();
          currentCartId = cartId; // Get the updated cartId
        } else if (!apiCart) {
          console.log("Cart not initialized, creating new cart...");
          await initializeCart();
          currentCartId = cartId; // Get the updated cartId
        }

        // Now we should have a valid cartId
        if (currentCartId) {
          // Try to use API
          const addItemData = {
            productId: item.id,
            quantity: 1,
            specialInstructions: item.options.giftBox ? "Add gift box" : "",
            itemUnavailableAction: "remove_item",
            selectedModifiers: [], // Empty for now since we're not using complex modifiers
          };

          // Calling addItemToCart API
          console.log("Adding item to cart:", {
            locationId,
            currentCartId,
            addItemData,
          });
          console.log("Current cart state:", apiCart);
          // Making API call to add item to cart
          const addResult = await addItemToCart(
            locationId,
            currentCartId,
            addItemData
          );
          console.log("API call successful:", addResult);
          // API call successful

          // Fetch the updated cart to get the full cart data
          const updatedCart = await getCart(locationId, currentCartId);
          // Fetched updated cart
          setApiCart(updatedCart);

          // Convert API cart items to local format
          const localItems: LocalCartItem[] = (updatedCart.items || []).map(
            (apiItem) => {
              // Find matching menu item to get full details
              const menuItem = menuItems.find(
                (mi) => mi.id === apiItem.productId
              );

              return {
                id: apiItem.productId,
                name: apiItem.name,
                description: apiItem.description || menuItem?.description || "",
                price:
                  typeof apiItem.price === "string"
                    ? parseFloat(apiItem.price)
                    : apiItem.price,
                image:
                  apiItem.imageUrl ||
                  menuItem?.image ||
                  "/images/leclerc-bakery/signature/choc-chip-walnut.webp",
                category: menuItem?.category || "cookies",
                cartId: apiItem.id,
                quantity: apiItem.quantity,
                options: {
                  giftBox:
                    apiItem.specialInstructions?.includes("gift box") || false,
                  warming: "room-temp",
                  packaging: "standard",
                },
                calories: menuItem?.calories || 0,
                isNew: menuItem?.isNew || false,
                isPopular: menuItem?.isPopular || false,
                isGlutenFree: menuItem?.isGlutenFree || false,
              };
            }
          );

          setItems(localItems);
          // Save to localStorage
          if (typeof window !== "undefined") {
            localStorage.setItem(
              "leclerc-cart-items",
              JSON.stringify(localItems)
            );
          }
        } else {
          // Fallback to local storage
          let finalPrice = item.price;
          if (item.options.giftBox) {
            finalPrice += 5.0;
          }

          const cartItem: LocalCartItem = {
            ...item,
            price: finalPrice,
            cartId: `${item.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            quantity: 1,
          };

          const newItems = [...items, cartItem];
          setItems(newItems);

          // Save to localStorage
          if (typeof window !== "undefined") {
            localStorage.setItem(
              "leclerc-cart-items",
              JSON.stringify(newItems)
            );
          }
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
    [cartId, locationId]
  );

  const removeItem = (cartId: string) => {
    const newItems = items.filter((item) => item.cartId !== cartId);
    setItems(newItems);
    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("leclerc-cart-items", JSON.stringify(newItems));
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
        localStorage.setItem("leclerc-cart-items", JSON.stringify(newItems));
      }
    }
  };

  const clearCart = () => {
    setItems([]);
    // Clear localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("leclerc-cart-items");
      localStorage.removeItem("leclerc-cart-id");
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

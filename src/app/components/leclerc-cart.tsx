"use client";

import { useState, useEffect } from "react";
import { useCart } from "../providers/cart-provider";
import { useAddress } from "../providers/address-provider";
import { useRouter } from "next/navigation";
import { CartSidebar } from "@/components/crave-ui/cart-component";
import { fetchProducts } from "@/lib/api";
import type { Product } from "@/lib/api";

interface LeclercCartProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange?: (open: boolean) => void;
}

export function LeclercCart({
  isOpen,
  onClose,
  onOpenChange,
}: LeclercCartProps) {
  const router = useRouter();
  const {
    items,
    updateQuantity,
    removeItem,
    subtotal,
    tax,
    total,
    addToCart,
    cartId,
    locationId,
  } = useCart();
  const { getDeliveryFee, deliveryOption } = useAddress();
  const [apiProducts, setApiProducts] = useState<Product[]>([]);

  const deliveryFee = getDeliveryFee();
  const finalTotal = subtotal + tax + deliveryFee;

  // Fetch products from API
  useEffect(() => {
    const loadProducts = async () => {
      if (locationId) {
        try {
          const products = await fetchProducts(locationId);
          setApiProducts(products);
        } catch (error) {
          console.warn("Failed to load products from API:", error);
        }
      }
    };

    loadProducts();
  }, [locationId]);

  const handleCheckout = () => {
    onClose();
    if (cartId && locationId) {
      router.push(
        `/examples/leclerc-bakery/locations/${locationId}/carts/${cartId}/checkout`
      );
    } else {
      console.error("Cart ID or Location ID not available");
    }
  };

  // Convert cart items to CartSidebar format
  const cartItems = items.map((item) => ({
    id: item.cartId,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    imageUrl:
      item.image ||
      "https://img.cdn4dd.com/p/fit=cover,width=100,height=100,format=auto,quality=50/media/photosV2/7bb0efbd-1141-4518-bfe1-2cab3571478f-retina-large.jpg",
    modifiers: item.options.giftBox ? ["Gift Box"] : [],
  }));

  // Debug converted cart items
  // Debug: Converted cart items
  // Debug: Cart items count

  // Get suggested items from API products that aren't in cart
  const itemsInCart = items.map((item) => item.id);
  const availableItems = apiProducts.filter(
    (product) => !itemsInCart.includes(product._id || product.id)
  );

  // Select items for suggestions (prioritize items with images)
  const suggestedItems = availableItems
    .filter((product) => product.images && product.images.length > 0)
    .slice(0, 6)
    .map((product) => ({
      id: product._id || product.id,
      name: product.name,
      price:
        typeof product.price === "string"
          ? parseFloat(product.price)
          : product.price,
      imageUrl: product.images?.[0] || null,
    }));

  return (
    <CartSidebar
      isOpen={isOpen}
      onClose={onClose}
      cartItems={cartItems}
      suggestedItems={suggestedItems}
      onUpdateQuantity={(itemId, quantity) => updateQuantity(itemId, quantity)}
      onRemoveItem={(itemId) => removeItem(itemId)}
      onAddSuggestedItem={(suggestedItem) => {
        // Find the full product data from API
        const fullProduct = apiProducts.find(
          (product) => (product._id || product.id) === suggestedItem.id
        );
        if (fullProduct) {
          addToCart({
            id: fullProduct._id || fullProduct.id,
            name: fullProduct.name,
            description: fullProduct.description,
            price:
              typeof fullProduct.price === "string"
                ? parseFloat(fullProduct.price)
                : fullProduct.price,
            image: fullProduct.images?.[0] || null,
            category: "signature" as const,
            calories: 0,
            options: {
              warming: "room-temp",
              packaging: "standard",
              giftBox: false,
            },
          });
        }
      }}
      onCheckout={handleCheckout}
    />
  );
}

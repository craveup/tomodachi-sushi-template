"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../providers/cart-provider";
import CartSidebar from "@/components/crave-ui/cart-component/cart-sidebar";

export function CartWrapper() {
  const router = useRouter();
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    addToCart,
  } = useCart();

  // Convert our MenuItem items to the format expected by CartSidebar
  const cartItems = items.map((item) => ({
    id: item.cartId,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    imageUrl: item.image,
    modifiers: [],
  }));

  const handleCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  const handleAddSuggestedItem = async (suggestedItem: any) => {
    // Convert SuggestedItem to MenuItem format for our cart
    const menuItem = {
      id: suggestedItem.id,
      name: suggestedItem.name,
      description: "Suggested item",
      price: suggestedItem.price,
      image: suggestedItem.imageUrl,
      category: "maki" as const,
      calories: 0,
      options: {
        warming: "room-temp" as const,
        packaging: "standard" as const,
        giftBox: false,
      },
    };

    try {
      await addToCart(menuItem);
    } catch (error) {
      console.error("Failed to add suggested item to cart:", error);
    }
  };

  return (
    <CartSidebar
      isOpen={isCartOpen}
      onClose={closeCart}
      cartItems={cartItems}
      onUpdateQuantity={updateQuantity}
      onRemoveItem={removeItem}
      onCheckout={handleCheckout}
      onAddSuggestedItem={handleAddSuggestedItem}
    />
  );
}

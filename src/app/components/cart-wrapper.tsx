"use client";

import React from "react";
import { useCart } from "../providers/cart-provider";
import CartSidebar from "@/components/crave-ui/cart-component/cart-sidebar";

export function CartWrapper() {
  const { items, isCartOpen, closeCart, updateQuantity, removeItem } =
    useCart();

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
    console.log("Proceeding to checkout...");
    closeCart();
    // Add checkout navigation logic here later
  };

  return (
    <CartSidebar
      isOpen={isCartOpen}
      onClose={closeCart}
      cartItems={cartItems}
      onUpdateQuantity={updateQuantity}
      onRemoveItem={removeItem}
      onCheckout={handleCheckout}
    />
  );
}

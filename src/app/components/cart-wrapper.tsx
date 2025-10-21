"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCart as useCartContext } from "../providers/cart-provider";
import { useCart as useStorefrontCart } from "@/hooks/useCart";
import CartSidebar from "@/components/crave-ui/cart-component/cart-sidebar";

export function CartWrapper() {
  const router = useRouter();
  const { items, isCartOpen, closeCart } = useCartContext();
  const { cart } = useStorefrontCart();

  // Convert provider items → CartSidebar format
  const cartItems = useMemo(
    () =>
      items.map((item) => ({
        id: item.cartId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.image,
        modifiers: [] as string[],
      })),
    [items]
  );

  const navigateToCheckout = (targetUrl: string) => {
    if (/^https?:\/\//i.test(targetUrl)) {
      window.location.href = targetUrl;
    } else {
      router.push(targetUrl);
    }
  };

  const handleCheckout = (nextUrl?: string) => {
    const targetUrl = nextUrl?.trim() || cart?.checkoutUrl?.trim() || "";

    if (!targetUrl) return;

    closeCart();
    navigateToCheckout(targetUrl);
  };

  return (
    <CartSidebar
      isOpen={isCartOpen}
      onClose={closeCart}
      cartItems={cartItems}
      onCheckout={handleCheckout}
    />
  );
}

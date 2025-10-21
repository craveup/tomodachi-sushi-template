"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../providers/cart-provider";
import CartSidebar from "@/components/crave-ui/cart-component/cart-sidebar";
import { menuData } from "../data/menu-data";

export function CartWrapper() {
  const router = useRouter();
  const { items, isCartOpen, closeCart, cartId, locationId } = useCart();

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

  // Suggested items from menu
  const suggestedFromMenu = useMemo(() => {
    const pools = [
      ...(menuData["nigiri-sashimi"] || []),
      ...(menuData["seasonal-rolls-handrolls"] || []),
      ...(menuData["chefs-creations-warm-dishes"] || []),
    ];
    return pools.slice(0, 12).map((i) => ({
      id: i.id,
      name: i.name,
      price: i.price,
      imageUrl: i.image,
    }));
  }, []);

  const navigateToCheckout = (targetUrl: string) => {
    if (/^https?:\/\//i.test(targetUrl)) {
      window.location.href = targetUrl;
    } else {
      router.push(targetUrl);
    }
  };

  const handleCheckout = (nextUrl?: string) => {
    const targetUrl =
      nextUrl?.trim() ||
      (cartId
        ? `/locations/${locationId}/carts/${cartId}/checkout`
        : "");

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


"use client";

import { useState } from "react";
import { Button } from "../button";
import { ShoppingCart } from "lucide-react";
import { CartSidebar } from "@/components/crave-ui/cart-component";

export default function CartSidebarDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full flex justify-center">
      <Button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <ShoppingCart className="w-4 h-4" />
        Open Cart
      </Button>

      <CartSidebar
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onCheckout={() => {
          console.log("Proceeding to checkout");
          setIsOpen(false);
        }}
      />
    </div>
  );
}

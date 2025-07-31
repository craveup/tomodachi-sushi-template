"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

const EmptyCart = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center">
        <div className="mx-auto h-24 w-24 text-gray-400 mb-6">
          <ShoppingCart className="h-full w-full" />
        </div>

        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>

        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Looks like you haven't added any items to your cart yet. Start
          browsing our delicious menu to get started!
        </p>

        <Link href="/examples/leclerc-bakery/menu">
          <Button
            size="lg"
            className="bg-[hsl(var(--brand-accent))] hover:bg-[hsl(var(--brand-accent))]/90 text-white"
          >
            Browse Menu
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default EmptyCart;

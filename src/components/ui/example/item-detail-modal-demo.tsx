"use client";

import { useState } from "react";
import { Button } from "../button";
import { Card } from "../card";
import { Badge } from "../badge";
import { Eye, ShoppingCart } from "lucide-react";
import Image from "next/image";
import type { MenuItem } from "@/types/restaurant";
import ItemDetailModal from "@/components/crave-ui/modal-components/item-detail-modal";

export default function ItemDetailModalDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);

  const sampleItem: MenuItem = {
    id: "burger-deluxe",
    name: "Gourmet Burger Deluxe",
    description:
      "Premium angus beef patty with aged cheddar, crispy bacon, caramelized onions, arugula, and our signature chipotle mayo on a brioche bun",
    price: 18.99,
    rating: 4.8,
    reviewCount: 247,
    imageUrl: "/images/food/placeholder-burger.svg",
    imageAlt: "Gourmet Burger Deluxe",
    badge: "Chef's Special",
    category: "Burgers",
    available: true,
    nutritionalInfo: {
      calories: 680,
      protein: 35,
      carbs: 42,
      fat: 38,
      fiber: 4,
      sugar: 8,
    },
    modifiers: [
      {
        id: "temperature",
        name: "How would you like it cooked?",
        required: true,
        maxSelect: 1,
        options: [
          { id: "rare", name: "Rare", price: 0, default: false },
          { id: "medium-rare", name: "Medium Rare", price: 0, default: false },
          { id: "medium", name: "Medium", price: 0, default: true },
          { id: "medium-well", name: "Medium Well", price: 0, default: false },
          { id: "well-done", name: "Well Done", price: 0, default: false },
        ],
      },
      {
        id: "sides",
        name: "Choose your side",
        required: true,
        maxSelect: 1,
        options: [
          { id: "fries", name: "French Fries", price: 0, default: true },
          { id: "sweet-potato", name: "Sweet Potato Fries", price: 2.0 },
          { id: "onion-rings", name: "Onion Rings", price: 2.5 },
          { id: "side-salad", name: "Side Salad", price: 1.5 },
        ],
      },
      {
        id: "extras",
        name: "Add extras",
        required: false,
        maxSelect: 5,
        options: [
          { id: "extra-bacon", name: "Extra Bacon", price: 3.0 },
          { id: "extra-cheese", name: "Extra Cheese", price: 2.0 },
          { id: "avocado", name: "Avocado", price: 2.5 },
          { id: "mushrooms", name: "Sautéed Mushrooms", price: 2.0 },
          { id: "pickles", name: "Extra Pickles", price: 0.5 },
        ],
      },
    ],
  };

  const handleAddToCart = (
    item: MenuItem,
    quantity: number,
    modifiers?: any
  ) => {
    const cartItem = {
      id: `${item.id}-${Date.now()}`,
      name: item.name,
      price: item.price,
      quantity,
      modifiers,
      image: item.imageUrl,
    };

    setCartItems((prev) => [...prev, cartItem]);
    console.log("Added to cart:", cartItem);
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-4">
      {/* Sample Menu Item Card */}
      <Card className="overflow-hidden">
        <div className="relative">
          <div className="relative w-full h-48">
            <Image
              src="/images/food/placeholder-burger.svg"
              alt={sampleItem.imageAlt || sampleItem.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
            <div className="absolute top-3 left-3">
              <Badge className="bg-orange-500 text-white">
                {sampleItem.badge}
              </Badge>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <div>
              <h3 className="text-lg font-semibold">{sampleItem.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {sampleItem.description}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xl font-bold">${sampleItem.price}</div>
              <div className="text-sm text-muted-foreground">
                ⭐ {sampleItem.rating} ({sampleItem.reviewCount})
              </div>
            </div>

            <Button
              onClick={() => setIsOpen(true)}
              className="w-full"
              size="lg"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details & Customize
            </Button>
          </div>
        </div>
      </Card>

      {/* Cart Summary */}
      {cartItems.length > 0 && (
        <Card className="p-4 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <ShoppingCart className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-green-800 dark:text-green-200 mb-1">
                Items in Cart: {cartItems.length}
              </h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                Latest: {cartItems[cartItems.length - 1]?.name} (Qty:{" "}
                {cartItems[cartItems.length - 1]?.quantity})
              </p>
            </div>
          </div>
        </Card>
      )}

      <ItemDetailModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onAddToCart={handleAddToCart}
        item={sampleItem}
      />
    </div>
  );
}

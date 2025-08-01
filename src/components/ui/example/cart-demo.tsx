"use client";

import { useState } from "react";
import { Cart } from "../cart";
import { Button } from "../button";
import { IPhoneMockup } from "@/components/docs/component-preview/components/device-mockups/iphone";
import { Plus } from "lucide-react";
import { CartItem } from "@/types/restaurant";

const mockItems: CartItem[] = [
  {
    id: "1",
    name: "Wagyu Beef Tataki",
    price: 28.0,
    quantity: 2,
    image: "/images/food/wagyu-tataki.jpg",
    modifiers: [
      { id: "m1", name: "Extra Truffle Ponzu", price: 3.0 },
      { id: "m2", name: "Add Foie Gras", price: 12.0 },
    ],
    notes: "Medium rare, extra wasabi on the side",
  },
  {
    id: "2",
    name: "Miso Glazed Black Cod",
    price: 42.0,
    quantity: 1,
    image: "/images/food/miso-black-cod.jpg",
  },
  {
    id: "3",
    name: "Uni Carbonara",
    price: 32.0,
    quantity: 1,
    image: "/images/food/uni-carbonara.jpg",
    modifiers: [
      { id: "m3", name: "Extra Uni", price: 8.0 },
      { id: "m4", name: "Shaved Black Truffle", price: 15.0 },
    ],
  },
];

export default function CartDemo() {
  const [items, setItems] = useState<CartItem[]>(mockItems);
  const [showEmptyState, setShowEmptyState] = useState(false);

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setItems(
      items.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setItems([]);
  };

  const handleCheckout = () => {
    console.log("Proceeding to checkout with items:", items);
  };

  const handleAddSampleItem = () => {
    const newItem: CartItem = {
      id: Date.now().toString(),
      name: "Matcha Crème Brûlée",
      price: 14.0,
      quantity: 1,
      image: "/images/food/matcha-creme-brulee.jpg",
    };
    setItems([...items, newItem]);
  };

  return (
    <div className="w-full space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowEmptyState(!showEmptyState)}
        >
          {showEmptyState ? "Show with items" : "Show empty state"}
        </Button>
        {!showEmptyState && (
          <Button variant="outline" size="sm" onClick={handleAddSampleItem}>
            <Plus className="h-4 w-4 mr-2" />
            Add sample item
          </Button>
        )}
      </div>

      {/* Cart Component in iPhone Mockup */}
      <div className="flex justify-center">
        <IPhoneMockup variant="pro" color="black">
          <Cart
            items={showEmptyState ? [] : items}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onCheckout={handleCheckout}
            className="h-full border-0 rounded-none"
          />
        </IPhoneMockup>
      </div>
    </div>
  );
}

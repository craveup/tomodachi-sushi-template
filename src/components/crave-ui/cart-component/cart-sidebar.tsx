"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useFormatters } from "@/lib/i18n/hooks";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
  modifiers?: string[];
}

interface SuggestedItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems?: CartItem[];
  suggestedItems?: SuggestedItem[];
  onUpdateQuantity?: (itemId: string, quantity: number) => void;
  onRemoveItem?: (itemId: string) => void;
  onAddSuggestedItem?: (item: SuggestedItem) => void;
  onCheckout?: () => void;
}

const defaultCartItems: CartItem[] = [
  {
    id: "1",
    name: "Brioche with Chocolate Chips",
    price: 5.5,
    quantity: 1,
    imageUrl:
      "https://img.cdn4dd.com/p/fit=cover,width=100,height=100,format=auto,quality=50/media/photosV2/7bb0efbd-1141-4518-bfe1-2cab3571478f-retina-large.jpg",
  },
];

const defaultSuggestedItems: SuggestedItem[] = [
  {
    id: "s1",
    name: "Two Chip Chocolate Chip Cookie",
    price: 6.33,
    imageUrl:
      "https://img.cdn4dd.com/cdn-cgi/image/fit=contain,width=1200,height=672,format=auto/https://doordash-static.s3.amazonaws.com/media/photosV2/d1edfa6f-0b34-4919-9833-237faa20feae-retina-large.jpg",
  },
  {
    id: "s2",
    name: "Organic Valley Milk",
    price: 3.3,
    imageUrl:
      "https://img.cdn4dd.com/cdn-cgi/image/fit=contain,width=1200,height=672,format=auto/https://doordash-static.s3.amazonaws.com/media/photosV2/b6c4aa04-a4b1-47e4-b0ab-d8590fcdaace-retina-large.jpg",
  },
  {
    id: "s3",
    name: "Chocolate Chip Walnut Cookie",
    price: 6.33,
    imageUrl:
      "https://img.cdn4dd.com/cdn-cgi/image/fit=contain,width=1200,height=672,format=auto/https://doordash-static.s3.amazonaws.com/media/photosV2/471c0dfb-6d30-41e7-b75d-1c9d0e17cf8c-retina-large.jpg",
  },
  {
    id: "s4",
    name: "Latte",
    price: 4.95,
    imageUrl:
      "https://img.cdn4dd.com/cdn-cgi/image/fit=contain,width=1200,height=672,format=auto/https://doordash-static.s3.amazonaws.com/media/photosV2/e261fb7e-1126-4e01-b305-e058374ca571-retina-large.jpg",
  },
  {
    id: "s5",
    name: "Dark Chocolate Peanut Butter Chip Cookie",
    price: 6.33,
    imageUrl:
      "https://img.cdn4dd.com/cdn-cgi/image/fit=contain,width=1200,height=672,format=auto/https://doordash-static.s3.amazonaws.com/media/photosV2/f59c45f6-3de4-4802-af94-1541cb3fab1e-retina-large.jpg",
  },
  {
    id: "s6",
    name: "Oatly Milk",
    price: 3.3,
    imageUrl:
      "https://img.cdn4dd.com/cdn-cgi/image/fit=contain,width=1200,height=672,format=auto/https://doordash-static.s3.amazonaws.com/media/photosV2/6f57853f-7933-45f7-a69d-1ddcbbe3df6b-retina-large.png",
  },
];

export default function CartSidebar({
  isOpen,
  onClose,
  cartItems = defaultCartItems,
  suggestedItems = defaultSuggestedItems,
  onUpdateQuantity,
  onRemoveItem,
  onAddSuggestedItem,
  onCheckout,
}: CartSidebarProps) {
  const [suggestedScrollPosition, setSuggestedScrollPosition] = useState(0);
  const [internalCartItems, setInternalCartItems] =
    useState<CartItem[]>(cartItems);
  const { currency } = useFormatters();

  // Update internal state when props change
  React.useEffect(() => {
    setInternalCartItems(cartItems);
  }, [cartItems]);

  // Lock body scroll when cart is open - minimal approach
  React.useEffect(() => {
    if (isOpen) {
      // Add scroll lock class to body
      document.body.classList.add("cart-scroll-lock");

      // Add styles via CSS-in-JS
      const style = document.createElement("style");
      style.id = "cart-scroll-lock-styles";
      style.textContent = `
        .cart-scroll-lock {
          overflow: hidden !important;
        }
      `;
      document.head.appendChild(style);

      // Cleanup function
      return () => {
        document.body.classList.remove("cart-scroll-lock");
        const styleElement = document.getElementById("cart-scroll-lock-styles");
        if (styleElement) {
          styleElement.remove();
        }
      };
    }
  }, [isOpen]);

  const handleQuantityChange = (itemId: string, change: number) => {
    const item = internalCartItems.find((item) => item.id === itemId);
    if (item) {
      const newQuantity = Math.max(0, item.quantity + change);

      if (newQuantity === 0) {
        // Remove item from cart
        const updatedItems = internalCartItems.filter(
          (item) => item.id !== itemId
        );
        setInternalCartItems(updatedItems);
        onRemoveItem?.(itemId);
      } else {
        // Update quantity
        const updatedItems = internalCartItems.map((cartItem) =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: newQuantity }
            : cartItem
        );
        setInternalCartItems(updatedItems);
        onUpdateQuantity?.(itemId, newQuantity);
      }
    }
  };

  const handleRemoveItem = (itemId: string) => {
    const updatedItems = internalCartItems.filter((item) => item.id !== itemId);
    setInternalCartItems(updatedItems);
    onRemoveItem?.(itemId);
  };

  const handleAddSuggestedItem = (suggestedItem: SuggestedItem) => {
    // Check if item already exists in cart
    const existingItemIndex = internalCartItems.findIndex(
      (item) => item.id === suggestedItem.id || item.name === suggestedItem.name
    );

    if (existingItemIndex >= 0) {
      // If item exists, increase quantity
      const updatedItems = internalCartItems.map((item) =>
        item.id === internalCartItems[existingItemIndex].id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setInternalCartItems(updatedItems);
      onUpdateQuantity?.(
        internalCartItems[existingItemIndex].id,
        internalCartItems[existingItemIndex].quantity + 1
      );
    } else {
      // Add new item to cart
      const newCartItem: CartItem = {
        id: suggestedItem.id,
        name: suggestedItem.name,
        price: suggestedItem.price,
        quantity: 1,
        imageUrl: suggestedItem.imageUrl,
      };

      const updatedItems = [...internalCartItems, newCartItem];
      setInternalCartItems(updatedItems);
      onAddSuggestedItem?.(suggestedItem);
    }
  };

  const scrollSuggested = (direction: "left" | "right") => {
    const container = document.getElementById("suggested-carousel");
    if (!container) return;

    const scrollAmount = 200;
    const newPosition =
      direction === "left"
        ? Math.max(0, suggestedScrollPosition - scrollAmount)
        : suggestedScrollPosition + scrollAmount;

    container.scrollTo({
      left: newPosition,
      behavior: "smooth",
    });
    setSuggestedScrollPosition(newPosition);
  };

  const subtotal = internalCartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - covers everything including navbar and scrollbars */}
      <div
        className="fixed inset-0 bg-black/50 z-[999] overflow-hidden"
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 999,
        }}
      />

      {/* Sidebar */}
      <div
        className="fixed right-0 top-0 h-full w-[430px] max-w-[430px] bg-background shadow-xl z-[1000] flex flex-col"
        style={{
          width: "430px",
          maxWidth: "430px",
          zIndex: 1000,
        }}
        role="dialog"
        aria-modal="true"
        data-testid="OrderCart"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="w-6" /> {/* Spacer */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close"
            className="h-8 w-8"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Cart Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Cart Items */}
          <div className="p-4">
            {internalCartItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Your cart is empty
              </div>
            ) : (
              <div className="space-y-4">
                {internalCartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-3 border border-border rounded-lg hover:bg-muted/50"
                    role="listitem"
                    aria-label={`click to open modal and edit item: ${item.name}`}
                    data-testid="OrderCartItem"
                  >
                    {/* Item Image */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">
                        {item.name}
                      </h3>
                      <p className="text-lg font-semibold text-foreground mt-1">
                        {currency(item.price)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div
                      className="flex items-center gap-2"
                      data-testid="QuantityContainer"
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.id)}
                        aria-label="remove item from cart"
                        data-testid="stepper-decrement-button"
                        className="h-8 w-8 text-muted-foreground hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>

                      <span
                        className="text-sm font-medium min-w-[2rem] text-center"
                        data-testid="stepper-expanded-quantity"
                      >
                        {item.quantity} ×
                      </span>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleQuantityChange(item.id, 1)}
                        aria-label="add one to cart"
                        data-testid="stepper-increment-button"
                        className="h-8 w-8 text-muted-foreground hover:text-green-600"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Suggested Items Section */}
          <div className="border-t border-border p-4">
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-lg font-semibold text-foreground"
                data-testid="order-cart-recommendation-title"
              >
                In case you missed it
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => scrollSuggested("left")}
                  aria-label="Previous button of carousel"
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => scrollSuggested("right")}
                  aria-label="Next button of carousel"
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Suggested Items Carousel */}
            <div className="overflow-hidden">
              <div
                id="suggested-carousel"
                className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 items-stretch"
                data-testid="order-cart-carousel-container"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {suggestedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex-shrink-0 w-32"
                    data-testid="CarouselSuggestedItem"
                    tabIndex={0}
                  >
                    <div className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
                      <div className="relative">
                        <div className="aspect-square">
                          <Image
                            src={item.imageUrl || "/placeholder.svg"}
                            alt={item.name}
                            width={128}
                            height={128}
                            className="w-full h-full object-cover"
                            data-testid="CarouselItemImage"
                          />
                        </div>
                        <div className="absolute bottom-0 right-0 p-2">
                          <Button
                            size="icon"
                            variant="secondary"
                            onClick={() => handleAddSuggestedItem(item)}
                            aria-label="Add to cart"
                            className="h-8 w-8 bg-white hover:bg-green-50 hover:border-green-300 rounded-full shadow-md border border-gray-200 transition-all duration-200 hover:scale-105"
                          >
                            <Plus className="h-4 w-4 text-green-600" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-2 flex-1 flex flex-col justify-between">
                        <h4 className="text-xs font-medium text-foreground line-clamp-2 mb-1">
                          {item.name}
                        </h4>
                        <p className="text-sm font-semibold text-foreground">
                          {currency(item.price)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Footer */}
        <div className="border-t border-border p-4">
          <Button
            onClick={onCheckout}
            className="w-full h-12 text-base font-semibold"
            size="lg"
            data-anchor-id="CheckoutButton"
            data-testid="CheckoutButton"
          >
            <div className="flex items-center justify-between w-full">
              <span>Checkout</span>
              <span>{currency(subtotal)}</span>
            </div>
          </Button>
        </div>
      </div>
    </>
  );
}

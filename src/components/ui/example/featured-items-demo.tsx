"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "../button";
import { Badge } from "../badge";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import Image from "next/image";

interface FoodItem {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
  badge?: string;
}

interface FeaturedItemsCarouselProps {
  title?: string;
  items?: FoodItem[];
  onAddToCart?: (item: FoodItem) => void;
  onItemClick?: (item: FoodItem) => void;
}

const defaultItems: FoodItem[] = [
  {
    id: "1",
    name: "A5 Wagyu Tataki",
    price: "$48.00",
    imageUrl: "/images/food/wagyu-tataki.jpg",
    badge: "Chef's Special",
  },
  {
    id: "2",
    name: "Miso Black Cod",
    price: "$42.00",
    imageUrl: "/images/food/miso-black-cod.jpg",
  },
  {
    id: "3",
    name: "Uni Carbonara",
    price: "$32.00",
    imageUrl: "/images/food/uni-carbonara.jpg",
    badge: "Signature",
  },
  {
    id: "4",
    name: "Yuzu Kosho Duck Breast",
    price: "$38.00",
    imageUrl: "/images/food/yuzu-duck.jpg",
  },
  {
    id: "5",
    name: "Kaiseki Tasting Menu",
    price: "$95.00",
    imageUrl: "/images/food/kaiseki-tasting.jpg",
    badge: "Chef's Choice",
  },
  {
    id: "6",
    name: "Matcha Soufflé",
    price: "$18.00",
    imageUrl: "/images/food/matcha-souffle.jpg",
  },
  {
    id: "7",
    name: "Sake Pairing Flight",
    price: "$45.00",
    imageUrl: "/images/food/sake-flight.jpg",
  },
];

function FeaturedItemsCarousel({
  title = "Featured Items",
  items = defaultItems,
  onAddToCart,
  onItemClick,
}: FeaturedItemsCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleScroll = (direction: "left" | "right") => {
    const container = document.getElementById("carousel-container");
    if (!container) return;

    const scrollAmount = 240 + 16; // card width + gap
    const newPosition =
      direction === "left"
        ? Math.max(0, scrollPosition - scrollAmount)
        : scrollPosition + scrollAmount;

    container.scrollTo({
      left: newPosition,
      behavior: "smooth",
    });

    setScrollPosition(newPosition);
    setCanScrollLeft(newPosition > 0);
    setCanScrollRight(
      newPosition < container.scrollWidth - container.clientWidth
    );
  };

  const handleAddToCart = (item: FoodItem, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(item);
  };

  return (
    <div className="w-full py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground dark:text-gray-100">
            {title}
          </h2>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleScroll("left")}
            disabled={!canScrollLeft}
            aria-label="Previous button of carousel"
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleScroll("right")}
            disabled={!canScrollRight}
            aria-label="Next button of carousel"
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        <div
          id="carousel-container"
          className="flex gap-4 overflow-x-auto scrollbar-hide px-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item) => (
            <div key={item.id} className="flex-shrink-0 w-60">
              <div
                className="bg-background rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                onClick={() => onItemClick?.(item)}
                role="button"
                tabIndex={0}
                aria-label={item.name}
              >
                {/* Image Container */}
                <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-800">
                  {item.badge && (
                    <div className="absolute top-3 left-3 z-10">
                      <Badge
                        variant="secondary"
                        className="bg-orange-100 text-orange-800 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400 dark:hover:bg-orange-900/30"
                      >
                        {item.badge}
                      </Badge>
                    </div>
                  )}
                  <Image
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover w-full h-full"
                    sizes="240px"
                  />
                  {/* Add to Cart Button */}
                  <div className="absolute bottom-3 right-3">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 bg-background hover:bg-muted/50 shadow-md"
                      onClick={(e) => handleAddToCart(item, e)}
                      aria-label="Add item to cart"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-medium text-foreground dark:text-gray-100 mb-2 line-clamp-2">
                    {item.name}
                  </h3>
                  <p className="text-lg font-semibold text-foreground dark:text-gray-100">
                    {item.price}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function FeaturedItemsDemo() {
  const [cartItems, setCartItems] = useState<string[]>([]);

  const handleAddToCart = (item: FoodItem) => {
    setCartItems((prev) => [...prev, item.id]);
    console.log("Added to cart:", item.name);
  };

  const handleItemClick = (item: FoodItem) => {
    console.log("Item clicked:", item.name);
  };

  return (
    <div className="w-full">
      <FeaturedItemsCarousel
        title="Chef's Recommendations"
        onAddToCart={handleAddToCart}
        onItemClick={handleItemClick}
      />
      {cartItems.length > 0 && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-800 dark:text-green-400">
            Items in cart: {cartItems.length}
          </p>
        </div>
      )}
    </div>
  );
}

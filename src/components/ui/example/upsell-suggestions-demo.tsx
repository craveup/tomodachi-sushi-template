"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "../button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import Image from "next/image";

interface SuggestedItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

interface UpsellSuggestionsProps {
  title?: string;
  items?: SuggestedItem[];
  onAddItem?: (item: SuggestedItem) => void;
  onItemClick?: (item: SuggestedItem) => void;
  className?: string;
}

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
  {
    id: "s7",
    name: "Caramel Coconut Chocolate Chip",
    price: 6.33,
    imageUrl:
      "https://img.cdn4dd.com/cdn-cgi/image/fit=contain,width=1200,height=672,format=auto/https://doordash-static.s3.amazonaws.com/media/photosV2/dba02860-6d9f-45d0-9c9e-6b0dc36a37c0-retina-large.jpg",
  },
  {
    id: "s8",
    name: "Saratoga Sparkling Water",
    price: 3.03,
    imageUrl:
      "https://img.cdn4dd.com/cdn-cgi/image/fit=contain,width=1200,height=672,format=auto/https://doordash-static.s3.amazonaws.com/media/photosV2/2a55ec85-7365-4200-a239-352e93b82ed7-retina-large.jpg",
  },
  {
    id: "s9",
    name: "Dark Chocolate Chip Cookie",
    price: 6.33,
    imageUrl:
      "https://img.cdn4dd.com/cdn-cgi/image/fit=contain,width=1200,height=672,format=auto/https://doordash-static.s3.amazonaws.com/media/photosV2/86fcc107-3447-4ed2-a77c-bff23eb202ea-retina-large.jpg",
  },
  {
    id: "s10",
    name: "Saratoga Still Water",
    price: 2.2,
    imageUrl:
      "https://img.cdn4dd.com/cdn-cgi/image/fit=contain,width=1200,height=672,format=auto/https://doordash-static.s3.amazonaws.com/media/photosV2/a257b947-456e-4e27-8ef5-42060f554153-retina-large.jpg",
  },
  {
    id: "s11",
    name: "Coffee",
    price: 3.3,
    imageUrl:
      "https://img.cdn4dd.com/cdn-cgi/image/fit=contain,width=1200,height=672,format=auto/https://doordash-static.s3.amazonaws.com/media/photosV2/b15f273d-0525-4b53-bbf5-0f3510bc1c12-retina-large.jpg",
  },
  {
    id: "s12",
    name: "Vegan & GF Chocolate Chip Walnut Cookie",
    price: 6.87,
    imageUrl:
      "https://img.cdn4dd.com/cdn-cgi/image/fit=contain,width=1200,height=672,format=auto/https://doordash-static.s3.amazonaws.com/media/photosV2/3a0fe12d-858b-49a8-a2d5-68cc699f6dad-retina-large.jpg",
  },
  {
    id: "s13",
    name: "Valrhona Hot Chocolate",
    price: 5.5,
    imageUrl:
      "https://img.cdn4dd.com/cdn-cgi/image/fit=contain,width=1200,height=672,format=auto/https://doordash-static.s3.amazonaws.com/media/photosV2/1b996a9d-15a9-4f8d-be3e-c3c255818d07-retina-large.jpg",
  },
  {
    id: "s14",
    name: "Banana Chocolate Chip Slice",
    price: 5.5,
    imageUrl:
      "https://img.cdn4dd.com/cdn-cgi/image/fit=contain,width=1200,height=672,format=auto/https://doordash-static.s3.amazonaws.com/media/photosV2/d2e00d37-35f6-4b2b-af5e-b2a0a5a57307-retina-large.jpg",
  },
  {
    id: "s15",
    name: "Mocha",
    price: 5.77,
    imageUrl:
      "https://img.cdn4dd.com/cdn-cgi/image/fit=contain,width=1200,height=672,format=auto/https://doordash-static.s3.amazonaws.com/media/photosV2/6ece6a6f-ca24-411a-bc69-6d4c0f1a9592-retina-large.jpg",
  },
  {
    id: "s16",
    name: "Cold Brew",
    price: 5.5,
    imageUrl:
      "https://img.cdn4dd.com/cdn-cgi/image/fit=contain,width=1200,height=672,format=auto/https://doordash-static.s3.amazonaws.com/media/photosV2/c97723a3-5121-476a-9a3d-6e6c519bde6d-retina-large.jpg",
  },
  {
    id: "s17",
    name: "Cappucino",
    price: 4.4,
    imageUrl:
      "https://img.cdn4dd.com/cdn-cgi/image/fit=contain,width=1200,height=672,format=auto/https://doordash-static.s3.amazonaws.com/media/photosV2/c040020d-44bb-4489-bb19-d7ccd8c7a9a7-retina-large.jpg",
  },
  {
    id: "s18",
    name: "Lemon Slice",
    price: 5.5,
    imageUrl:
      "https://img.cdn4dd.com/cdn-cgi/image/fit=contain,width=1200,height=672,format=auto/https://doordash-static.s3.amazonaws.com/media/photosV2/20619e4e-5da7-4cfa-b570-61b88ccf7d73-retina-large.jpg",
  },
  {
    id: "s19",
    name: "Decaf Americano",
    price: 3.57,
    imageUrl:
      "https://img.cdn4dd.com/cdn-cgi/image/fit=contain,width=1200,height=672,format=auto/https://doordash-static.s3.amazonaws.com/media/photosV2/30c0274d-08dd-4b3f-83b4-3f542c674829-retina-large.jpg",
  },
  {
    id: "s20",
    name: "Oatmeal Raisin Scone",
    price: 4.68,
    imageUrl:
      "https://img.cdn4dd.com/cdn-cgi/image/fit=contain,width=1200,height=672,format=auto/https://doordash-static.s3.amazonaws.com/media/photosV2/b0739f10-1a3f-4002-9963-8995102d3fe3-retina-large.jpg",
  },
  {
    id: "s21",
    name: "Tea",
    price: 3.85,
    imageUrl:
      "https://img.cdn4dd.com/cdn-cgi/image/fit=contain,width=1200,height=672,format=auto/https://doordash-static.s3.amazonaws.com/media/photosV2/59d09758-908f-4fc7-8ccd-cc866d69c46b-retina-large.jpg",
  },
  {
    id: "s22",
    name: "Cafe Au Lait",
    price: 3.85,
    imageUrl:
      "https://img.cdn4dd.com/cdn-cgi/image/fit=contain,width=1200,height=672,format=auto/https://doordash-static.s3.amazonaws.com/media/photosV2/0d5d012b-5329-4aa0-afd6-d80b8a144112-retina-large.jpg",
  },
  {
    id: "s23",
    name: "Rocky Road",
    price: 6.6,
    imageUrl:
      "https://img.cdn4dd.com/cdn-cgi/image/fit=contain,width=1200,height=672,format=auto/https://doordash-static.s3.amazonaws.com/media/photosV2/eef8f174-0aed-46d7-9ac6-b559cc097a0e-retina-large.jpg",
  },
  {
    id: "s24",
    name: "Matcha Draft",
    price: 7.7,
    imageUrl:
      "https://img.cdn4dd.com/cdn-cgi/image/fit=contain,width=1200,height=672,format=auto/https://doordash-static.s3.amazonaws.com/media/photosV2/c97723a3-5121-476a-9a3d-6e6c519bde6d-retina-large.jpg",
  },
  {
    id: "s25",
    name: "Americano",
    price: 3.57,
    imageUrl:
      "https://img.cdn4dd.com/cdn-cgi/image/fit=contain,width=1200,height=672,format=auto/https://doordash-static.s3.amazonaws.com/media/photosV2/31c95d28-9dbf-4e6c-8835-5119b17b635a-retina-large.jpg",
  },
  {
    id: "s26",
    name: "Cortado",
    price: 4.12,
    imageUrl:
      "https://img.cdn4dd.com/cdn-cgi/image/fit=contain,width=1200,height=672,format=auto/https://doordash-static.s3.amazonaws.com/media/photosV2/edb861d0-b460-4029-84d7-3d594d071cfe-retina-large.jpg",
  },
  {
    id: "s27",
    name: "Macchiato",
    price: 3.57,
    imageUrl:
      "https://img.cdn4dd.com/cdn-cgi/image/fit=contain,width=1200,height=672,format=auto/https://doordash-static.s3.amazonaws.com/media/photosV2/65913ff9-1e32-441c-99ef-6be72f017306-retina-large.jpg",
  },
  {
    id: "s28",
    name: "Espresso",
    price: 3.3,
    imageUrl:
      "https://img.cdn4dd.com/cdn-cgi/image/fit=contain,width=1200,height=672,format=auto/https://doordash-static.s3.amazonaws.com/media/photosV2/511df683-ed41-40c6-aa35-a19547d7150f-retina-large.jpg",
  },
  {
    id: "s29",
    name: "Flat White",
    price: 4.4,
    imageUrl:
      "https://img.cdn4dd.com/cdn-cgi/image/fit=contain,width=1200,height=672,format=auto/https://doordash-static.s3.amazonaws.com/media/photosV2/085dc98a-18e6-44f1-8ed0-04a5200c47fe-retina-large.jpg",
  },
];

export default function UpsellSuggestions({
  title = "In case you missed it",
  items = defaultSuggestedItems,
  onAddItem,
  onItemClick,
  className = "",
}: UpsellSuggestionsProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleScroll = (direction: "left" | "right") => {
    const container = document.getElementById("upsell-carousel-container");
    if (!container) return;

    const scrollAmount = 200; // Amount to scroll per click
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

  const handleAddItem = (item: SuggestedItem, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddItem?.(item);
  };

  const handleItemClick = (item: SuggestedItem) => {
    onItemClick?.(item);
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Separator */}
      <hr
        aria-hidden="true"
        role="presentation"
        className="border-border mb-4"
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-lg font-semibold text-foreground"
          data-testid="order-cart-recommendation-title"
        >
          {title}
        </h3>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleScroll("left")}
            disabled={!canScrollLeft}
            aria-label="Previous button of carousel"
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
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
      <div className="overflow-hidden">
        <div
          id="upsell-carousel-container"
          className="flex gap-3 overflow-x-auto scrollbar-hide pb-2"
          data-testid="order-cart-carousel-container"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-32 cursor-pointer"
              data-testid="CarouselSuggestedItem"
              tabIndex={0}
              onClick={() => handleItemClick(item)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleItemClick(item);
                }
              }}
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
                  {/* Add to Cart Button */}
                  <div
                    className="absolute bottom-0 right-0 w-12 h-12 flex items-center justify-center"
                    style={{
                      bottom: "0px",
                      right: "18px",
                      width: "48px",
                      height: "48px",
                    }}
                  >
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={(e) => handleAddItem(item, e)}
                      aria-label="Add to cart"
                      className="h-8 w-8 bg-background hover:bg-accent shadow-md rounded-full"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-2 flex flex-col flex-grow">
                  <h4 className="text-xs font-medium text-foreground line-clamp-2 mb-1 min-h-[2rem]">
                    {item.name}
                  </h4>
                  <p className="text-sm font-semibold text-foreground mt-auto">
                    ${item.price.toFixed(2)}
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

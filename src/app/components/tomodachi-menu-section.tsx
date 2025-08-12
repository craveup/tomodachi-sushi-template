"use client";

import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import Image from "next/image";
import { useCart } from "../providers/cart-provider";
import { MenuItem, ItemOptions } from "../types";

interface MenuSectionProps {
  title: string;
  items: MenuItem[];
  sectionId?: string;
  onSectionMount?: (id: string, element: HTMLElement | null) => void;
}

export const TomodachiMenuSection = ({
  title,
  items,
  sectionId,
  onSectionMount,
}: MenuSectionProps) => {
  const { addToCart, isLoading } = useCart();
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>(
    {}
  );

  const handleAddToCart = async (item: MenuItem) => {
    const defaultOptions: ItemOptions = {
      warming: "room-temp",
      packaging: "standard",
      giftBox: false,
    };

    try {
      await addToCart({ ...item, options: defaultOptions });
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  };

  const handleImageError = (itemId: string) => {
    setImageErrors((prev) => ({ ...prev, [itemId]: true }));
  };

  return (
    <section
      ref={(el) => {
        if (sectionId && onSectionMount) {
          onSectionMount(sectionId, el);
        }
      }}
      className="flex flex-col items-start gap-4 sm:gap-6 lg:gap-8 relative w-full"
    >
      {/* Section Header - Responsive styling */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 lg:gap-4 relative self-stretch w-full">
        <div className="inline-flex items-center justify-center px-0 py-[7px] relative">
          <div className="relative w-1.5 h-1.5 sm:w-2 sm:h-2 border border-solid border-borderdefault -rotate-45" />
          <Separator className="relative w-[30px] sm:w-[40px] lg:w-[50px] h-px bg-borderdefault" />
        </div>
        <h2 className="font-heading-h3 text-textdefault text-xl sm:text-2xl lg:text-[32px] tracking-[0.5px] sm:tracking-[0.75px] lg:tracking-[1px] leading-tight whitespace-nowrap">
          {title}
        </h2>
        <div className="inline-flex items-center justify-center px-0 py-[7px] relative">
          <Separator className="relative w-[30px] sm:w-[40px] lg:w-[50px] h-px bg-borderdefault" />
          <div className="relative w-1.5 h-1.5 sm:w-2 sm:h-2 border border-solid border-borderdefault -rotate-45" />
        </div>
      </div>

      {/* Menu Items - Responsive layout */}
      <div className="flex flex-col items-start gap-4 sm:gap-5 lg:gap-6 relative w-full">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 sm:gap-4 lg:gap-6 relative w-full min-h-[100px] sm:min-h-[110px] lg:min-h-[120px]"
          >
            {/* Item Image - Responsive sizing */}
            <div className="relative w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] lg:w-[120px] lg:h-[120px] flex-shrink-0 overflow-hidden rounded-xl sm:rounded-xl lg:rounded-2xl bg-backgroundmuted">
              {imageErrors[item.id] ? (
                // Fallback placeholder when image fails
                <div className="w-full h-full bg-backgroundmuted flex items-center justify-center">
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-textmuted"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              ) : (
                <Image
                  src={item.image || "/images/sushi/menu-items/sushi-plate.jpg"}
                  alt={item.name}
                  fill
                  className="object-cover transition-opacity duration-300"
                  sizes="(max-width: 640px) 80px, (max-width: 768px) 100px, 120px"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  onError={() => handleImageError(item.id)}
                  priority={false}
                />
              )}
            </div>

            {/* Item Content - Responsive typography and spacing */}
            <div className="flex flex-col items-start gap-2 sm:gap-2.5 lg:gap-3 relative flex-1 min-w-0">
              <div className="flex items-start justify-between relative self-stretch w-full">
                {/* Item Name - Responsive text sizing */}
                <h3 className="relative flex-1 min-w-0 font-heading-h5 text-textdefault text-base sm:text-lg lg:text-[22px] tracking-[0.5px] sm:tracking-[0.75px] lg:tracking-[1px] leading-tight pr-2 sm:pr-3 lg:pr-4">
                  {item.name}
                </h3>

                {/* Price and Add Button - Touch-friendly spacing */}
                <div className="flex items-center gap-2 sm:gap-2.5 lg:gap-3 flex-shrink-0">
                  <span className="relative font-heading-h5 text-textdefault text-base sm:text-lg lg:text-[22px] tracking-[0.5px] sm:tracking-[0.75px] lg:tracking-[1px] leading-tight whitespace-nowrap">
                    ${item.price.toFixed(2)}
                  </span>
                  {/* Touch-friendly add button */}
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={isLoading}
                    className="w-8 h-8 sm:w-9 sm:h-9 lg:w-8 lg:h-8 bg-backgroundprimary hover:bg-backgroundprimary/90 active:bg-backgroundprimary/80 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 touch-manipulation"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5 lg:w-4 lg:h-4 text-textinverse" />
                  </button>
                </div>
              </div>

              {/* Item Description - Responsive text sizing */}
              <p className="relative self-stretch font-text-small text-textmuted text-xs sm:text-sm lg:text-[14px] leading-relaxed line-clamp-2 sm:line-clamp-3">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

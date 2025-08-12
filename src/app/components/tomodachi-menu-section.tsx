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
      className="flex flex-col items-start gap-8 relative w-full"
    >
      <div className="flex items-center justify-center gap-4 relative self-stretch w-full">
        <div className="inline-flex items-center justify-center px-0 py-[7px] relative">
          <div className="relative w-2 h-2 border border-solid border-borderdefault -rotate-45" />
          <Separator className="relative w-[50px] h-px bg-borderdefault" />
        </div>
        <h2 className="font-heading-h3 text-textdefault text-[32px] tracking-[1px] leading-tight whitespace-nowrap">
          {title}
        </h2>
        <div className="inline-flex items-center justify-center px-0 py-[7px] relative">
          <Separator className="relative w-[50px] h-px bg-borderdefault" />
          <div className="relative w-2 h-2 border border-solid border-borderdefault -rotate-45" />
        </div>
      </div>

      <div className="flex flex-col items-start gap-6 relative w-full">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-6 relative w-full min-h-[120px]"
          >
            <div className="relative w-[120px] h-[120px] flex-shrink-0 overflow-hidden rounded-2xl bg-backgroundmuted">
              {imageErrors[item.id] ? (
                // Fallback placeholder when image fails
                <div className="w-full h-full bg-backgroundmuted flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-textmuted"
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
                  sizes="120px"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  onError={() => handleImageError(item.id)}
                  priority={false}
                />
              )}
            </div>
            <div className="flex flex-col items-start gap-3 relative flex-1 min-w-0">
              <div className="flex items-start justify-between relative self-stretch w-full">
                <h3 className="relative flex-1 min-w-0 font-heading-h5 text-textdefault text-[22px] tracking-[1px] leading-tight pr-4">
                  {item.name}
                </h3>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="relative font-heading-h5 text-textdefault text-[22px] tracking-[1px] leading-tight whitespace-nowrap">
                    ${item.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={isLoading}
                    className="w-8 h-8 bg-backgroundprimary hover:bg-backgroundprimary/90 rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4 text-textinverse" />
                  </button>
                </div>
              </div>
              <p className="relative self-stretch font-text-small text-textmuted text-[14px] leading-relaxed line-clamp-3">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

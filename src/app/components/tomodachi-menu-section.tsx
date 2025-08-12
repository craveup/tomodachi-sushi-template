"use client";

import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import React from "react";
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
            <div className="relative w-[120px] h-[120px] flex-shrink-0">
              <img
                className="absolute w-[120px] h-[120px] top-0 left-0 object-cover rounded-2xl"
                alt={item.name}
                src={item.image || "/images/sushi/menu-items/sushi-plate.jpg"}
              />
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

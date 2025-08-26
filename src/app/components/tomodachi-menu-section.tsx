"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";

import { useCart } from "../providers/cart-provider";
import { useCart as useLiveCart } from "@/hooks/useCart";
import { postData } from "@/lib/handle-api";
import { formatApiError } from "@/lib/format-api-error";
import { getCartId } from "@/lib/local-storage";
import { location_Id as LOCATION_ID } from "@/constants";
import type { MenuItem, ItemOptions } from "../types";
import { ItemUnavailableActions } from "./product-description/ProductDescription";

interface MenuSectionProps {
  title: string;
  items: MenuItem[];
  sectionId?: string;
  onSectionMount?: (id: string, el: HTMLElement | null) => void;
  onItemClick?: (id: string) => void;
  locationId?: string;
}

export const TomodachiMenuSection = ({
  title,
  items,
  sectionId,
  onSectionMount,
  onItemClick,
  locationId: propLocationId,
}: MenuSectionProps) => {
  const params = useParams<{ locationId?: string }>();
  const locationId =
    (params?.locationId as string | undefined) ?? propLocationId ?? LOCATION_ID;

  const cartId = getCartId(locationId);

  const { mutate } = useLiveCart({ locationId, cartId: cartId! });

  const [busyId, setBusyId] = useState<string | null>(null);

  const { isLoading: providerBusy } = useCart();

  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (itemId: string) =>
    setImageErrors((prev) => ({ ...prev, [itemId]: true }));

  const handleAddToCart = async (
    e: React.MouseEvent,
    item: MenuItem
  ): Promise<void> => {
    e.stopPropagation();

    if (!locationId || !cartId) {
      toast.error("Cart is not ready. Please refresh.");
      return;
    }

    const defaultOptions: ItemOptions = {
      warming: "room-temp",
      packaging: "standard",
      giftBox: false,
    };

    try {
      setBusyId(item.id);

      const payload = {
        id: item.id,
        quantity: 1,
        specialInstructions: "",
        itemUnavailableAction: ItemUnavailableActions.REMOVE_ITEM,
        selectedModifiers: [],
      };

      await postData(
        `/api/v1/locations/${locationId}/carts/${cartId}/cart-item`,
        payload
      );

      await mutate();

      toast.success(`${item.name} added to cart`, { position: "top-center" });
    } catch (err) {
      toast.error(formatApiError(err).message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section
      ref={(el) => {
        if (sectionId && onSectionMount) onSectionMount(sectionId, el);
      }}
      className="flex flex-col items-start gap-4 sm:gap-6 lg:gap-8 relative w-full"
    >
      {/* Section header */}
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

      {/* Items */}
      <div className="flex flex-col items-start gap-4 sm:gap-5 lg:gap-6 relative w-full">
        {items.map((item) => {
          const isBusy = busyId === item.id || providerBusy;
          return (
            <div
              key={item.id}
              onClick={() => onItemClick?.(item.id)}
              className="flex items-start gap-3 sm:gap-4 lg:gap-6 relative w-full min-h-[100px] sm:min-h-[110px] lg:min-h-[120px]"
            >
              {/* Image */}
              <div className="relative w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] lg:w-[120px] lg:h-[120px] flex-shrink-0 overflow-hidden rounded-xl sm:rounded-xl lg:rounded-2xl bg-backgroundmuted">
                {imageErrors[item.id] ? (
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
                    src={
                      item.image || "/images/sushi/menu-items/sushi-plate.jpg"
                    }
                    alt={item.name}
                    fill
                    className="object-cover transition-opacity duration-300"
                    sizes="(max-width: 640px) 80px, (max-width: 768px) 100px, 120px"
                    loading="lazy"
                    onError={() => handleImageError(item.id)}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col items-start gap-2 sm:gap-2.5 lg:gap-3 relative flex-1 min-w-0">
                <div className="flex items-start justify-between relative self-stretch w-full">
                  <h3 className="relative flex-1 min-w-0 font-heading-h5 text-textdefault text-base sm:text-lg lg:text-[22px] tracking-[0.5px] sm:tracking-[0.75px] lg:tracking-[1px] leading-tight pr-2 sm:pr-3 lg:pr-4">
                    {item.name}
                  </h3>

                  <div className="flex items-center gap-2 sm:gap-2.5 lg:gap-3 flex-shrink-0">
                    <span className="relative font-heading-h5 text-textdefault text-base sm:text-lg lg:text-[22px] tracking-[0.5px] sm:tracking-[0.75px] lg:tracking-[1px] leading-tight whitespace-nowrap">
                      ${item.price.toFixed(2)}
                    </span>

                    {/* Add button -> posts to backend cart */}
                    <button
                      onClick={(e) => handleAddToCart(e, item)}
                      disabled={isBusy}
                      className="w-8 h-8 sm:w-9 sm:h-9 lg:w-8 lg:h-8 bg-backgroundprimary hover:bg-backgroundprimary/90 active:bg-backgroundprimary/80 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 touch-manipulation"
                      aria-label={`Add ${item.name} to cart`}
                    >
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5 lg:w-4 lg:h-4 text-textinverse" />
                    </button>
                  </div>
                </div>

                <p className="relative self-stretch font-text-small text-textmuted text-xs sm:text-sm lg:text-[14px] leading-relaxed line-clamp-2 sm:line-clamp-3">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";

import { useCart } from "@/hooks/useCart";
import { postData } from "@/lib/handle-api";
import { formatApiError } from "@/lib/format-api-error";
import { location_Id as LOCATION_ID } from "@/constants";
import type { MenuItem } from "../types";
import { ItemUnavailableActions } from "./product-description/ProductDescription";

interface MenuSectionProps {
  title: string;
  items: MenuItem[];
  sectionId?: string;
  onSectionMount?: (id: string, el: HTMLElement | null) => void;
  onItemClick?: (id: string) => void;
  locationId?: string;
}

const IMAGE_FALLBACK = "/images/sushi/menu-items/sushi-plate.jpg";

const TomodachiMenuSectionContent = ({
  title,
  items,
  sectionId,
  onSectionMount,
  onItemClick,
  locationId: propLocationId,
}: MenuSectionProps) => {
  const locationId = propLocationId ?? LOCATION_ID;
  const { cartId, mutate } = useCart({ locationId });

  const [busyId, setBusyId] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (itemId: string) =>
    setImageErrors((prev) => ({ ...prev, [itemId]: true }));

  const handleAddToCart = async (
    e: React.MouseEvent,
    item: MenuItem
  ): Promise<void> => {
    e.stopPropagation();

    if (!locationId || !cartId) {
      toast.error("Cart is not ready. Please try again in a moment.");
      return;
    }

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

  const cartUnavailable = !cartId;

  return (
    <section
      ref={(el) => {
        if (sectionId && onSectionMount) onSectionMount(sectionId, el);
      }}
      className="flex flex-col gap-5 sm:gap-7 lg:gap-9"
    >
      <div className="flex items-center justify-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2">
          <Separator className="h-px w-8 bg-borderdefault sm:w-12" />
          <span className="block h-2 w-2 rotate-45 border border-borderdefault" />
        </div>
        <h2 className="font-heading-h3 text-textdefault text-xl sm:text-2xl lg:text-[32px] tracking-[0.5px] sm:tracking-[0.75px] lg:tracking-[1px] leading-tight uppercase">
          {title}
        </h2>
        <div className="flex items-center gap-2">
          <span className="block h-2 w-2 rotate-45 border border-borderdefault" />
          <Separator className="h-px w-8 bg-borderdefault sm:w-12" />
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:gap-5">
        {items.map((item) => {
          const isBusy = busyId === item.id;
          const itemImage = imageErrors[item.id] ? IMAGE_FALLBACK : item.image || IMAGE_FALLBACK;

          return (
            <article
              key={item.id}
              onClick={() => onItemClick?.(item.id)}
              className="group relative flex flex-col rounded-2xl border border-borderdefault/60 bg-backgroundmuted/10 p-4 sm:p-5 transition hover:border-backgroundprimary/60 hover:bg-backgroundmuted/20"
            >
              <div className="flex items-start gap-4 sm:gap-5">
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-backgroundmuted sm:h-24 sm:w-24">
                  <Image
                    src={itemImage}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                    onError={() => handleImageError(item.id)}
                  />
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <h3 className="truncate font-heading-h5 text-lg text-textdefault sm:text-xl">
                        {item.name}
                      </h3>
                      {item?.subtitle && (
                        <p className="truncate text-xs uppercase tracking-[0.25em] text-textmuted/70">
                          {item.subtitle}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-shrink-0 items-center gap-2">
                      <span className="rounded-full bg-backgroundmuted px-3 py-1 text-sm font-semibold text-textdefault">
                        ${item.price.toFixed(2)}
                      </span>
                      <button
                        onClick={(e) => handleAddToCart(e, item)}
                        disabled={isBusy || cartUnavailable}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-backgroundprimary text-textinverse transition hover:bg-backgroundprimary/90 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label={
                          isBusy
                            ? `Adding ${item.name}`
                            : `Add ${item.name} to cart`
                        }
                        aria-busy={isBusy}
                      >
                        {isBusy ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {item.description && (
                    <p className="text-sm text-textmuted/90 sm:text-base line-clamp-3">
                      {item.description}
                    </p>
                  )}

                  {Array.isArray(item.badges) && item.badges.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {item.badges.map((badge) => (
                        <span
                          key={badge}
                          className="rounded-full border border-borderdefault px-2 py-0.5 text-xs uppercase tracking-wide text-textmuted"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export const TomodachiMenuSection = (props: MenuSectionProps) => {
  return (
    <Suspense fallback={<div>Loading menu section...</div>}>
      <TomodachiMenuSectionContent {...props} />
    </Suspense>
  );
};


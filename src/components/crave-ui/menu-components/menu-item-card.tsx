"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

import type { MenuItem } from "@/types/restaurant";
import { DEFAULT_MENU_ITEM, PLACEHOLDER_IMAGES } from "@/constants/defaults";
import { MENU_STYLES } from "@/constants/styles";
import { RatingDisplay, PriceDisplay, AddToCartButton } from "../../ui/common";
import { cn } from "@/lib/utils";

interface MenuItemCardProps extends Partial<MenuItem> {
  variant?: "horizontal" | "vertical";
  onClick?: () => void;
  onAddToCart?: () => void;
  className?: string;
}

export default function MenuItemCard({
  variant = "horizontal",
  name,
  description,
  price,
  rating,
  reviewCount,
  imageUrl,
  imageAlt,
  badge,
  onClick,
  onAddToCart,
  className,
}: MenuItemCardProps) {
  // Use appropriate defaults based on variant
  const defaults =
    variant === "horizontal"
      ? DEFAULT_MENU_ITEM.HORIZONTAL
      : DEFAULT_MENU_ITEM.VERTICAL;

  const itemName = name || defaults.name;
  const itemDescription = description || defaults.description;
  const itemPrice = price || defaults.price;
  const itemRating = rating || defaults.rating;
  const itemReviewCount = reviewCount || defaults.reviewCount;
  const itemImageUrl = imageUrl || defaults.imageUrl;
  const itemImageAlt = imageAlt || defaults.imageAlt;
  const itemBadge = badge || defaults.badge;

  if (variant === "vertical") {
    return (
      <Card
        className={cn(
          "w-52 overflow-hidden hover:shadow-lg transition-shadow duration-200 shadow-2xs",
          className
        )}
      >
        <div className="relative">
          {/* Image Container */}
          <div className="relative w-48 h-48 mx-auto mt-2">
            <Image
              src={itemImageUrl || PLACEHOLDER_IMAGES.MENU_ITEM}
              alt={itemImageAlt}
              fill
              className="object-cover rounded-md"
              sizes="160px"
              priority
            />
            {itemBadge && (
              <div className="absolute top-2 left-2">
                <Badge className="rounded-sm p-1 border-transparent bg-orange-100 dark:bg-orange-900 text-orange-900 dark:text-orange-200 hover:bg-orange-100 dark:hover:bg-orange-900">
                  {itemBadge}
                </Badge>
              </div>
            )}
            {/* Add to Cart Button */}
            {onAddToCart && (
              <div className="absolute bottom-2 right-3">
                <AddToCartButton
                  variant="icon"
                  onAddToCart={onAddToCart}
                  stopPropagation={true}
                  className="text-black bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
                />
              </div>
            )}
          </div>

          {/* Content Container */}
          <Button
            variant="ghost"
            className="w-full h-auto p-0 whitespace-normal text-left hover:bg-transparent focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            onClick={onClick}
            aria-label={`${itemName} ${itemPrice}`}
          >
            <div className="py-4 px-2 space-y-2 w-full">
              {/* Title and Badge */}
              <div className="space-y-2">
                <h3 className="font-bold text-xl leading-tight text-foreground text-left">
                  {itemName}
                </h3>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-0">
                <PriceDisplay
                  price={itemPrice}
                  className="text-base font-normal text-muted-foreground"
                />
              </div>
            </div>
          </Button>
        </div>
      </Card>
    );
  }

  // Horizontal variant (default)
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full h-auto p-0 text-left hover:bg-muted/50 rounded-lg bg-background border border-border whitespace-normal overflow-hidden",
        className
      )}
      onClick={onClick}
      aria-label={`${itemName} ${itemPrice}`}
    >
      <div className="flex w-full p-4 gap-4 items-start sm:flex-row flex-col">
        {/* Content Section */}
        <div className="flex flex-col justify-between flex-grow min-w-0 space-y-3">
          {/* Title and Badge */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg leading-tight text-foreground text-left">
              {itemName}
            </h3>
            {itemBadge && (
              <div className="flex">
                <Badge className="rounded-sm p-1 border-transparent bg-orange-100 dark:bg-orange-900 text-orange-900 dark:text-orange-200 hover:bg-orange-100 dark:hover:bg-orange-900">
                  {itemBadge}
                </Badge>
              </div>
            )}
          </div>

          {/* Description */}
          {itemDescription && (
            <p
              className="text-sm text-muted-foreground leading-relaxed text-left"
              style={{
                overflow: "hidden",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                lineClamp: 2,
              }}
            >
              {itemDescription}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center gap-4 pt-1">
            <PriceDisplay price={itemPrice} size="xl" />
            <RatingDisplay rating={itemRating} reviewCount={itemReviewCount} />
          </div>
        </div>

        {/* Image Section */}
        <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
          <Image
            src={itemImageUrl || PLACEHOLDER_IMAGES.MENU_ITEM}
            alt={itemImageAlt}
            fill
            className="object-cover"
            sizes="128px"
            priority
          />
        </div>
      </div>
    </Button>
  );
}

// Export variant components for backward compatibility
export function MenuItemCardHorizontal(
  props: Omit<MenuItemCardProps, "variant">
) {
  return <MenuItemCard {...props} variant="horizontal" />;
}

export function MenuItemCardVertical(
  props: Omit<MenuItemCardProps, "variant">
) {
  return <MenuItemCard {...props} variant="vertical" />;
}

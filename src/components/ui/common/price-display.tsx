"use client";

import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils/price";

interface PriceDisplayProps {
  price: string | number;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "xxl";
  variant?: "default" | "muted" | "accent";
  showCurrency?: boolean;
}

const sizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  xxl: "text-2xl",
};

const variantClasses = {
  default: "font-bold text-foreground",
  muted: "font-medium text-muted-foreground",
  accent: "font-bold text-primary",
};

export function PriceDisplay({
  price,
  className,
  size = "lg",
  variant = "default",
  showCurrency = true,
}: PriceDisplayProps) {
  const formattedPrice = typeof price === "string" ? price : formatPrice(price);

  return (
    <span className={cn(sizeClasses[size], variantClasses[variant], className)}>
      {showCurrency ? formattedPrice : formattedPrice.replace(/^\$/, "")}
    </span>
  );
}

export default PriceDisplay;

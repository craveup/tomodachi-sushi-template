"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus, Loader2 } from "lucide-react";

interface AddToCartButtonProps {
  onAddToCart: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "default" | "icon" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: React.ReactNode;
  stopPropagation?: boolean;
}

export function AddToCartButton({
  onAddToCart,
  disabled = false,
  loading = false,
  variant = "default",
  size = "md",
  className,
  children,
  stopPropagation = false,
}: AddToCartButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (stopPropagation) {
      e.stopPropagation();
    }
    onAddToCart();
  };
  if (variant === "icon") {
    return (
      <Button
        size="icon"
        variant="default"
        className={cn(
          "rounded-full shadow-lg hover:scale-110 transition-transform",
          size === "sm" && "w-8 h-8",
          size === "md" && "w-10 h-10",
          size === "lg" && "w-12 h-12",
          className
        )}
        onClick={handleClick}
        disabled={disabled || loading}
        aria-label="Add to cart"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Plus
            className={cn(
              size === "sm" && "h-3 w-3",
              size === "md" && "h-5 w-5",
              size === "lg" && "h-6 w-6"
            )}
          />
        )}
      </Button>
    );
  }

  return (
    <Button
      variant={variant === "outline" ? "outline" : "default"}
      size={size === "md" ? "default" : size}
      className={cn("w-full", className)}
      onClick={onAddToCart}
      disabled={disabled || loading}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children || "Add to Cart"}
    </Button>
  );
}

export default AddToCartButton;

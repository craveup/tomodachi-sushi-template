"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";

export interface QuantitySelectorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  showInput?: boolean;
  size?: "sm" | "default" | "lg";
  orientation?: "horizontal" | "vertical";
  showStock?: boolean;
  stockCount?: number;
  allowZero?: boolean;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  step = 1,
  disabled = false,
  showInput = true,
  size = "default",
  orientation = "horizontal",
  showStock = false,
  stockCount,
  allowZero = false,
  className,
  ...props
}: QuantitySelectorProps) {
  const effectiveMin = allowZero ? 0 : min;
  const effectiveMax =
    stockCount && showStock ? Math.min(max, stockCount) : max;

  const increment = () => {
    if (disabled || value >= effectiveMax) return;
    onChange(Math.min(value + step, effectiveMax));
  };

  const decrement = () => {
    if (disabled || value <= effectiveMin) return;
    onChange(Math.max(value - step, effectiveMin));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (isNaN(newValue)) return;

    if (newValue >= effectiveMin && newValue <= effectiveMax) {
      onChange(newValue);
    }
  };

  const sizeClasses = {
    sm: {
      button: "p-1.5",
      input: "w-8 text-sm py-1.5",
      icon: "w-3 h-3",
    },
    default: {
      button: "p-2",
      input: "w-12 py-2",
      icon: "w-4 h-4",
    },
    lg: {
      button: "p-3",
      input: "w-16 text-lg py-3",
      icon: "w-5 h-5",
    },
  };

  const sizes = sizeClasses[size];

  const containerClasses = cn(
    "inline-flex items-center border border-border rounded-lg",
    orientation === "vertical" && "flex-col",
    disabled && "opacity-50 cursor-not-allowed",
    className
  );

  const buttonClasses = cn(
    "hover:bg-gray-100 transition-colors",
    disabled && "cursor-not-allowed hover:bg-transparent",
    sizes.button
  );

  const isDecrementDisabled = disabled || value <= effectiveMin;
  const isIncrementDisabled = disabled || value >= effectiveMax;

  return (
    <div {...props}>
      <div className={containerClasses}>
        <button
          type="button"
          onClick={decrement}
          disabled={isDecrementDisabled}
          className={cn(
            buttonClasses,
            orientation === "horizontal" && "rounded-l-lg",
            orientation === "vertical" && "rounded-t-lg"
          )}
          aria-label="Decrease quantity"
        >
          <Minus className={sizes.icon} />
        </button>

        {showInput ? (
          <input
            type="text"
            value={value}
            onChange={handleInputChange}
            disabled={disabled}
            className={cn(
              "text-center focus:outline-none",
              orientation === "horizontal" && "border-x border-border",
              orientation === "vertical" && "border-y border-border",
              disabled && "cursor-not-allowed",
              sizes.input
            )}
            aria-label="Quantity"
          />
        ) : (
          <span
            className={cn(
              "text-center select-none",
              orientation === "horizontal" && "px-4",
              orientation === "vertical" && "py-4",
              sizes.input
            )}
          >
            {value}
          </span>
        )}

        <button
          type="button"
          onClick={increment}
          disabled={isIncrementDisabled}
          className={cn(
            buttonClasses,
            orientation === "horizontal" && "rounded-r-lg",
            orientation === "vertical" && "rounded-b-lg"
          )}
          aria-label="Increase quantity"
        >
          <Plus className={sizes.icon} />
        </button>
      </div>

      {showStock && stockCount !== undefined && stockCount <= 10 && (
        <p
          className={cn(
            "text-sm mt-2",
            stockCount <= 5 ? "text-orange-600" : "text-muted-foreground"
          )}
        >
          {stockCount === 0
            ? "Out of stock"
            : `Only ${stockCount} left in stock!`}
        </p>
      )}
    </div>
  );
}

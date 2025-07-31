"use client";

import * as React from "react";
import { Truck, MapPin, Clock, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

export interface OrderType {
  id: "delivery" | "pickup" | "dine-in";
  label: string;
  description: string;
  icon: React.ElementType;
  estimatedTime?: string;
  fee?: number;
  minOrder?: number;
  available?: boolean;
  unavailableReason?: string;
}

export interface OrderTypeToggleProps {
  value: string;
  onValueChange: (value: string) => void;
  types?: OrderType[];
  showDescription?: boolean;
  showEstimatedTime?: boolean;
  showFee?: boolean;
  disabled?: boolean;
  className?: string;
}

const defaultOrderTypes: OrderType[] = [
  {
    id: "delivery",
    label: "Delivery",
    description: "Get it delivered to your door",
    icon: Truck,
    estimatedTime: "25-35 min",
    fee: 3.99,
    minOrder: 15,
    available: true,
  },
  {
    id: "pickup",
    label: "Pickup",
    description: "Pick up at restaurant",
    icon: MapPin,
    estimatedTime: "15-20 min",
    fee: 0,
    available: true,
  },
  {
    id: "dine-in",
    label: "Dine In",
    description: "Reserve a table",
    icon: Clock,
    estimatedTime: "No wait",
    available: false,
    unavailableReason: "Reservations full today",
  },
];

export function OrderTypeToggle({
  value,
  onValueChange,
  types = defaultOrderTypes,
  showDescription = true,
  showEstimatedTime = true,
  showFee = true,
  disabled = false,
  className,
  ...props
}: OrderTypeToggleProps) {
  return (
    <div
      className={cn("grid gap-3", className)}
      role="radiogroup"
      aria-label="Order type"
      {...props}
    >
      {types.map((type) => {
        const Icon = type.icon;
        const isSelected = value === type.id;
        const isDisabled = disabled || !type.available;

        return (
          <button
            key={type.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-disabled={isDisabled}
            disabled={isDisabled}
            onClick={() => !isDisabled && onValueChange(type.id)}
            className={cn(
              "relative flex items-start gap-4 rounded-lg border p-4 text-left transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              isSelected && "border-primary bg-primary/5 shadow-sm",
              isDisabled && "cursor-not-allowed opacity-60",
              !isSelected &&
                !isDisabled &&
                "border-input hover:border-primary/50 hover:bg-accent/50 hover:shadow-sm",
              !isDisabled && "hover:scale-[1.01] transform"
            )}
          >
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-200",
                isSelected
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted",
                !isSelected && !isDisabled && "hover:bg-primary/10"
              )}
            >
              <Icon className="h-5 w-5" />
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className={cn("font-medium", isSelected && "text-primary")}>
                  {type.label}
                </h3>

                {showFee && type.fee !== undefined && (
                  <span
                    className={cn(
                      "text-sm font-medium",
                      type.fee === 0
                        ? "text-green-600"
                        : "text-muted-foreground"
                    )}
                  >
                    {type.fee === 0 ? "Free" : `$${type.fee.toFixed(2)}`}
                  </span>
                )}
              </div>

              {showDescription && (
                <p className="text-sm text-muted-foreground">
                  {type.description}
                </p>
              )}

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {showEstimatedTime && type.estimatedTime && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {type.estimatedTime}
                  </span>
                )}

                {type.minOrder && (
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    Min ${type.minOrder}
                  </span>
                )}
              </div>

              {type.unavailableReason && (
                <div className="flex items-center gap-2 mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded-md">
                  <div className="h-2 w-2 rounded-full bg-destructive flex-shrink-0 mt-0.5"></div>
                  <p className="text-xs text-red-800 font-medium">
                    {type.unavailableReason}
                  </p>
                </div>
              )}
            </div>

            {/* Radio indicator */}
            {/* <div
              className={cn(
                "absolute right-4 top-4 h-4 w-4 rounded-full border-2 transition-all duration-200",
                isSelected
                  ? "border-primary bg-primary scale-110"
                  : "border-input bg-background",
                !isSelected && !isDisabled && "hover:border-primary/50"
              )}
            >
              {isSelected && (
                <div className="absolute inset-0 m-auto h-1.5 w-1.5 rounded-full bg-primary-foreground" />
              )}
            </div> */}
          </button>
        );
      })}
    </div>
  );
}

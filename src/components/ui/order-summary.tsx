"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  CheckCircle2Icon,
  ClipboardCheckIcon,
  ClockIcon,
  TruckIcon,
} from "lucide-react";
import { Button } from "./button";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  modifiers?: {
    id: string;
    name: string;
    price: number;
  }[];
}

export interface OrderSummaryProps
  extends React.HTMLAttributes<HTMLDivElement> {
  orderNumber: string;
  date: string;
  status:
    | "placed"
    | "confirmed"
    | "preparing"
    | "ready"
    | "delivery"
    | "completed";
  items: OrderItem[];
  subtotal: number;
  tax: number;
  delivery?: number;
  tip?: number;
  total: number;
  estimatedDeliveryTime?: string;
  deliveryAddress?: string;
  paymentMethod: string;
}

export function OrderSummary({
  orderNumber,
  date,
  status,
  items,
  subtotal,
  tax,
  delivery,
  tip,
  total,
  estimatedDeliveryTime,
  deliveryAddress,
  paymentMethod,
  className,
  ...props
}: OrderSummaryProps) {
  const statusSteps = [
    {
      id: "placed",
      label: "Order Placed",
      icon: ClipboardCheckIcon,
      time: "Now",
      description: "We've received your order and it's being processed.",
    },
    {
      id: "confirmed",
      label: "Order Confirmed",
      icon: CheckCircle2Icon,
      time: "2-3 min",
      description:
        "Restaurant has confirmed your order and started preparation.",
    },
    {
      id: "preparing",
      label: "Preparing",
      icon: ClockIcon,
      time: "15-20 min",
      description: "Your delicious food is being prepared by our kitchen.",
    },
    {
      id: "ready",
      label: "Ready for Pickup/Delivery",
      icon: CheckCircle2Icon,
      time: "20-25 min",
      description: "Your order is ready and waiting for you.",
    },
    {
      id: "delivery",
      label: "Out for Delivery",
      icon: TruckIcon,
      time: "25-35 min",
      description: "Your order is on the way to your address.",
    },
    {
      id: "completed",
      label: "Completed",
      icon: CheckCircle2Icon,
      time: "Done",
      description: "Order successfully delivered. Enjoy your meal!",
    },
  ];

  const currentStepIndex = statusSteps.findIndex((step) => step.id === status);

  return (
    <div
      className={cn("rounded-lg border bg-background p-4 md:p-6", className)}
      {...props}
    >
      <div className="mb-6 flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row">
        <div>
          <h2 className="text-xl font-semibold">Order #{orderNumber}</h2>
          <p className="text-sm text-muted-foreground">
            Placed on {new Date(date).toLocaleDateString()} at{" "}
            {new Date(date).toLocaleTimeString()}
          </p>
          {estimatedDeliveryTime && (
            <p className="mt-2 text-sm">
              <span className="font-medium">Estimated arrival:</span>{" "}
              {estimatedDeliveryTime}
            </p>
          )}
        </div>
        <div className="text-right">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-2 text-xs font-medium text-primary">
            {statusSteps.find((step) => step.id === status)?.label}
          </span>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Order Progress</h3>
          <div className="flex items-center gap-2">
            <div className="h-2 bg-muted rounded-full w-32">
              <div
                className="h-2 bg-gradient-to-r from-primary to-green-500 dark:from-primary/80 dark:to-green-400 rounded-full transition-all duration-500"
                style={{
                  width: `${((currentStepIndex + 1) / statusSteps.length) * 100}%`,
                }}
              ></div>
            </div>
            <span className="text-sm font-medium text-foreground">
              {currentStepIndex + 1}/{statusSteps.length}
            </span>
          </div>
        </div>
        <ol className="relative">
          {statusSteps.map((step, index) => {
            const StepIcon = step.icon;
            const isCompleted = index < currentStepIndex;
            const isActive = index === currentStepIndex;
            const isPending = index > currentStepIndex;

            return (
              <li
                key={step.id}
                className={cn(
                  "flex pb-6 last:pb-0",
                  index !== statusSteps.length - 1 &&
                    "border-l-2 last:border-0",
                  isCompleted && "border-green-500 dark:border-green-400",
                  isActive && "border-primary dark:border-primary/70",
                  isPending &&
                    "border-muted-foreground/30 dark:border-muted-foreground/20"
                )}
              >
                <div
                  className={cn(
                    "absolute -left-4 h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                    isCompleted &&
                      "bg-green-100 dark:bg-green-900/50 border-green-500 dark:border-green-400 text-green-700 dark:text-green-500",
                    isActive &&
                      "bg-green-100 dark:bg-green-900/50 border-green-500 dark:border-green-400 text-green-700 dark:text-green-500",
                    isPending &&
                      "bg-muted border-muted-foreground/30 text-muted-foreground"
                  )}
                >
                  <StepIcon className="h-4 w-4" />
                </div>
                <div className="pl-6 flex-1 ml-2">
                  <div className="flex items-center justify-between mb-1">
                    <h4
                      className={cn(
                        "font-semibold",
                        isCompleted && "text-green-700 dark:text-green-300",
                        isActive && "text-primary dark:text-primary/90",
                        isPending && "text-muted-foreground"
                      )}
                    >
                      {step.label}
                    </h4>
                    <span
                      className={cn(
                        "text-xs font-medium px-2 py-1 rounded-full",
                        isCompleted &&
                          "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-500",
                        isActive &&
                          "bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary/90",
                        isPending && "bg-muted text-muted-foreground"
                      )}
                    >
                      {isCompleted ? "✓ Done" : step.time}
                    </span>
                  </div>
                  <p
                    className={cn(
                      "text-sm",
                      isCompleted && "text-green-600 dark:text-green-400",
                      isActive && "text-primary/80 dark:text-primary/70",
                      isPending && "text-muted-foreground/70"
                    )}
                  >
                    {step.description}
                  </p>
                  {isActive && (
                    <div className="mt-2 flex items-center gap-1">
                      <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium text-primary dark:text-primary/90">
                        In Progress
                      </span>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="mb-6">
        <h3 className="mb-4 text-base font-medium">Order Details</h3>
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-2 border-b pb-4 last:border-0"
            >
              <div className="flex-1">
                <div className="flex items-start">
                  <span className="mr-2 mt-1 rounded-full bg-muted px-1.5 text-xs">
                    {item.quantity}
                  </span>
                  <div>
                    <h4 className="font-semibold">{item.name}</h4>
                    {item.modifiers && item.modifiers.length > 0 && (
                      <ul className="mt-1 space-y-1">
                        {item.modifiers.map((mod) => (
                          <li
                            key={mod.id}
                            className="flex justify-between text-sm text-muted-foreground"
                          >
                            <span>{mod.name}</span>
                            <span>
                              {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                              }).format(mod.price)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="font-medium">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(item.price * item.quantity)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(subtotal)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Tax</span>
          <span>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(tax)}
          </span>
        </div>
        {delivery !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Delivery Fee</span>
            <span>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(delivery)}
            </span>
          </div>
        )}
        {tip !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Tip</span>
            <span>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(tip)}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between border-t pt-2 font-medium">
          <span>Total</span>
          <span>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(total)}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium">Payment Method</h3>
          <p className="text-sm text-muted-foreground">{paymentMethod}</p>
        </div>
        {deliveryAddress && (
          <div>
            <h3 className="text-sm font-medium">Delivery Address</h3>
            <p className="text-sm text-muted-foreground">{deliveryAddress}</p>
          </div>
        )}
        <div className="space-x-4">
          <Button variant="outline" size="sm">
            Download Receipt
          </Button>
          <Button variant="outline" size="sm">
            Help with Order
          </Button>
        </div>
      </div>
    </div>
  );
}

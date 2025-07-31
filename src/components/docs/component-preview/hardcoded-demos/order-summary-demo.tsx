"use client";

import * as React from "react";

export function OrderSummaryDemo() {
  const [orderStatus, setOrderStatus] = React.useState<
    "placed" | "confirmed" | "preparing" | "ready" | "delivery" | "completed"
  >("preparing");

  const statusSteps = [
    { id: "placed", label: "Order Placed", icon: "📋" },
    { id: "confirmed", label: "Order Confirmed", icon: "✅" },
    { id: "preparing", label: "Preparing", icon: "👨‍🍳" },
    { id: "ready", label: "Ready for Delivery", icon: "📦" },
    { id: "delivery", label: "Out for Delivery", icon: "🚚" },
    { id: "completed", label: "Completed", icon: "✅" },
  ];

  const currentStepIndex = statusSteps.findIndex((step) => step.id === orderStatus);

  return (
    <div className="bg-background px-4 pt-12 pb-3 flex items-center justify-between border-b border-border flex-shrink-0">
      <h2 className="text-lg font-medium text-foreground">Order Status</h2>
      <button className="text-muted-foreground hover:text-gray-700">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export const orderSummaryDemoCode = `import { OrderSummary } from "@/components/restaurant/order/order-summary"

export default function OrderSummaryDemo() {
  return (
    <OrderSummary
      orderNumber="ORD-2024-1234"
      date={new Date().toISOString()}
      status="preparing"
      items={[
        {
          id: "1",
          name: "Classic Burger",
          price: 12.99,
          quantity: 2,
          modifiers: [
            { id: "m1", name: "Extra Cheese", price: 1.50 },
            { id: "m2", name: "Bacon", price: 2.00 }
          ]
        },
        {
          id: "2",
          name: "Caesar Salad",
          price: 9.99,
          quantity: 1
        },
        {
          id: "3",
          name: "French Fries",
          price: 4.99,
          quantity: 2
        }
      ]}
      subtotal={40.96}
      tax={2.87}
      delivery={3.99}
      tip={6.00}
      total={53.82}
      estimatedDeliveryTime="30-45 minutes"
      deliveryAddress="123 Main Street, Apt 4B, New York, NY 10001"
      paymentMethod="Visa ending in 4242"
    />
  )
}`;
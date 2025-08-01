"use client";

import { Card } from "../card";
import { OrderSummary } from "../order-summary";

export default function OrderSummaryDemo() {
  const orderData = {
    orderNumber: "ORD-2024-001",
    date: "January 22, 2024",
    status: "confirmed" as const,
    estimatedDeliveryTime: "25-35 min",
    deliveryAddress: "123 Main St, Apt 4B, New York, NY 10001",
    paymentMethod: "•••• 4242",
    items: [
      {
        id: "1",
        name: "Karaage Chicken Katsu Sando",
        quantity: 1,
        price: 18.0,
        modifiers: [
          { id: "m1", name: "Medium Rare", price: 0 },
          { id: "m2", name: "Extra Cheese", price: 2.0 },
          { id: "m3", name: "No Pickles", price: 0 },
        ],
      },
      {
        id: "2",
        name: "Sweet Potato Fries",
        quantity: 1,
        price: 6.5,
      },
    ],
    subtotal: 24.5,
    tax: 2.21,
    delivery: 2.99,
    tip: 4.9,
    total: 34.6,
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <Card className="p-6">
        <OrderSummary
          orderNumber={orderData.orderNumber}
          date={orderData.date}
          status={orderData.status}
          estimatedDeliveryTime={orderData.estimatedDeliveryTime}
          deliveryAddress={orderData.deliveryAddress}
          paymentMethod={orderData.paymentMethod}
          items={orderData.items}
          subtotal={orderData.subtotal}
          tax={orderData.tax}
          delivery={orderData.delivery}
          tip={orderData.tip}
          total={orderData.total}
        />
      </Card>
    </div>
  );
}

"use client";

import * as React from "react";

export function CheckoutFormDemo() {
  const [orderType, setOrderType] = React.useState<"delivery" | "pickup">(
    "delivery"
  );
  const [selectedTip, setSelectedTip] = React.useState("15");

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-6">
      <div className="bg-background rounded-lg shadow-sm border border-border p-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-semibold">Checkout</h2>
          <p className="text-muted-foreground mt-1">Complete your order</p>
        </div>

        {/* Order Type Toggle */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Order Type</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setOrderType("delivery")}
              className={`p-3 rounded-lg border-2 transition-colors ${
                orderType === "delivery"
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-muted-foreground/20"
              }`}
            >
              <div className="font-medium">🚚 Delivery</div>
              <div className="text-sm text-muted-foreground">30-45 min</div>
            </button>
            <button
              onClick={() => setOrderType("pickup")}
              className={`p-3 rounded-lg border-2 transition-colors ${
                orderType === "pickup"
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-muted-foreground/20"
              }`}
            >
              <div className="font-medium">🏃 Pickup</div>
              <div className="text-sm text-muted-foreground">15-20 min</div>
            </button>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="font-medium">Contact Information</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Name"
              className="w-full px-3 py-2 text-gray-600 dark:text-gray-300 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
              defaultValue="John Doe"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 text-gray-600 dark:text-gray-300 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
              defaultValue="john@example.com"
            />
            <input
              type="tel"
              placeholder="Phone"
              className="w-full px-3 py-2 text-gray-600 dark:text-gray-300 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
              defaultValue="(555) 123-4567"
            />
          </div>
        </div>

        {/* Delivery Address */}
        {orderType === "delivery" && (
          <div className="space-y-4">
            <h3 className="font-medium">Delivery Address</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Street Address"
                className="w-full px-3 py-2 text-gray-600 dark:text-gray-300 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                defaultValue="123 Main Street"
              />
              <input
                type="text"
                placeholder="Apt, Suite, etc."
                className="w-full px-3 py-2 text-gray-600 dark:text-gray-300 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                defaultValue="Apt 4B"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="City"
                  className="w-full px-3 py-2 text-gray-600 dark:text-gray-300 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                  defaultValue="New York"
                />
                <input
                  type="text"
                  placeholder="ZIP Code"
                  className="w-full px-3 py-2 text-gray-600 dark:text-gray-300 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                  defaultValue="10001"
                />
              </div>
            </div>
          </div>
        )}

        {/* Payment Method */}
        <div className="space-y-4">
          <h3 className="font-medium">Payment Method</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-3 p-3 border border-input rounded-lg cursor-pointer hover:bg-accent">
              <input
                type="radio"
                name="payment"
                defaultChecked
                className="accent-primary"
              />
              <span>💳 Credit Card ending in 4242</span>
            </label>
            <label className="flex items-center space-x-3 p-3 border border-input rounded-lg cursor-pointer hover:bg-accent">
              <input type="radio" name="payment" className="accent-primary" />
              <span>
                💵 Cash on {orderType === "delivery" ? "Delivery" : "Pickup"}
              </span>
            </label>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>$45.96</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>$3.68</span>
          </div>
          {orderType === "delivery" && (
            <div className="flex justify-between text-sm">
              <span>Delivery Fee</span>
              <span>$3.99</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span>Tip</span>
            <select
              value={selectedTip}
              onChange={(e) => setSelectedTip(e.target.value)}
              className="text-right bg-transparent focus:outline-none text-foreground"
            >
              <option value="10">$5.35 (10%)</option>
              <option value="15">$8.03 (15%)</option>
              <option value="20">$10.71 (20%)</option>
              <option value="0">No tip</option>
            </select>
          </div>
          <div className="flex justify-between font-semibold pt-3 border-t">
            <span>Total</span>
            <span>${orderType === "delivery" ? "61.66" : "57.67"}</span>
          </div>
        </div>

        {/* Place Order Button */}
        <button className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium">
          Place Order
        </button>
      </div>
    </div>
  );
}

export const checkoutFormDemoCode = `import { CheckoutForm } from "@/components/restaurant/checkout/checkout-form"

export default function CheckoutFormDemo() {
  return (
    <CheckoutForm
      orderType="delivery"
      subtotal={45.96}
      tax={3.68}
      deliveryFee={3.99}
      onSubmit={(data) => console.log('Order submitted:', data)}
    />
  )
}`;

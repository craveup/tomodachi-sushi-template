"use client";

import { CheckoutPage } from "@/components/crave-ui/checkout-components";
import { IPhoneMockup } from "@/components/docs/component-preview/components/device-mockups/iphone";

export default function CheckoutPageDemo() {
  const handleBackToStore = () => {
    console.log("Back to store clicked");
  };

  const handlePlaceOrder = (orderData: any) => {
    console.log("Order placed:", orderData);
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <IPhoneMockup variant="pro" color="black">
        <div className="h-full flex flex-col relative bg-muted/50">
          {/* Status Bar */}
          <div className="flex justify-between items-center px-6 py-3 bg-background">
            <span className="text-sm font-semibold text-black dark:text-white">
              9:41
            </span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-2 border border-black dark:border-white rounded-sm">
                <div className="w-3 h-1 bg-foreground rounded-sm m-0.5" />
              </div>
            </div>
          </div>

          {/* Checkout Page Content */}
          <div className="flex-1 overflow-hidden">
            <CheckoutPage
              onBackToStore={handleBackToStore}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>
        </div>
      </IPhoneMockup>
    </div>
  );
}

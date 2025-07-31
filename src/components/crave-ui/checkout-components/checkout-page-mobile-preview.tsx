"use client";

import { IPhoneMockup } from "@/components/docs/component-preview/components";
import CheckoutPage from "./checkout-page";

interface CheckoutPageMobilePreviewProps {
  onBackToStore?: () => void;
  onPlaceOrder?: (orderData: any) => void;
}

export default function CheckoutPageMobilePreview({
  onBackToStore,
  onPlaceOrder,
}: CheckoutPageMobilePreviewProps) {
  return (
    <IPhoneMockup variant="pro" color="black">
      <div className="h-full flex flex-col relative bg-muted/50">
        {/* Status Bar */}
        <div className="flex justify-between items-center px-6 py-3 bg-background">
          <span className="text-sm font-semibold">9:41</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-2 border border-black rounded-sm">
              <div className="w-3 h-1 bg-black rounded-sm m-0.5" />
            </div>
          </div>
        </div>

        {/* Checkout Page Content */}
        <div className="flex-1 overflow-hidden">
          <CheckoutPage
            onBackToStore={onBackToStore}
            onPlaceOrder={onPlaceOrder}
          />
        </div>
      </div>
    </IPhoneMockup>
  );
}

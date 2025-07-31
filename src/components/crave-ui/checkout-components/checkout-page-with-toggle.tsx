"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Monitor, Smartphone } from "lucide-react";
import CheckoutPage from "./checkout-page";
import CheckoutPageDesktop from "./checkout-page-desktop";
import { IPhoneMockup } from "@/components/docs/component-preview/components";

interface CheckoutPageWithToggleProps {
  onBackToStore?: () => void;
  onPlaceOrder?: (orderData: any) => void;
}

export default function CheckoutPageWithToggle({
  onBackToStore,
  onPlaceOrder,
}: CheckoutPageWithToggleProps) {
  const [viewMode, setViewMode] = useState<"mobile" | "desktop">("mobile");

  return (
    <div className="space-y-6">
      {/* Toggle Controls */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2 bg-background rounded-lg p-1 shadow-sm border">
          <Button
            variant={viewMode === "mobile" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("mobile")}
            className="flex items-center gap-2"
          >
            <Smartphone className="w-4 h-4" />
            Mobile
          </Button>
          <Button
            variant={viewMode === "desktop" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("desktop")}
            className="flex items-center gap-2"
          >
            <Monitor className="w-4 h-4" />
            Desktop
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex justify-center">
        {viewMode === "mobile" ? (
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
        ) : (
          <div className="w-full max-w-6xl">
            <CheckoutPageDesktop
              onBackToStore={onBackToStore}
              onPlaceOrder={onPlaceOrder}
            />
          </div>
        )}
      </div>
    </div>
  );
}

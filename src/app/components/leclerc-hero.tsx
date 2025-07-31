"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";
import { useAddress } from "../providers/address-provider";
import { useThemeClasses } from "../hooks/use-restaurant-theme";
import { AddressFlow, DeliveryOption } from "./address-flow";

export function LeclercHero() {
  const [isAddressFlowOpen, setIsAddressFlowOpen] = useState(false);
  const { setDeliveryData, getDisplayAddress } = useAddress();
  const { getThemeClass } = useThemeClasses();

  const handleAddressFlowComplete = (data: {
    deliveryOption: DeliveryOption;
    address?: { street: string; apartment?: string };
  }) => {
    setDeliveryData(data);
    setIsAddressFlowOpen(false);
  };

  return (
    <section className="relative h-[500px] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=1600&h=800&fit=crop')`,
        }}
      />
      <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />

      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-xl text-white dark:text-white">
          <h2 className="font-leclerc-display text-5xl font-semibold mb-4 tracking-tight leading-tight">
            World Famous
            <br />
            6oz Cookies
          </h2>
          <p className="font-leclerc-support text-xl mb-8 text-white/80 dark:text-white/80 leading-relaxed tracking-wide">
            Crispy on the outside, gooey on the inside. Made fresh daily in
            small batches.
          </p>
          <div className="flex gap-4">
            <Button
              size="lg"
              onClick={() => setIsAddressFlowOpen(true)}
              className={`${getThemeClass("hero-cta")} bg-[hsl(var(--brand-accent))] text-white dark:text-white hover:bg-[hsl(var(--brand-accent))]/90 transition-all duration-200`}
            >
              <MapPin className="mr-2 h-4 w-4" />
              Start Order
            </Button>
            <Link href="/examples/leclerc-bakery/menu">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent text-white border-white hover:bg-white hover:text-black"
              >
                View Menu
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Floating badges */}
      <div className="absolute bottom-8 right-8 flex gap-4">
        <div className="bg-background border rounded-full px-4 py-2 shadow-lg">
          <span className="text-sm font-medium">🔥 Fresh Daily</span>
        </div>
        <div className="bg-background border rounded-full px-4 py-2 shadow-lg">
          <span className="text-sm font-medium">📦 Nationwide Shipping</span>
        </div>
      </div>

      {/* Address Flow Modal */}
      <AddressFlow
        isOpen={isAddressFlowOpen}
        onClose={() => setIsAddressFlowOpen(false)}
        onComplete={handleAddressFlowComplete}
      />
    </section>
  );
}

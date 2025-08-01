"use client";

import RestaurantHeader from "@/components/crave-ui/layout-components/restaurant-header";
import { useState } from "react";

export default function RestaurantHeaderDemo() {
  const [searchValue, setSearchValue] = useState("");
  const [cartCount, setCartCount] = useState(3);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="w-full bg-background overflow-hidden">
      {/* Mobile-optimized wrapper for preview - force mobile breakpoint styles */}
      <div className="max-w-[320px] mx-auto" style={{ zoom: 0.75 }}>
        {/* Wrapper to force mobile styles */}
        <div className="[&_.xl\\:block]:!hidden [&_.lg\\:hidden]:!block [&_.md\\:flex]:!hidden [&_.md\\:inline]:!hidden">
          {/* Restaurant Header with responsive design */}
          <RestaurantHeader
            storeName="Sakura & Stone"
            logoUrl="/images/logos/sakura-stone-logo.png"
            currentAddress="123 Main St, LA"
            cartItemCount={cartCount}
            hasNotifications={notifications}
            searchValue={searchValue}
            onSearchChange={(value) => {
              setSearchValue(value);
              console.log("Search:", value);
            }}
            onSearchSubmit={(value) => console.log("Search submitted:", value)}
            onAddressClick={() => console.log("Address clicked")}
            onCartClick={() => {
              console.log("Cart clicked");
              // Demo: Update cart count
              setCartCount(cartCount + 1);
            }}
            onSignIn={() => console.log("Sign In clicked")}
            onSignUp={() => console.log("Sign Up clicked")}
            onMenuClick={() => console.log("Menu clicked")}
            onNotificationClick={() => {
              console.log("Notification clicked");
              // Demo: Toggle notifications
              setNotifications(!notifications);
            }}
            onLogoClick={() => console.log("Logo clicked")}
          />
        </div>
      </div>

      {/* Demo Content - Also scaled for consistency */}
      <div
        className="max-w-[320px] mx-auto p-4 space-y-3"
        style={{ zoom: 0.75 }}
      >
        <div className="text-center">
          <h2 className="text-lg font-bold">Mobile Restaurant Header</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Optimized for preview display
          </p>
        </div>

        {/* Interactive Controls */}
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setCartCount(cartCount + 1)}
            className="px-2 py-1.5 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
          >
            Add to Cart ({cartCount})
          </button>
          <button
            onClick={() => setNotifications(!notifications)}
            className="px-2 py-1.5 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700 transition-colors"
          >
            Toggle Notifications
          </button>
          <button
            onClick={() => setSearchValue(searchValue ? "" : "sushi")}
            className="px-2 py-1.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
          >
            {searchValue ? "Clear" : "Fill"} Search
          </button>
        </div>
      </div>
    </div>
  );
}

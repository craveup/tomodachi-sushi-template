"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";

interface RestaurantHeaderProps {
  storeName?: string;
  logoUrl?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: (value: string) => void;
  currentAddress?: string;
  onAddressClick?: () => void;
  cartItemCount?: number;
  onCartClick?: () => void;
  onSignIn?: () => void;
  onSignUp?: () => void;
  onMenuClick?: () => void;
  hasNotifications?: boolean;
  onNotificationClick?: () => void;
  onLogoClick?: () => void;
}

export default function RestaurantHeader({
  storeName = "Sakura & Stone",
  logoUrl = "/images/logos/sakura-stone-logo.png",
  searchValue = "",
  onSearchChange,
  onSearchSubmit,
  currentAddress = "123 Main Street, Los Angeles, CA",
  onAddressClick,
  cartItemCount = 3,
  onCartClick,
  onSignIn,
  onSignUp,
  onMenuClick,
  hasNotifications = true,
  onNotificationClick,
  onLogoClick,
}: RestaurantHeaderProps) {
  const [searchInput, setSearchInput] = useState(searchValue);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    onSearchChange?.(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit?.(searchInput);
  };

  return (
    <header className="bg-background border-b w-full" data-testid="Header">
      <div className="flex items-center justify-between px-4 py-4 max-w-7xl mx-auto">
        {/* Left Section - Logo & Brand Name */}
        <button
          className="flex items-center cursor-pointer gap-2"
          onClick={onLogoClick}
          aria-label={`${storeName} Home Page`}
          data-testid="HomeLogo"
        >
          <Image
            src={logoUrl}
            alt={storeName}
            width={32}
            height={32}
            className="h-8 w-8 object-contain rounded"
            priority
          />
          <span className="hidden sm:block text-lg font-semibold">
            {storeName}
          </span>
        </button>

        {/* Right Section - Sign In & Cart */}
        <div className="flex items-center gap-1">
          {/* Sign In (always shown) */}
          <button
            onClick={onSignIn}
            className="text-sm font-bold transition-colors"
          >
            Sign in
          </button>

          {/* Sign Up & Cart - Only visible on tablet and larger */}
          <div className="hidden sm:block items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={onSignUp}
                className="text-sm font-bold transition-colors"
              >
                <span className="font-bold mr-1">/</span>
                Sign Up
              </button>
              <Button
                variant="default"
                onClick={onCartClick}
                className="flex items-center gap-2 px-4 py-4 h-9 rounded-none font-medium"
                aria-label={`${cartItemCount} items in cart`}
                data-testid="OrderCartIconButton"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span>{cartItemCount > 9 ? "9+" : cartItemCount}</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Visually Hidden Page Title for Accessibility */}
      <h1 data-testid="pageHeader" className="sr-only">
        {storeName}
      </h1>
    </header>
  );
}

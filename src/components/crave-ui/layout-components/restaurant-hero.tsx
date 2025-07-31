"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

interface RestaurantHeroProps {
  restaurantName?: string;
  heroImageUrl?: string;
  address?: string;
  operatingHours?: string;
  pickupTime?: string;
  onChangeLocation?: () => void;
  onDeliveryClick?: () => void;
  onPickupClick?: () => void;
  className?: string;
}

export default function RestaurantHero({
  restaurantName = "Kee Wah Bakery",
  heroImageUrl = "/images/leclerc-bakery/menu/fruit-danish.webp",
  address = "227 N Larchmont Blvd, Los Angeles, CA 90004, USA",
  operatingHours = "Online ordering hours: 7:00 AM - 10:15 PM",
  pickupTime = "12 min",
  onChangeLocation,
  onDeliveryClick,
  onPickupClick,
  className = "",
}: RestaurantHeroProps) {
  return (
    <div className={`w-full bg-background ${className}`}>
      {/* Hero Image Section */}
      <div className="relative w-full h-60 sm:h-64 md:h-74 lg:h-[320px] xl:h-[440px] overflow-hidden">
        <Image
          src={heroImageUrl || "/placeholder.svg"}
          alt={`${restaurantName} hero image`}
          fill
          className="object-cover p-2"
          sizes="100vw"
          priority
        />
      </div>

      {/* Restaurant Information Section */}
      <div className="px-2 py-6 space-y-6">
        {/* Restaurant Name */}
        <h1 className="w-full text-3xl text-center sm:text-left md:text-4xl font-bold">
          {restaurantName}
        </h1>

        {/* Address and Change Location */}
        <div className="space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <div className="flex-1">
              <span className="text-base font-medium">{address}</span>
              {onChangeLocation && (
                <>
                  <span className="mx-2">•</span>
                  <button
                    onClick={onChangeLocation}
                    className="text-base font-bold underline hover:text-gray-700"
                  >
                    Change Location
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Operating Hours */}
          <div className="text-sm sm:text-base font-medium text-gray-700">
            {operatingHours}
          </div>
        </div>
        {/* Delivery and Pickup Options */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          {/* Pickup Time Display */}
          <div className="w-full sm:w-auto text-center border px-10 lg:px-40 py-2 rounded-md">
            <div className="text-2xl font-bold text-gray-900">{pickupTime}</div>
            <div className="text-sm text-gray-600">ready for pickup</div>
          </div>

          {/* Delivery/Pickup Toggle Buttons */}
          <div className="flex w-full sm:w-auto bg-background rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onDeliveryClick}
              className="px-4 py-2 text-sm font-bold text-gray-700 bg-gray-200 dark:bg-gray-800 hover:shadow-sm rounded-none transition-all"
            >
              Delivery
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={onPickupClick}
              className="px-4 py-2 text-sm font-bold bg-green-500 text-white rounded-none transition-all"
            >
              Pickup
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

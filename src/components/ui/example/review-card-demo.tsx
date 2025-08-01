"use client";

import ReviewCard from "@/components/crave-ui/review-components/review-card";

export default function ReviewCardDemo() {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Review Card</h2>
        <p className="text-muted-foreground">
          Simple review card component with user info, ratings, and comments.
        </p>
      </div>

      <div className="space-y-6">
        {/* Default Example */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Default Review</h3>
          <div className="p-6 border border-border rounded-lg bg-background">
            <ReviewCard />
          </div>
        </div>

        {/* Custom Example */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Custom Review</h3>
          <div className="p-6 border border-border rounded-lg bg-background">
            <ReviewCard
              userName="Sarah M"
              userInitial="S"
              userColor="#10B981"
              rating={4}
              date="3/22/24"
              orderType="Pickup order"
              comment="Great food and fast service! The karaage chicken was crispy and delicious."
            />
          </div>
        </div>

        {/* Review with Highlighted Items */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">
            Review with Highlighted Items
          </h3>
          <div className="p-6 border border-border rounded-lg bg-background">
            <ReviewCard
              userName="Mike Chen"
              userInitial="M"
              userColor="#3B82F6"
              rating={5}
              date="3/20/24"
              orderType="Delivery order"
              comment="The ramen was absolutely amazing! Also loved the gyoza and miso soup."
              highlightedItems={["ramen", "gyoza", "miso soup"]}
            />
          </div>
        </div>

        {/* Lower Rating Example */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Lower Rating Review</h3>
          <div className="p-6 border border-border rounded-lg bg-background">
            <ReviewCard
              userName="Alex T"
              userInitial="A"
              userColor="#EF4444"
              rating={2}
              date="3/18/24"
              orderType="DoorDash order"
              comment="Food was cold when it arrived and took much longer than expected."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

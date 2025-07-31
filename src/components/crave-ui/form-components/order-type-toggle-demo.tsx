"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Zap, Car, Calendar } from "lucide-react";
import { OrderTypeToggle } from "../checkout-components/order-type-toggle";

export default function OrderTypeToggleDemo() {
  const [selectedType, setSelectedType] = useState("delivery");

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Select Order Type</h3>
        <OrderTypeToggle value={selectedType} onValueChange={setSelectedType} />
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Compact Version</h3>
        <OrderTypeToggle
          value={selectedType}
          onValueChange={setSelectedType}
          showDescription={false}
          showEstimatedTime={false}
        />
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Custom Order Types</h3>
        <OrderTypeToggle
          value={selectedType}
          onValueChange={setSelectedType}
          types={[
            {
              id: "delivery",
              label: "Express Delivery",
              description: "Get it fast with priority delivery",
              icon: Zap,
              estimatedTime: "15-20 min",
              fee: 5.99,
              minOrder: 20,
              available: true,
            },
            {
              id: "pickup",
              label: "Curbside Pickup",
              description: "We'll bring it to your car",
              icon: Car,
              estimatedTime: "10-15 min",
              fee: 0,
              available: true,
            },
            {
              id: "scheduled",
              label: "Schedule Later",
              description: "Choose a specific time",
              icon: Calendar,
              estimatedTime: "Scheduled",
              fee: 2.99,
              available: true,
            },
          ]}
        />
      </Card>

      <div className="text-center p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          Selected:{" "}
          <span className="font-medium text-foreground">{selectedType}</span>
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TimeSlotPicker, type TimeSlot } from "@/components/ui/time-slot-picker";

export default function TimeSlotPickerDemo() {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [orderType, setOrderType] = useState<"pickup" | "delivery">("delivery");

  const timeSlots = [
    { id: "1", time: "10:00", label: "10:00 AM", available: true },
    { id: "2", time: "10:30", label: "10:30 AM", available: true },
    { id: "3", time: "11:00", label: "11:00 AM", available: false },
    { id: "4", time: "11:30", label: "11:30 AM", available: true },
    { id: "5", time: "12:00", label: "12:00 PM", available: true },
    { id: "6", time: "12:30", label: "12:30 PM", available: false },
    { id: "7", time: "13:00", label: "1:00 PM", available: true },
    { id: "8", time: "13:30", label: "1:30 PM", available: true },
  ];

  return (
    <div className="w-full max-w-lg mx-auto space-y-4">
      <div className="flex gap-2">
        <Button
          variant={orderType === "delivery" ? "default" : "outline"}
          onClick={() => setOrderType("delivery")}
          size="sm"
        >
          Delivery
        </Button>
        <Button
          variant={orderType === "pickup" ? "default" : "outline"}
          onClick={() => setOrderType("pickup")}
          size="sm"
        >
          Pickup
        </Button>
      </div>

      <Card className="p-6">
        <TimeSlotPicker
          slots={timeSlots}
          selectedSlot={selectedSlot}
          onSlotSelect={setSelectedSlot}
          orderType={orderType}
          showAsap={true}
        />
      </Card>

      {selectedSlot && (
        <div className="p-4 border rounded-lg bg-muted/50">
          <p className="text-sm font-medium">Selected Time:</p>
          <p className="text-sm text-muted-foreground">
            {selectedSlot.label} for {orderType}
          </p>
        </div>
      )}
    </div>
  );
}

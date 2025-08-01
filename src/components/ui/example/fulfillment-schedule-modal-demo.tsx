"use client";

import { useState } from "react";
import { Button } from "../button";
import { Card } from "../card";
import { Calendar, Clock, Truck, ShoppingBag } from "lucide-react";
import FulfillmentScheduleModal from "@/components/crave-ui/modal-components/fulfillment-schedule-modal";

export default function FulfillmentScheduleModalDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [fulfillmentType, setFulfillmentType] = useState<"pickup" | "delivery">(
    "delivery"
  );
  const [scheduledData, setScheduledData] = useState<{
    date: string;
    timeSlot: string;
  } | null>(null);

  const handleSchedule = (data: { date: string; timeSlot: string }) => {
    setScheduledData(data);
    setIsOpen(false);
  };

  const handleOpenSchedule = (type: "pickup" | "delivery") => {
    setFulfillmentType(type);
    setIsOpen(true);
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-4">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">Schedule Your Order</h3>
            <p className="text-sm text-muted-foreground">
              Choose pickup or delivery and select your preferred time
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => handleOpenSchedule("delivery")}
              className="flex-1 h-auto p-4"
              variant="outline"
            >
              <div className="flex flex-col items-center gap-2">
                <Truck className="w-5 h-5" />
                <span className="text-sm">Schedule Delivery</span>
              </div>
            </Button>

            <Button
              onClick={() => handleOpenSchedule("pickup")}
              className="flex-1 h-auto p-4"
              variant="outline"
            >
              <div className="flex flex-col items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                <span className="text-sm">Schedule Pickup</span>
              </div>
            </Button>
          </div>
        </div>
      </Card>

      {scheduledData && (
        <Card className="p-4 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              {fulfillmentType === "delivery" ? (
                <Truck className="w-4 h-4 text-green-600 dark:text-green-400" />
              ) : (
                <ShoppingBag className="w-4 h-4 text-green-600 dark:text-green-400" />
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-green-800 dark:text-green-200 mb-1">
                {fulfillmentType === "delivery" ? "Delivery" : "Pickup"}{" "}
                Scheduled
              </h4>
              <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  <span>{scheduledData.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  <span>{scheduledData.timeSlot}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      <FulfillmentScheduleModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSchedule={handleSchedule}
        fulfillmentType={fulfillmentType}
      />
    </div>
  );
}

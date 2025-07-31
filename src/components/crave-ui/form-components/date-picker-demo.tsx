"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";

export default function DatePickerDemo() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [restrictedDate, setRestrictedDate] = useState<Date | null>(null);
  const [availabilityDate, setAvailabilityDate] = useState<Date | null>(null);

  // Set min/max dates for restricted example
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 30); // 30 days from now

  // Blackout dates (e.g., holidays)
  const blackoutDates = [
    new Date("2024-12-25"), // Christmas
    new Date("2024-01-01"), // New Year's Day
  ];

  // Custom availability check (no Sundays)
  const isDateAvailable = (date: Date) => {
    return date.getDay() !== 0; // Sunday = 0
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Basic Date Picker */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Basic Date Picker</h3>
            <p className="text-sm text-muted-foreground">
              Simple date selection with no restrictions
            </p>
          </div>
          <DatePicker
            value={selectedDate}
            onChange={setSelectedDate}
            placeholder="Select any date"
          />
          {selectedDate && (
            <p className="text-sm text-muted-foreground">
              Selected: {selectedDate.toLocaleDateString()}
            </p>
          )}
        </div>
      </Card>

      {/* Date Picker with Restrictions */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">With Date Restrictions</h3>
            <p className="text-sm text-muted-foreground">
              Only allows dates from today to 30 days ahead, excluding holidays
            </p>
          </div>
          <DatePicker
            value={restrictedDate}
            onChange={setRestrictedDate}
            minDate={today}
            maxDate={maxDate}
            blackoutDates={blackoutDates}
            placeholder="Select delivery date"
          />
          {restrictedDate && (
            <p className="text-sm text-muted-foreground">
              Delivery date: {restrictedDate.toLocaleDateString()}
            </p>
          )}
        </div>
      </Card>

      {/* Date Picker with Custom Availability */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Custom Availability</h3>
            <p className="text-sm text-muted-foreground">
              No delivery on Sundays - custom availability function
            </p>
          </div>
          <DatePicker
            value={availabilityDate}
            onChange={setAvailabilityDate}
            isDateAvailable={isDateAvailable}
            minDate={today}
            placeholder="Select weekday only"
          />
          {availabilityDate && (
            <p className="text-sm text-muted-foreground">
              Pickup date: {availabilityDate.toLocaleDateString()}(
              {availabilityDate.toLocaleDateString("en-US", {
                weekday: "long",
              })}
              )
            </p>
          )}
        </div>
      </Card>

      {/* Demo State Display */}
      <Card className="p-4 bg-muted/50">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Demo State</h4>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>
              Basic:{" "}
              {selectedDate ? selectedDate.toISOString().split("T")[0] : "null"}
            </div>
            <div>
              Restricted:{" "}
              {restrictedDate
                ? restrictedDate.toISOString().split("T")[0]
                : "null"}
            </div>
            <div>
              Custom:{" "}
              {availabilityDate
                ? availabilityDate.toISOString().split("T")[0]
                : "null"}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

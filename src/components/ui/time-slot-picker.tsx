"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

export interface TimeSlot {
  id: string;
  label: string;
  time: string;
  available: boolean;
  date?: string;
  estimatedTime?: string;
}

export interface TimeSlotPickerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  slots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  onSlotSelect: (slot: TimeSlot) => void;
  orderType?: "pickup" | "delivery";
  showAsap?: boolean;
  dateRange?: number;
  timeFormat?: "12h" | "24h";
  showDateTabs?: boolean;
  currentDate?: Date;
  onDateChange?: (date: Date) => void;
}

export function TimeSlotPicker({
  slots,
  selectedSlot,
  onSlotSelect,
  orderType = "delivery",
  showAsap = true,
  dateRange = 7,
  timeFormat = "12h",
  showDateTabs = true,
  currentDate = new Date(),
  onDateChange,
  className,
  ...props
}: TimeSlotPickerProps) {
  const [selectedDate, setSelectedDate] = React.useState(currentDate);

  // Generate date tabs
  const dates = React.useMemo(() => {
    const result = [];
    for (let i = 0; i < dateRange; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      result.push(date);
    }
    return result;
  }, [dateRange]);

  // Filter slots by selected date
  const filteredSlots = React.useMemo(() => {
    const dateStr = selectedDate.toDateString();
    return slots.filter((slot) => {
      if (!slot.date) return true;
      return new Date(slot.date).toDateString() === dateStr;
    });
  }, [slots, selectedDate]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    onDateChange?.(date);
  };

  const formatTime = (time: string) => {
    if (timeFormat === "24h") return time;

    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString();
  };

  const formatDateTab = (date: Date) => {
    if (isToday(date)) return "Today";

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  return (
    <div className={cn("w-full space-y-4", className)} {...props}>
      {/* Date Selection Tabs */}
      {showDateTabs && dates.length > 1 && (
        <div className="space-y-3 mb-4">
          <h3 className="text-lg font-semibold">Select {orderType} time</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {dates.map((date) => (
              <button
                key={date.toISOString()}
                onClick={() => handleDateSelect(date)}
                className={cn(
                  "px-4 py-2 text-sm rounded-md transition-colors min-w-[4rem] flex-shrink-0",
                  selectedDate.toDateString() === date.toDateString()
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted/50 dark:hover:bg-muted"
                )}
              >
                {formatDateTab(date)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Time Slots Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* ASAP Option */}
        {showAsap && isToday(selectedDate) && (
          <button
            onClick={() =>
              onSlotSelect({
                id: "asap",
                label: "ASAP",
                time: "asap",
                available: true,
                estimatedTime:
                  orderType === "delivery" ? "25-35 min" : "10-15 min",
              })
            }
            className={cn(
              "p-3 rounded-lg text-left transition-colors",
              selectedSlot?.id === "asap"
                ? "border-2 border-green-500 bg-green-50"
                : "border border-border hover:border-border/80"
            )}
          >
            <div className="font-medium text-green-700">ASAP</div>
            <div className="text-sm text-green-600">
              {orderType === "delivery" ? "25-35 min" : "10-15 min"}
            </div>
          </button>
        )}

        {/* Regular Time Slots */}
        {filteredSlots.map((slot) => (
          <button
            key={slot.id}
            onClick={() => slot.available && onSlotSelect(slot)}
            disabled={!slot.available}
            className={cn(
              "p-3 rounded-lg text-left transition-colors",
              selectedSlot?.id === slot.id
                ? "border-2 border-primary bg-primary/5"
                : slot.available
                  ? "border border-border hover:border-border/80"
                  : "border border-border bg-gray-50 cursor-not-allowed"
            )}
          >
            <div
              className={cn(
                "font-medium",
                selectedSlot?.id === slot.id && "text-primary",
                !slot.available && "text-muted-foreground"
              )}
            >
              {formatTime(slot.time)}
            </div>
            <div
              className={cn(
                "text-sm",
                selectedSlot?.id === slot.id
                  ? "text-primary"
                  : "text-muted-foreground",
                !slot.available && "text-muted-foreground"
              )}
            >
              {slot.available ? slot.label || "Available" : "Full"}
            </div>
          </button>
        ))}
      </div>

      {/* Info Message */}
      <div className="text-center text-sm text-muted-foreground mt-4">
        <Clock className="inline-block w-4 h-4 mr-1" />
        All times are estimated. Actual {orderType} time may vary.
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { X, Calendar, Clock } from "lucide-react";

interface FulfillmentScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (data: { date: string; timeSlot: string }) => void;
  fulfillmentType: "pickup" | "delivery";
}

const availableDates = [
  { value: "7/13", label: "Today, July 13" },
  { value: "7/14", label: "Tomorrow, July 14" },
  { value: "7/15", label: "Monday, July 15" },
  { value: "7/16", label: "Tuesday, July 16" },
  { value: "7/17", label: "Wednesday, July 17" },
];

const timeSlots = [
  { value: "8:10 AM-8:20 AM", label: "8:10 AM-8:20 AM" },
  { value: "8:20 AM-8:30 AM", label: "8:20 AM-8:30 AM" },
  { value: "8:30 AM-8:40 AM", label: "8:30 AM-8:40 AM" },
  { value: "8:40 AM-8:50 AM", label: "8:40 AM-8:50 AM" },
  { value: "8:50 AM-9:00 AM", label: "8:50 AM-9:00 AM" },
  { value: "9:00 AM-9:10 AM", label: "9:00 AM-9:10 AM" },
  { value: "9:10 AM-9:20 AM", label: "9:10 AM-9:20 AM" },
  { value: "9:20 AM-9:30 AM", label: "9:20 AM-9:30 AM" },
  { value: "9:30 AM-9:40 AM", label: "9:30 AM-9:40 AM" },
  { value: "9:40 AM-9:50 AM", label: "9:40 AM-9:50 AM" },
  { value: "9:50 AM-10:00 AM", label: "9:50 AM-10:00 AM" },
  { value: "10:00 AM-10:10 AM", label: "10:00 AM-10:10 AM" },
  { value: "10:10 AM-10:20 AM", label: "10:10 AM-10:20 AM" },
  { value: "10:20 AM-10:30 AM", label: "10:20 AM-10:30 AM" },
  { value: "10:30 AM-10:40 AM", label: "10:30 AM-10:40 AM" },
  { value: "10:40 AM-10:50 AM", label: "10:40 AM-10:50 AM" },
  { value: "10:50 AM-11:00 AM", label: "10:50 AM-11:00 AM" },
  { value: "11:00 AM-11:10 AM", label: "11:00 AM-11:10 AM" },
  { value: "11:10 AM-11:20 AM", label: "11:10 AM-11:20 AM" },
  { value: "11:20 AM-11:30 AM", label: "11:20 AM-11:30 AM" },
  { value: "11:30 AM-11:40 AM", label: "11:30 AM-11:40 AM" },
  { value: "11:40 AM-11:50 AM", label: "11:40 AM-11:50 AM" },
  { value: "11:50 AM-12:00 PM", label: "11:50 AM-12:00 PM" },
  { value: "12:00 PM-12:10 PM", label: "12:00 PM-12:10 PM" },
  { value: "12:10 PM-12:20 PM", label: "12:10 PM-12:20 PM" },
  { value: "12:20 PM-12:30 PM", label: "12:20 PM-12:30 PM" },
  { value: "12:30 PM-12:40 PM", label: "12:30 PM-12:40 PM" },
  { value: "12:40 PM-12:50 PM", label: "12:40 PM-12:50 PM" },
  { value: "12:50 PM-1:00 PM", label: "12:50 PM-1:00 PM" },
  { value: "1:00 PM-1:10 PM", label: "1:00 PM-1:10 PM" },
  { value: "1:10 PM-1:20 PM", label: "1:10 PM-1:20 PM" },
  { value: "1:20 PM-1:30 PM", label: "1:20 PM-1:30 PM" },
  { value: "1:30 PM-1:40 PM", label: "1:30 PM-1:40 PM" },
  { value: "1:40 PM-1:50 PM", label: "1:40 PM-1:50 PM" },
  { value: "1:50 PM-2:00 PM", label: "1:50 PM-2:00 PM" },
  { value: "2:00 PM-2:10 PM", label: "2:00 PM-2:10 PM" },
  { value: "2:10 PM-2:20 PM", label: "2:10 PM-2:20 PM" },
  { value: "2:20 PM-2:30 PM", label: "2:20 PM-2:30 PM" },
  { value: "2:30 PM-2:40 PM", label: "2:30 PM-2:40 PM" },
];

export default function FulfillmentScheduleModal({
  isOpen,
  onClose,
  onSchedule,
  fulfillmentType,
}: FulfillmentScheduleModalProps) {
  const [selectedDate, setSelectedDate] = useState("7/13");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("8:10 AM-8:20 AM");

  const handleSchedule = () => {
    onSchedule({
      date: selectedDate,
      timeSlot: selectedTimeSlot,
    });
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      if (document.body.style.overflow === "hidden") {
        document.body.style.overflow = "";
      }
    };
  }, [isOpen, onClose]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedDate("7/13");
      setSelectedTimeSlot("8:10 AM-8:20 AM");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="schedule-modal-title"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative bg-background rounded-lg shadow-lg w-full max-w-md mx-4 border flex flex-col h-[90vh]">
        {/* Header */}
        <div className="border-b">
          <div className="flex items-center justify-between p-4">
            <h2
              id="schedule-modal-title"
              className="text-lg font-semibold text-foreground"
            >
              Schedule {fulfillmentType === "pickup" ? "Pickup" : "Delivery"}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close"
              className="h-8 w-8"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div
          className="overflow-y-auto px-4 py-5 flex-1"
          style={{ maxHeight: "calc(90vh - 140px)" }}
        >
          <div className="p-4 space-y-5">
            {/* Date Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <Label className="text-base font-semibold">Select Date</Label>
              </div>
              <RadioGroup value={selectedDate} onValueChange={setSelectedDate}>
                <div className="space-y-3">
                  {availableDates.map((date) => (
                    <div
                      key={date.value}
                      className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedDate === date.value
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                          : "border-border hover:border-primary/50 hover:bg-accent/50"
                      }`}
                      onClick={() => setSelectedDate(date.value)}
                    >
                      <RadioGroupItem
                        value={date.value}
                        id={`date-${date.value}`}
                        className="shrink-0"
                      />
                      <Label
                        htmlFor={`date-${date.value}`}
                        className="text-base font-medium cursor-pointer flex-1"
                      >
                        {date.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Time Slot Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mt-4">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <Label className="text-base font-semibold">Select Time</Label>
              </div>
              <RadioGroup
                value={selectedTimeSlot}
                onValueChange={setSelectedTimeSlot}
              >
                <div className="h-48 overflow-y-auto border border-border rounded-lg p-4">
                  <div className="space-y-3">
                    {timeSlots.map((slot) => (
                      <div
                        key={slot.value}
                        className={`relative flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedTimeSlot === slot.value
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-border hover:border-primary/50 hover:shadow-sm"
                        }`}
                        onClick={() => setSelectedTimeSlot(slot.value)}
                      >
                        <RadioGroupItem
                          value={slot.value}
                          id={`time-${slot.value}`}
                          className="shrink-0"
                        />
                        <Label
                          htmlFor={`time-${slot.value}`}
                          className="text-sm cursor-pointer flex-1 font-medium"
                        >
                          {slot.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Selected Schedule Summary */}
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg mt-4">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <div className="h-2 w-2 bg-primary rounded-full"></div>
                Selected Schedule
              </h3>
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  📅{" "}
                  {availableDates.find((d) => d.value === selectedDate)?.label}
                </p>
                <p className="text-sm font-medium text-foreground">
                  ⏰ {selectedTimeSlot}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {fulfillmentType === "pickup"
                    ? "Ready for pickup"
                    : "Delivery window"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSchedule} className="flex-1">
              Confirm Schedule
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

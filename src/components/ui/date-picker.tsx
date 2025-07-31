"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  isDateAvailable?: (date: Date) => boolean;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  blackoutDates?: Date[];
  highlightToday?: boolean;
  weekStartsOn?: 0 | 1;
  className?: string;
  disabled?: boolean;
}

export function DatePicker({
  value,
  onChange,
  isDateAvailable,
  minDate = new Date(),
  maxDate,
  placeholder = "Select date",
  blackoutDates = [],
  highlightToday = true,
  weekStartsOn = 0,
  className,
  disabled = false,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const isDateDisabled = (date: Date) => {
    // Check if date is before minDate
    if (minDate && date < minDate) return true;

    // Check if date is after maxDate
    if (maxDate && date > maxDate) return true;

    // Check blackout dates
    const isBlackout = blackoutDates.some(
      (blackoutDate) =>
        format(date, "yyyy-MM-dd") === format(blackoutDate, "yyyy-MM-dd")
    );
    if (isBlackout) return true;

    // Check custom availability function
    if (isDateAvailable && !isDateAvailable(date)) return true;

    return false;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 bg-white dark:bg-gray-800"
        align="start"
      >
        <Calendar
          mode="single"
          selected={value || undefined}
          onSelect={(date) => {
            onChange(date || null);
            setOpen(false);
          }}
          disabled={isDateDisabled}
          initialFocus
          weekStartsOn={weekStartsOn}
          modifiersStyles={{
            today: highlightToday
              ? {
                  fontWeight: "bold",
                  textDecoration: "underline",
                }
              : undefined,
          }}
        />
        {blackoutDates.length > 0 && (
          <div className="p-3 border-t">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-primary rounded-sm"></div>
                Selected
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-300 rounded-sm"></div>
                Unavailable
              </div>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

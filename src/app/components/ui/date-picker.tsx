"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "./utils";

interface DatePickerProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  placeholder?: string;
  minDate?: Date;
  disabled?: boolean;
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Pick a date",
  minDate,
  disabled = false,
}: DatePickerProps) {
  // Convert Date to YYYY-MM-DD format for input value (using local date components)
  const dateValue = date
    ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
    : "";
  const minDateValue = minDate
    ? `${minDate.getFullYear()}-${String(minDate.getMonth() + 1).padStart(2, "0")}-${String(minDate.getDate()).padStart(2, "0")}`
    : undefined;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    if (value) {
      // Parse YYYY-MM-DD and create date at local midnight
      const [year, month, day] = value.split("-").map(Number);
      onDateChange(new Date(year, month - 1, day));
    } else {
      onDateChange(undefined);
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
        <input
          type="date"
          value={dateValue}
          min={minDateValue}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            "w-full h-auto py-3 pl-10 pr-3 rounded-md border border-input bg-background text-sm",
            "hover:bg-accent hover:text-accent-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-colors",
            "[&::-webkit-calendar-picker-indicator]:cursor-pointer",
            "[&::-webkit-calendar-picker-indicator]:opacity-50",
            "[&::-webkit-calendar-picker-indicator]:hover:opacity-100",
            !date && "text-muted-foreground",
          )}
        />
      </div>
    </div>
  );
}

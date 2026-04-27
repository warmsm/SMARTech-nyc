"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "./utils";

interface DatePickerProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  placeholder?: string;
}

export function DatePicker({ date, onDateChange, placeholder = "Pick a date" }: DatePickerProps) {
  // Convert Date to YYYY-MM-DD format for input value
  const dateValue = date ? date.toISOString().split('T')[0] : '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      // Convert YYYY-MM-DD string to Date object
      onDateChange(new Date(value + 'T00:00:00'));
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
          onChange={handleChange}
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
            !date && "text-muted-foreground"
          )}
        />
      </div>
    </div>
  );
}
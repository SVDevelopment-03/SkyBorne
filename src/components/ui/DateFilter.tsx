"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, ChevronDown } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";

export function DateFilter() {
  const [open, setOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // format text that shows on button
  const displayText = dateRange?.from
    ? dateRange.to
      ? `${format(dateRange.from, "dd/MM/yyyy")} - ${format(dateRange.to, "dd/MM/yyyy")}`
      : format(dateRange.from, "dd/MM/yyyy")
    : "Filter date";

  const handleSelect = (range: DateRange | undefined) => {
    console.log("Selected range:", range);

    setDateRange(range);

    // ✔ auto-close when both dates selected
    if (range?.from && range?.to && range?.from !== range?.to) {
      setTimeout(() => setOpen(false), 100);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 rounded-md border px-4 py-2 h-9"
        >
          <CalendarIcon className="h-4 w-4" />

          <span className="font-medium text-[14px] whitespace-nowrap">
            {displayText}
          </span>

          <ChevronDown className="h-4 w-4 ml-auto" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="end">
        <Calendar mode="range" selected={dateRange} onSelect={handleSelect} />
      </PopoverContent>
    </Popover>
  );
}

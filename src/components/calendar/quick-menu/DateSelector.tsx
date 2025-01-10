"use client";

import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import { useState } from "react";

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date | null) => void;
}

const DateSelector = ({ selectedDate, onDateChange }: DateSelectorProps) => {
  console.log("[DateSelector] Rendering with date:", selectedDate);
  const [date, setDate] = useState<DateRange | undefined>({
    from: selectedDate,
    to: undefined,
  });

  const handleDateSelect = (range: DateRange | undefined) => {
    console.log("[DateSelector] Date range selected:", range);
    setDate(range);
    if (range?.from) {
      onDateChange(range.from);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="date-selector">Datum</Label>
      <div className="grid gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date-selector"
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? (
                format(selectedDate, "d MMMM yyyy", { locale: nl })
              ) : (
                <span>Kies een datum</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={date}
              onSelect={handleDateSelect}
              disabled={(date) => 
                date.getDay() === 0 || 
                date.getDay() === 6
              }
              initialFocus
              locale={nl}
              numberOfMonths={2}
              defaultMonth={selectedDate}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DateSelector;
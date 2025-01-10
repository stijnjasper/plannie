"use client";

import { format, addMonths } from "date-fns";
import { nl } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
      <Dialog>
        <DialogTrigger asChild>
          <Button
            id="date-selector"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground"
            )}
            aria-label="Selecteer een datum"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? (
              format(selectedDate, "d MMMM yyyy", { locale: nl })
            ) : (
              <span>Kies een datum</span>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="p-0 bg-background sm:max-w-[600px]">
          <DialogHeader className="p-3">
            <DialogTitle>Selecteer een datum</DialogTitle>
          </DialogHeader>
          <div className="flex gap-4 p-3">
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
              classNames={{
                months: "flex space-x-4",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium capitalize",
                nav: "space-x-1 flex items-center",
                nav_button: cn(
                  "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                ),
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem] capitalize",
                row: "flex w-full mt-2",
                cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
                day: cn(
                  "h-8 w-8 p-0 font-normal aria-selected:opacity-100"
                ),
                day_range_end: "day-range-end",
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day_outside: "text-muted-foreground opacity-50",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DateSelector;
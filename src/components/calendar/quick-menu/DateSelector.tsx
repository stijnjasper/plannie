"use client";

import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date | null) => void;
}

const DateSelector = ({ selectedDate, onDateChange }: DateSelectorProps) => {
  console.log("[DateSelector] Rendering with date:", selectedDate);

  const handleDateSelect = (date: Date | undefined) => {
    console.log("[DateSelector] Date selected:", date);
    if (date) {
      onDateChange(date);
      const dialogTrigger = document.querySelector('[role="dialog"]');
      if (dialogTrigger) {
        const closeButton = dialogTrigger.querySelector('button[aria-label="Close"]');
        if (closeButton) {
          (closeButton as HTMLButtonElement).click();
        }
      }
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
        <DialogContent className="p-0 bg-background">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => 
              date.getDay() === 0 || 
              date.getDay() === 6
            }
            initialFocus
            locale={nl}
            numberOfMonths={1}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DateSelector;
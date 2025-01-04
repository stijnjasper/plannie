"use client";

import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Label } from "@/components/ui/label";

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date | null) => void;
}

const DateSelector = ({ selectedDate, onDateChange }: DateSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>Datum</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground"
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
            mode="single"
            selected={selectedDate}
            onSelect={onDateChange}
            disabled={(date) => 
              date.getDay() === 0 || 
              date.getDay() === 6
            }
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateSelector;
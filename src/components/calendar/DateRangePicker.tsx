"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { nl } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  date: DateRange | undefined;
  onDateChange: (date: DateRange | undefined) => void;
  className?: string;
}

export function DateRangePicker({
  date,
  onDateChange,
  className,
}: DateRangePickerProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(new Date(date.from), "d MMMM yyyy", { locale: nl })} -{" "}
                  {format(new Date(date.to), "d MMMM yyyy", { locale: nl })}
                </>
              ) : (
                format(new Date(date.from), "d MMMM yyyy", { locale: nl })
              )
            ) : (
              <span>Selecteer een datum</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from ? new Date(date.from) : new Date()}
            selected={date}
            onSelect={onDateChange}
            numberOfMonths={2}
            locale={nl}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
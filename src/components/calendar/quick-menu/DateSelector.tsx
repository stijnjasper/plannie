"use client";

import { DatePickerInput } from "@mantine/dates";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { nl } from "date-fns/locale";

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date | null) => void;
}

const DateSelector = ({ selectedDate, onDateChange }: DateSelectorProps) => {
  console.log("[DateSelector] Rendering with date:", selectedDate);

  return (
    <div className="space-y-2">
      <Label htmlFor="date-selector">Datum</Label>
      <DatePickerInput
        id="date-selector"
        type="range"
        defaultValue={[selectedDate, null]}
        onChange={(range) => {
          if (range && range[0]) {
            onDateChange(range[0]);
          }
        }}
        leftSection={<CalendarIcon className="h-4 w-4" />}
        locale={nl}
        numberOfColumns={2}
        excludeDate={(date) => {
          const day = date.getDay();
          return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
        }}
        className="w-full"
      />
    </div>
  );
};

export default DateSelector;
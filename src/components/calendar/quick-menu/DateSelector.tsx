"use client";

import { DatePicker } from '@mantine/dates';
import { Label } from "@/components/ui/label";

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date | null) => void;
}

const DateSelector = ({ selectedDate, onDateChange }: DateSelectorProps) => {
  console.log("[DateSelector] Rendering with date:", selectedDate);

  return (
    <div className="space-y-2">
      <Label htmlFor="date-selector">Datum</Label>
      <DatePicker
        id="date-selector"
        type="range"
        allowSingleDateInRange
        value={[selectedDate, null]}
        onChange={(dates) => {
          if (dates && dates[0]) {
            onDateChange(dates[0]);
          }
        }}
        numberOfColumns={2}
        locale="nl"
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
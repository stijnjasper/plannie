import { DatePickerInput } from "@mantine/dates";
import { Label } from "@/components/ui/label";
import { format, isWeekend } from "date-fns";

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date | null) => void;
}

const DateSelector = ({ selectedDate, onDateChange }: DateSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>Date</Label>
      <DatePickerInput
        value={selectedDate}
        onChange={onDateChange}
        valueFormat="DD-MM-YYYY"
        excludeDate={(date) => isWeekend(date)}
        className="bg-background border-border dark:bg-background dark:border-gray-800"
        placeholder="Select date"
      />
    </div>
  );
};

export default DateSelector;
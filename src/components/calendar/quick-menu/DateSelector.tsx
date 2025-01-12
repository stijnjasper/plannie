import { DatePickerInput } from "@mantine/dates";
import { Label } from "@/components/ui/label";

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const DateSelector = ({ selectedDate, onDateChange }: DateSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="date-selector">Datum</Label>
      <DatePickerInput
        id="date-selector"
        type="range"
        allowSingleDateInRange
        value={[selectedDate, null]}
        onChange={(dates) => {
          if (dates && dates[0]) {
            onDateChange(dates[0]);
          }
        }}
        popoverProps={{
          withinPortal: false,
          withArrow: true,
          position: "bottom",
          shadow: "md"
        }}
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
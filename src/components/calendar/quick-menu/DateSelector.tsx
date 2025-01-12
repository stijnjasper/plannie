import { DatePickerInput } from "@mantine/dates";
import { Label } from "@/components/ui/label";

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const DateSelector = ({ selectedDate, onDateChange }: DateSelectorProps) => {
  const handleDateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="space-y-2" onClick={handleDateClick}>
      <Label htmlFor="date-selector">Datum</Label>
      <DatePickerInput
        id="date-selector"
        type="default"
        value={selectedDate}
        onChange={(date) => {
          if (date) {
            onDateChange(date);
          }
        }}
        popoverProps={{
          withinPortal: true,
          withArrow: true,
          position: "bottom",
          shadow: "md",
          zIndex: 9999
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
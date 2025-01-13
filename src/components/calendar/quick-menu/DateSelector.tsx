import { DatePickerInput } from "@mantine/dates";
import { Label } from "@/components/ui/label";

interface DateSelectorProps {
  selectedDate: Date;
  endDate: Date | null;
  onDateChange: (dates: [Date, Date | null]) => void;
}

const DateSelector = ({ selectedDate, endDate, onDateChange }: DateSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="date-selector">Datum</Label>
      <DatePickerInput
        id="date-selector"
        type="range"
        allowSingleDateInRange
        value={[selectedDate, endDate]}
        onChange={(dates) => {
          if (dates) {
            onDateChange([dates[0], dates[1]]);
          }
        }}
        popoverProps={{
          withinPortal: false,
          withArrow: true,
          position: "bottom",
          shadow: "md",
        }}
        locale="nl"
        excludeDate={(date) => {
          const day = date.getDay();
          return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
        }}
        className="w-full bg-background border-input"
        classNames={{
          input: 'bg-background text-foreground',
          day: 'hover:bg-muted data-[selected]:!bg-primary data-[selected]:text-primary-foreground',
          month: 'text-foreground [&_table_td]:text-foreground',
          calendarHeader: 'text-foreground',
          weekday: 'text-foreground',
          calendarHeaderControl: 'hover:bg-muted text-foreground'
        }}
      />
    </div>
  );
};

export default DateSelector;
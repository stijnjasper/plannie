import { DatePickerInput } from "@mantine/dates";
import { Label } from "@/components/ui/label";
import { MantineTheme, MantineColorScheme } from '@mantine/core';

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
          zIndex: 9999
        }}
        locale="nl"
        excludeDate={(date) => {
          const day = date.getDay();
          return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
        }}
        className="w-full"
        styles={(theme: MantineTheme & { colorScheme: MantineColorScheme }) => ({
          input: {
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border)',
            color: 'var(--foreground)',
          },
          dropdown: {
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border)',
            zIndex: 9999
          },
          day: {
            color: 'var(--foreground)',
            '&[data-selected]': {
              backgroundColor: '#34C759',
              color: '#FFFFFF'
            },
            '&:hover': {
              backgroundColor: theme.colorScheme === 'dark' ? '#262626' : '#F3F4F6'
            }
          }
        })}
      />
    </div>
  );
};

export default DateSelector;
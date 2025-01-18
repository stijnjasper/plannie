import { format } from "date-fns";
import { nl } from "date-fns/locale";

interface WeekHeaderProps {
  days: Date[];
}

const WeekHeader = ({ days }: WeekHeaderProps) => {
  return (
    <div className="grid grid-cols-7 border-b border-border bg-background text-sm font-medium text-muted-foreground">
      {days.map((day, index) => (
        <div
          key={day.toString()}
          className="flex h-14 items-center justify-center border-r border-border px-4 last:border-r-0"
        >
          {format(day, "EEE d", { locale: nl })}
        </div>
      ))}
    </div>
  );
};

export default WeekHeader;
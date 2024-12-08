import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfWeek, addDays, getISOWeek } from "date-fns";

interface WeekHeaderProps {
  currentDate: Date;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
}

const WeekHeader = ({ currentDate, onPreviousWeek, onNextWeek }: WeekHeaderProps) => {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekNumber = getISOWeek(currentDate);
  
  // Generate array of weekdays (Mon-Fri)
  const weekDays = Array.from({ length: 5 }, (_, i) => {
    const date = addDays(weekStart, i);
    return {
      dayName: format(date, 'EEE'),
      date: format(date, 'd MMM').toLowerCase()
    };
  });

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Week {weekNumber}</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={onPreviousWeek}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
            aria-label="Previous week"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={onNextWeek}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
            aria-label="Next week"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-5 border-b bg-muted rounded-t-lg">
        {weekDays.map(({ dayName, date }) => (
          <div key={dayName} className="p-4 border-r last:border-r-0">
            <div className="font-medium">{dayName} - {date}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekHeader;
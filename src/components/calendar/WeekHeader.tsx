import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfWeek, addDays } from "date-fns";

interface WeekHeaderProps {
  currentDate: Date;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
}

const WeekHeader = ({ currentDate, onPreviousWeek, onNextWeek }: WeekHeaderProps) => {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekNumber = format(currentDate, 'w');

  return (
    <div className="flex items-center justify-between mb-6">
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
  );
};

export default WeekHeader;
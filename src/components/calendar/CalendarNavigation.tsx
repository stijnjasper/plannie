import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { format, isToday } from "date-fns";

interface CalendarNavigationProps {
  currentDate: Date;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onTodayClick: () => void;
}

const CalendarNavigation = ({
  currentDate,
  onPreviousWeek,
  onNextWeek,
  onTodayClick,
}: CalendarNavigationProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={onPreviousWeek}
        variant="ghost"
        size="icon"
        className="rounded-full"
        aria-label="Previous week"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>
      
      <Button
        onClick={onTodayClick}
        variant="outline"
        size="sm"
        className={`gap-2 ${isToday(currentDate) ? 'bg-primary text-primary-foreground' : ''}`}
      >
        <Calendar className="w-4 h-4" />
        Today
      </Button>

      <Button
        onClick={onNextWeek}
        variant="ghost"
        size="icon"
        className="rounded-full"
        aria-label="Next week"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default CalendarNavigation;
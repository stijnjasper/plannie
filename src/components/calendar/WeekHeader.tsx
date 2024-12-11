import { format, startOfWeek, addDays, getISOWeek, isToday } from "date-fns";
import CalendarNavigation from "./CalendarNavigation";

interface WeekHeaderProps {
  currentDate: Date;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onTodayClick: () => void;
}

const WeekHeader = ({ 
  currentDate, 
  onPreviousWeek, 
  onNextWeek,
  onTodayClick 
}: WeekHeaderProps) => {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekNumber = getISOWeek(currentDate);

  const weekDays = Array.from({ length: 5 }, (_, i) => {
    const date = addDays(weekStart, i);
    return {
      dayName: format(date, "EEE"),
      date: format(date, "d MMM").toLowerCase(),
      isToday: isToday(date)
    };
  });

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Week {weekNumber}</h1>
        <CalendarNavigation
          currentDate={currentDate}
          onPreviousWeek={onPreviousWeek}
          onNextWeek={onNextWeek}
          onTodayClick={onTodayClick}
        />
      </div>

      <div className="grid grid-cols-[200px_1fr]">
        <div className="p-4 bg-muted font-medium border-b">Team</div>
        <div className="grid grid-cols-5">
          {weekDays.map(({ dayName, date, isToday }) => (
            <div key={dayName} className="p-4 border-b border-r last:border-r-0 bg-muted">
              <div className="font-medium flex items-center gap-2">
                {dayName} - 
                <span className={`${isToday ? 'bg-blue-500 text-white w-7 h-7 rounded-full flex items-center justify-center' : ''}`}>
                  {date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeekHeader;
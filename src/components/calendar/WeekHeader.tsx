import { startOfWeek, addDays } from "date-fns";
import CalendarNavigation from "./CalendarNavigation";
import { formatDutchDayAbbrev, formatDayNumber, formatMonthYear, getWeekDisplay } from "@/utils/dateFormatting";

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
  const { number: weekNumber, isCurrent } = getWeekDisplay(currentDate);
  const monthYearDisplay = formatMonthYear(currentDate);

  const weekDays = Array.from({ length: 5 }, (_, i) => {
    const date = addDays(weekStart, i);
    const isCurrentDay = date.toDateString() === new Date().toDateString();
    return {
      dayName: formatDutchDayAbbrev(date),
      date: formatDayNumber(date),
      isCurrentDay
    };
  });

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl">
            <span className="font-semibold">{monthYearDisplay.split(' ')[0]}</span>{' '}
            <span className="year-text">{monthYearDisplay.split(' ')[1]}</span>
          </h1>
          <p className={`text-sm ${isCurrent ? 'text-red-500' : 'text-muted-foreground'}`}>
            Week {weekNumber}
          </p>
        </div>
        <CalendarNavigation
          currentDate={currentDate}
          onPreviousWeek={onPreviousWeek}
          onNextWeek={onNextWeek}
          onTodayClick={onTodayClick}
        />
      </div>

      <div className="grid grid-cols-[200px_1fr]">
        <div className="p-4 calendar-header-bg font-medium border-b">Team</div>
        <div className="grid grid-cols-5">
          {weekDays.map(({ dayName, date, isCurrentDay }) => (
            <div key={`${dayName}-${date}`} className="p-4 border-r last:border-r-0 calendar-header-bg">
              <div className="font-medium flex items-center gap-2">
                <span>{dayName}</span>
                <span className={isCurrentDay ? 'bg-red-500 text-white px-2 py-0.5 rounded-full' : ''}>
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
import WeekHeader from "./WeekHeader";

interface TimelineHeaderProps {
  currentDate: Date;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onTodayClick: () => void;
}

const TimelineHeader = ({ 
  currentDate, 
  onPreviousWeek, 
  onNextWeek,
  onTodayClick 
}: TimelineHeaderProps) => {
  return (
    <WeekHeader
      currentDate={currentDate}
      onPreviousWeek={onPreviousWeek}
      onNextWeek={onNextWeek}
      onTodayClick={onTodayClick}
    />
  );
};

export default TimelineHeader;
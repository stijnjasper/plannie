import WeekHeader from "./WeekHeader";
import { addWeeks, subWeeks } from "date-fns";

interface TimelineHeaderProps {
  currentDate: Date;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
}

const TimelineHeader = ({ currentDate, onPreviousWeek, onNextWeek }: TimelineHeaderProps) => {
  return (
    <WeekHeader
      currentDate={currentDate}
      onPreviousWeek={onPreviousWeek}
      onNextWeek={onNextWeek}
    />
  );
};

export default TimelineHeader;
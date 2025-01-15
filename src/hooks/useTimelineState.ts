import { useState, useCallback } from "react";
import { addWeeks, subWeeks } from "date-fns";
import { useHotkeys } from "react-hotkeys-hook";

export const useTimelineState = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePreviousWeek = useCallback(() => 
    setCurrentDate(prev => subWeeks(prev, 1)), 
  []);

  const handleNextWeek = useCallback(() => 
    setCurrentDate(prev => addWeeks(prev, 1)), 
  []);

  const handleTodayClick = useCallback(() => 
    setCurrentDate(new Date()), 
  []);

  // Add hotkeys for week navigation
  useHotkeys('meta+left, ctrl+left', handlePreviousWeek, { preventDefault: true });
  useHotkeys('meta+right, ctrl+right', handleNextWeek, { preventDefault: true });

  return {
    currentDate,
    handlePreviousWeek,
    handleNextWeek,
    handleTodayClick,
  };
};
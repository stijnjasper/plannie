
import React from "react";
import TaskCard from "./TaskCard";
import { Task } from "@/types/calendar";
import { useDragDrop } from "./DragDropContext";
import { parseISO, isWithinInterval, isSameDay } from "date-fns";

interface DayColumnProps {
  day: string;
  team: string;
  assignee: string;
  tasks: Task[];
  weekDays: string[];
  onCellClick: (day: string, team: string, assignee: string) => void;
  onEditTask: (task: Task) => void;
  onDuplicateTask: (task: Task) => void;
  onCopyLink: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onViewTask: (task: Task) => void;
}

const DayColumn = ({ 
  day, 
  team,
  assignee,
  tasks,
  weekDays,
  onCellClick,
  onEditTask,
  onDuplicateTask,
  onCopyLink,
  onDeleteTask,
  onViewTask,
}: DayColumnProps) => {
  const { handleDragStart, handleDragEnd, handleDrop } = useDragDrop();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleCellClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCellClick(day, team, assignee);
    }
  };

  const calculateColumnSpan = (task: Task): number => {
    if (!task.endDay) return 1;
    
    const startIndex = weekDays.indexOf(task.day);
    const endIndex = weekDays.indexOf(task.endDay);
    
    // Als een van beide dagen buiten de weekweergave valt
    if (startIndex === -1 || endIndex === -1) {
      const taskStart = parseISO(task.day);
      const taskEnd = parseISO(task.endDay);
      const firstVisibleDay = parseISO(weekDays[0]);
      const lastVisibleDay = parseISO(weekDays[weekDays.length - 1]);

      // Als de taak volledig voor of na de zichtbare week valt
      if (taskEnd < firstVisibleDay || taskStart > lastVisibleDay) {
        return 0;
      }

      // Als de taak begint voor de zichtbare week
      if (taskStart < firstVisibleDay) {
        return weekDays.indexOf(task.endDay) + 1;
      }

      // Als de taak eindigt na de zichtbare week
      return weekDays.length - weekDays.indexOf(task.day);
    }

    // Normale berekening binnen de week
    return endIndex - startIndex + 1;
  };

  const filteredTasks = tasks.filter(task => {
    const isCorrectAssignee = task.assignee === assignee;
    const startDate = parseISO(task.day);
    const currentDate = parseISO(day);
    
    // Voor taken zonder einddatum
    if (!task.endDay) {
      return isCorrectAssignee && isSameDay(startDate, currentDate);
    }
    
    // Voor taken met een einddatum, toon alleen op startdag
    const isStartDay = isSameDay(startDate, currentDate);
    return isCorrectAssignee && isStartDay;
  });

  return (
    <div
      className="min-h-[120px] p-4 relative cursor-pointer bg-background hover:bg-muted/50 dark:hover:bg-muted/10 transition-colors h-full"
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, day, team)}
      onClick={handleCellClick}
    >
      {filteredTasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          columnSpan={calculateColumnSpan(task)}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onEdit={onEditTask}
          onDuplicate={() => onDuplicateTask(task)}
          onCopyLink={() => onCopyLink(task.id)}
          onDelete={() => onDeleteTask(task.id)}
          onClick={() => onViewTask(task)}
        />
      ))}
    </div>
  );
};

export default DayColumn;

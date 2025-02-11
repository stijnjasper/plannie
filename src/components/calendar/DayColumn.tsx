
import React from "react";
import TaskCard from "./TaskCard";
import { Task } from "@/types/calendar";
import { useDragDrop } from "./DragDropContext";
import { parseISO, isWithinInterval } from "date-fns";

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

  const isDateInRange = (startDate: string, endDate: string | undefined, targetDate: string) => {
    if (!endDate) return startDate === targetDate;
    
    const target = parseISO(targetDate);
    return isWithinInterval(target, {
      start: parseISO(startDate),
      end: parseISO(endDate)
    });
  };

  const getColumnSpan = (task: Task): number => {
    if (!task.endDay) return 1;
    const startIndex = weekDays.indexOf(task.day);
    const endIndex = weekDays.indexOf(task.endDay);
    return endIndex - startIndex + 1;
  };

  const filteredTasks = tasks.filter(task => {
    const isCorrectAssignee = task.assignee === assignee;
    const isInRange = isDateInRange(task.day, task.endDay, day);
    // Only show range tasks on their start day
    const isStartDay = task.day === day;
    return isCorrectAssignee && ((!task.endDay && isInRange) || (task.endDay && isStartDay));
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
          columnSpan={getColumnSpan(task)}
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

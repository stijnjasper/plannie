
import React, { useMemo } from "react";
import TaskCard from "./TaskCard";
import { Task } from "@/types/calendar";
import { useDragDrop } from "./DragDropContext";
import { parseISO, isWithinInterval, isSameDay, isAfter, isBefore, startOfDay } from "date-fns";

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

      // Als de taak begint voor de zichtbare week maar eindigt binnen of na de week
      if (taskStart < firstVisibleDay) {
        if (taskEnd <= lastVisibleDay) {
          // Eindigt binnen de week
          return weekDays.indexOf(task.endDay) + 1;
        } else {
          // Eindigt na de week
          return weekDays.length;
        }
      }

      // Als de taak begint binnen de week maar eindigt na de zichtbare week
      if (taskStart >= firstVisibleDay && taskEnd > lastVisibleDay) {
        return weekDays.length - weekDays.indexOf(task.day);
      }
    }

    // Normale berekening binnen de week
    return endIndex - startIndex + 1;
  };

  // Bepaal de startdag voor het renderen van een range-task
  const getTaskRenderPosition = (task: Task): number | null => {
    if (!task.endDay) {
      // Voor niet-range taken, toon op de exacte dag
      return day === task.day ? 0 : null;
    }
    
    const currentDate = parseISO(day);
    const taskStart = parseISO(task.day);
    const taskEnd = parseISO(task.endDay);
    const firstDayOfWeek = parseISO(weekDays[0]);
    
    // Toon range-taken alleen op de eerste dag waar ze zichtbaar zijn
    // Dit kan de startdag zijn, of de eerste dag van de week als de taak eerder begint
    
    // Als de huidige dag de startdag is
    if (isSameDay(currentDate, taskStart)) {
      return 0; // Render op de startdag
    }
    
    // Als de taak voor de zichtbare week begint en dit is de eerste dag van de week
    if (isBefore(taskStart, firstDayOfWeek) && day === weekDays[0]) {
      return 0; // Render op eerste dag van de week
    }
    
    // In alle andere gevallen, niet renderen op deze dag
    return null;
  };

  // Groepeer taken op dezelfde dag om overlapping te voorkomen
  const filteredAndSortedTasks = useMemo(() => {
    // Filter eerst op basis van assignee en render positie
    const filtered = tasks.filter(task => {
      const isCorrectAssignee = task.assignee === assignee;
      if (!isCorrectAssignee) return false;
      
      const position = getTaskRenderPosition(task);
      return position !== null;
    });
    
    // Sorteer taken: eerst range-taken (die over meerdere dagen gaan), dan op orderTimestamp
    return filtered.sort((a, b) => {
      // Eerst sorteren op range (range-taken komen eerst)
      const aIsRange = !!a.endDay;
      const bIsRange = !!b.endDay;
      if (aIsRange !== bIsRange) {
        return aIsRange ? -1 : 1;
      }
      // Dan sorteren op orderTimestamp
      const aTime = a.orderTimestamp ? new Date(a.orderTimestamp).getTime() : 0;
      const bTime = b.orderTimestamp ? new Date(b.orderTimestamp).getTime() : 0;
      return aTime - bTime;
    });
  }, [tasks, assignee, day, weekDays]);

  return (
    <div
      className="min-h-[120px] p-4 relative cursor-pointer bg-background hover:bg-muted/50 dark:hover:bg-muted/10 transition-colors h-full flex flex-col gap-2"
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, day, team, assignee)}
      onClick={handleCellClick}
    >
      {filteredAndSortedTasks.map((task) => {
        const columnSpan = calculateColumnSpan(task);
        
        // Als columnSpan 0 is, toon de taak niet
        if (columnSpan === 0) return null;
        
        return (
          <TaskCard
            key={task.id}
            task={task}
            columnSpan={columnSpan}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onEdit={onEditTask}
            onDuplicate={() => onDuplicateTask(task)}
            onCopyLink={() => onCopyLink(task.id)}
            onDelete={() => onDeleteTask(task.id)}
            onClick={() => onViewTask(task)}
          />
        );
      })}
    </div>
  );
};

export default DayColumn;

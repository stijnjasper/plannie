import React from "react";
import TaskCard from "./TaskCard";
import { Task } from "@/types/calendar";
import { useDragDrop } from "./DragDropContext";

interface DayColumnProps {
  day: string;
  team: string;
  assignee: string;
  tasks: Task[];
  onCellClick: (day: string, team: string) => void;
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
      onCellClick(day, team);
    }
  };

  const filteredTasks = tasks.filter(
    task => task.day === day && task.assignee === assignee
  );

  return (
    <div
      className="h-[120px] p-4 relative cursor-pointer bg-background hover:bg-muted/50 dark:hover:bg-muted/10 transition-colors"
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, day, team)}
      onClick={handleCellClick}
    >
      {filteredTasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
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
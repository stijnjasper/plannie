import React from "react";
import TaskCard from "./TaskCard";

interface Task {
  id: string;
  title: string;
  subtitle?: string;
  assignee: string;
  day: string;
  color: string;
  team: string;
}

interface DayColumnProps {
  day: string;
  team: string;
  tasks: Task[];
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, day: string, team: string) => void;
  onDragStart: (e: React.DragEvent, taskId: string, team: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
}

const DayColumn = ({ day, team, tasks, onDragOver, onDrop, onDragStart, onDragEnd }: DayColumnProps) => {
  return (
    <div
      className="p-4 border-r last:border-r-0 min-h-[120px] relative border-b last:border-b-0"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, day, team)}
    >
      {tasks
        .filter((task) => task.day === day)
        .map((task) => (
          <TaskCard
            key={task.id}
            id={task.id}
            title={task.title}
            subtitle={task.subtitle}
            color={task.color}
            team={team}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        ))}
    </div>
  );
};

export default DayColumn;
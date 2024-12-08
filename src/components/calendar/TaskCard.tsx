import React from "react";

interface TaskCardProps {
  id: string;
  title: string;
  subtitle?: string;
  color: string;
  team: string;
  onDragStart: (e: React.DragEvent, taskId: string, team: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
}

const TaskCard = ({ id, title, subtitle, color, team, onDragStart, onDragEnd }: TaskCardProps) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, id, team)}
      onDragEnd={onDragEnd}
      className={`${color} border p-3 rounded-md mb-2 cursor-move hover:scale-[1.02] transition-transform`}
    >
      <div className="font-medium text-sm">{title}</div>
      {subtitle && (
        <div className="text-xs text-muted-foreground mt-1">
          {subtitle}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
import React from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Edit, Copy, Link, Trash2 } from "lucide-react";
import { Task } from "@/types/calendar";

interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onEdit: (task: Task) => void;
  onDuplicate: () => void;
  onCopyLink: () => void;
  onDelete: () => void;
  onClick: () => void;
}

const TaskCard = ({ 
  task,
  onDragStart, 
  onDragEnd,
  onEdit,
  onDuplicate,
  onCopyLink,
  onDelete,
  onClick,
}: TaskCardProps) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          draggable
          onDragStart={(e) => onDragStart(e, task.id)}
          onDragEnd={onDragEnd}
          onClick={onClick}
          className={`${task.color} border p-3 rounded-md mb-2 cursor-move hover:scale-[1.02] transition-transform`}
        >
          <div className="font-medium text-sm">{task.title}</div>
          {task.subtitle && (
            <div className="text-xs text-muted-foreground mt-1">
              {task.subtitle}
            </div>
          )}
          {task.description && (
            <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {task.description}
            </div>
          )}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="bg-white">
        <ContextMenuItem onClick={() => onEdit(task)}>
          <Edit className="mr-2 h-4 w-4" />
          <span>Edit</span>
        </ContextMenuItem>
        <ContextMenuItem onClick={onDuplicate}>
          <Copy className="mr-2 h-4 w-4" />
          <span>Duplicate</span>
        </ContextMenuItem>
        <ContextMenuItem onClick={onCopyLink}>
          <Link className="mr-2 h-4 w-4" />
          <span>Copy Link</span>
        </ContextMenuItem>
        <ContextMenuItem onClick={onDelete} className="text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default TaskCard;
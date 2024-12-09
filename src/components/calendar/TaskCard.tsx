import React from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Copy, Trash2, Copy as Duplicate } from "lucide-react";

interface TaskCardProps {
  id: string;
  title: string;
  subtitle?: string;
  color: string;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDuplicate: () => void;
  onCopyLink: () => void;
  onDelete: () => void;
}

const TaskCard = ({ 
  id, 
  title, 
  subtitle, 
  color, 
  onDragStart, 
  onDragEnd,
  onDuplicate,
  onCopyLink,
  onDelete,
}: TaskCardProps) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          draggable
          onDragStart={(e) => onDragStart(e, id)}
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
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={onDuplicate}>
          <Duplicate className="mr-2 h-4 w-4" />
          <span>Duplicate</span>
        </ContextMenuItem>
        <ContextMenuItem onClick={onCopyLink}>
          <Copy className="mr-2 h-4 w-4" />
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
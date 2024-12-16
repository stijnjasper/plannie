import React, { useCallback } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Edit, Copy, Link, Trash2 } from "lucide-react";
import { Task } from "@/types/calendar";
import { cn } from "@/lib/utils";

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

const contextMenuOptions = [
  {
    label: "Edit",
    icon: Edit,
    action: "edit",
    className: "",
  },
  {
    label: "Duplicate",
    icon: Copy,
    action: "duplicate",
    className: "",
  },
  {
    label: "Copy Link",
    icon: Link,
    action: "copyLink",
    className: "",
  },
  {
    label: "Delete",
    icon: Trash2,
    action: "delete",
    className: "text-red-600 dark:text-red-400",
  },
];

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
  const handleAction = useCallback((action: string) => {
    requestAnimationFrame(() => {
      switch (action) {
        case "edit":
          onEdit(task);
          break;
        case "duplicate":
          onDuplicate();
          break;
        case "copyLink":
          onCopyLink();
          break;
        case "delete":
          onDelete();
          break;
      }
    });
  }, [task, onEdit, onDuplicate, onCopyLink, onDelete]);

  const handleDragStart = useCallback((e: React.DragEvent) => {
    onDragStart(e, task.id);
  }, [task.id, onDragStart]);

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          draggable
          onDragStart={handleDragStart}
          onDragEnd={onDragEnd}
          onClick={onClick}
          className={cn(
            task.color,
            "border p-3 rounded-md mb-2 cursor-move hover:scale-[1.02] transition-transform",
            "dark:text-[#f0f0f0] dark:border-[#333333]"
          )}
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
      <ContextMenuContent className="bg-background border-border">
        {contextMenuOptions.map((option) => (
          <ContextMenuItem
            key={option.action}
            onClick={() => handleAction(option.action)}
            className={cn(
              option.className,
              "text-foreground hover:bg-muted/50",
              "dark:text-[#f0f0f0] dark:hover:bg-gray-700/50",
              option.action === "delete" && "hover:!text-red-600 dark:hover:!text-red-400"
            )}
          >
            <option.icon className={cn(
              "mr-2 h-4 w-4",
              option.action === "delete" && "text-red-600 dark:text-red-400"
            )} />
            <span>{option.label}</span>
          </ContextMenuItem>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default TaskCard;
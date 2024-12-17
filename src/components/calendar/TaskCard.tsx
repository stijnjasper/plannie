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

  const getTaskColor = (color: string) => {
    const colorMap: Record<string, string> = {
      'bg-blue-100': 'bg-task-blue-light dark:bg-task-blue-dark',
      'bg-green-100': 'bg-task-green-light dark:bg-task-green-dark',
      'bg-yellow-100': 'bg-task-yellow-light dark:bg-task-yellow-dark',
      'bg-purple-100': 'bg-task-purple-light dark:bg-task-purple-dark',
      'bg-pink-100': 'bg-task-purple-light dark:bg-task-purple-dark',
      'bg-orange-100': 'bg-task-yellow-light dark:bg-task-yellow-dark',
      // Legacy color mappings for backward compatibility
      'bg-[#e8f0ff]': 'bg-task-blue-light dark:bg-task-blue-dark',
      'bg-[#edf9ee]': 'bg-task-green-light dark:bg-task-green-dark',
      'bg-[#fff9db]': 'bg-task-yellow-light dark:bg-task-yellow-dark',
      'bg-[#f2e8ff]': 'bg-task-purple-light dark:bg-task-purple-dark',
    };
    
    // If no mapping exists, return the original color to prevent undefined class names
    return colorMap[color] || color;
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          draggable
          onDragStart={handleDragStart}
          onDragEnd={onDragEnd}
          onClick={onClick}
          className={cn(
            getTaskColor(task.color),
            "border p-3 rounded-md mb-2 cursor-move hover:scale-[1.02] transition-transform",
            "dark:border-gray-800"
          )}
        >
          <div className="font-medium text-sm dark:text-gray-100">{task.title}</div>
          {task.subtitle && (
            <div className="text-xs text-muted-foreground mt-1 dark:text-gray-400">
              {task.subtitle}
            </div>
          )}
          {task.description && (
            <div className="text-xs text-muted-foreground mt-1 line-clamp-2 dark:text-gray-400">
              {task.description}
            </div>
          )}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="bg-background border-border dark:bg-gray-900 dark:border-gray-800">
        {contextMenuOptions.map((option) => (
          <ContextMenuItem
            key={option.action}
            onClick={() => handleAction(option.action)}
            className={cn(
              option.className,
              "text-foreground hover:bg-muted/50 dark:text-gray-100 dark:hover:bg-gray-800/50",
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
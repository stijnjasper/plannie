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
    className: "text-red-600 dark:text-red-400 hover:!text-white [&>svg]:hover:!text-white group-hover:!text-white",
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
      'bg-blue-100': 'bg-task-blue-light dark:bg-task-blue-dark hover:bg-task-blue-light/80 dark:hover:bg-task-blue-dark/80',
      'bg-green-100': 'bg-task-green-light dark:bg-task-green-dark hover:bg-task-green-light/80 dark:hover:bg-task-green-dark/80',
      'bg-yellow-100': 'bg-task-yellow-light dark:bg-task-yellow-dark hover:bg-task-yellow-light/80 dark:hover:bg-task-yellow-dark/80',
      'bg-purple-100': 'bg-task-purple-light dark:bg-task-purple-dark hover:bg-task-purple-light/80 dark:hover:bg-task-purple-dark/80',
      'bg-pink-100': 'bg-task-purple-light dark:bg-task-purple-dark hover:bg-task-purple-light/80 dark:hover:bg-task-purple-dark/80',
      'bg-orange-100': 'bg-task-yellow-light dark:bg-task-yellow-dark hover:bg-task-yellow-light/80 dark:hover:bg-task-yellow-dark/80',
      'bg-[#e8f0ff]': 'bg-task-blue-light dark:bg-task-blue-dark hover:bg-task-blue-light/80 dark:hover:bg-task-blue-dark/80',
      'bg-[#edf9ee]': 'bg-task-green-light dark:bg-task-green-dark hover:bg-task-green-light/80 dark:hover:bg-task-green-dark/80',
      'bg-[#fff9db]': 'bg-task-yellow-light dark:bg-task-yellow-dark hover:bg-task-yellow-light/80 dark:hover:bg-task-yellow-dark/80',
      'bg-[#f2e8ff]': 'bg-task-purple-light dark:bg-task-purple-dark hover:bg-task-purple-light/80 dark:hover:bg-task-purple-dark/80',
    };
    
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
            "border p-3 rounded-md mb-2 cursor-move transition-all duration-200",
            "hover:scale-[1.02] data-[state=open]:scale-[1.02]",
            "dark:border-gray-800"
          )}
        >
          <div className="text-xs text-muted-foreground dark:text-gray-400 mb-1">
            {task.timeBlock}u
          </div>
          <div className="font-medium text-sm text-foreground dark:text-gray-100">
            {task.title}
          </div>
          {task.description && (
            <div className="text-xs text-muted-foreground dark:text-gray-400 mt-1 line-clamp-2">
              {task.description}
            </div>
          )}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="bg-background border-border dark:bg-background dark:border-gray-800">
        {contextMenuOptions.map((option) => (
          <ContextMenuItem
            key={option.action}
            onClick={() => handleAction(option.action)}
            className={cn(
              "group",
              option.className,
              "text-foreground hover:bg-primary hover:text-primary-foreground dark:text-gray-100 dark:hover:bg-primary dark:hover:text-primary-foreground",
            )}
          >
            <option.icon className="mr-2 h-4 w-4" />
            <span>{option.label}</span>
          </ContextMenuItem>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default TaskCard;
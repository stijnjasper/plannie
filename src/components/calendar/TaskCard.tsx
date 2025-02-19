
import React, { useCallback } from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { Edit, Copy, Link, Trash2 } from "lucide-react";
import { Task } from "@/types/calendar";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  columnSpan: number;
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
    className: "text-red-600 dark:text-red-500 [&>svg]:text-red-600 dark:[&>svg]:text-red-500 hover:!bg-red-600 hover:!text-white [&>svg]:hover:!text-white",
  },
];

const TaskCard = ({
  task,
  columnSpan,
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
    // Bestaande implementatie behouden voor backwards compatibility
    onDragStart(e, task.id);
    
    // Extended data toevoegen voor state restore
    const extendedData = {
      id: task.id,
      originalColumnSpan: columnSpan,
      originalIsRangeTask: !!task.endDay
    };
    e.dataTransfer.setData("application/json", JSON.stringify(extendedData));
    
    const draggedElement = e.currentTarget as HTMLElement;
    draggedElement.style.opacity = "0.5";
  }, [task.id, columnSpan, task.endDay, onDragStart]);

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

  const isRangeTask = !!task.endDay;
  const gridGap = 16; // Komt overeen met gap-4 in Tailwind

  const dynamicWidth = isRangeTask 
    ? `calc(${100 * columnSpan}% + ${gridGap * (columnSpan - 1)}px + ${gridGap * 2}px)` 
    : "100%";

  return (
    <ContextMenuPrimitive.Root>
      <ContextMenuPrimitive.Trigger>
        <div
          draggable
          onDragStart={handleDragStart}
          onDragEnd={onDragEnd}
          onClick={onClick}
          style={{
            gridColumn: isRangeTask ? `span ${columnSpan}` : 'span 1',
            marginLeft: isRangeTask ? `-${gridGap}px` : "0",
            marginRight: isRangeTask ? `-${gridGap}px` : "0",
            width: dynamicWidth,
            zIndex: isRangeTask ? 10 : 1,
          }}
          className={cn(
            getTaskColor(task.color),
            "relative border p-3 rounded-md mb-2 cursor-move transition-all duration-200 box-border",
            "group hover:scale-[1.02] data-[state=open]:scale-[1.02]",
            "dark:border-gray-800",
            isRangeTask && "before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-gradient-to-r before:from-transparent before:to-current before:opacity-10",
            isRangeTask && "after:absolute after:inset-y-0 after:right-0 after:w-1 after:bg-gradient-to-l after:from-transparent after:to-current after:opacity-10",
            isRangeTask && columnSpan > 1 && "min-w-[200px]"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground dark:text-gray-400">
              {task.timeBlock}u
            </div>
          </div>
          <div className="font-medium text-sm text-foreground dark:text-gray-100 mt-1">
            {task.title}
          </div>
          {task.description && (
            <div className="text-xs text-muted-foreground dark:text-gray-400 mt-1 line-clamp-2">
              {task.description}
            </div>
          )}
        </div>
      </ContextMenuPrimitive.Trigger>
      <ContextMenuPrimitive.Portal>
        <ContextMenuPrimitive.Content
          className="z-50 bg-background border-border dark:bg-background dark:border-gray-800 min-w-[8rem] overflow-hidden rounded-md border p-1 text-popover-foreground shadow-md animate-in fade-in-80"
          collisionPadding={20}
        >
          {contextMenuOptions.map((option) => (
            <ContextMenuPrimitive.Item
              key={option.action}
              onClick={() => handleAction(option.action)}
              className={cn(
                "group relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                option.className,
                "text-foreground hover:bg-primary hover:text-primary-foreground dark:text-gray-100 dark:hover:bg-primary dark:hover:text-primary-foreground"
              )}
            >
              <option.icon className="mr-2 h-4 w-4" />
              <span>{option.label}</span>
            </ContextMenuPrimitive.Item>
          ))}
        </ContextMenuPrimitive.Content>
      </ContextMenuPrimitive.Portal>
    </ContextMenuPrimitive.Root>
  );
};

export default TaskCard;

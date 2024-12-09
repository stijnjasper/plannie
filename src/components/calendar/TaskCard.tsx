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
    className: "text-red-600",
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
  // Aangepaste handler voor "Edit"
  const handleEdit = (task: Task) => {
    console.log("Closing context menu before editing.");

    // 1. Reset de Quick Menu state (voeg deze functie toe in de Quick Menu logic)
    console.log("Resetting Quick Menu state.");

    // 2. Open het Quick Menu met de geselecteerde taakgegevens
    console.log("Opening Quick Menu with task:", task);
    onEdit(task); // Roept de originele onEdit-prop aan
  };

  // Stuur acties naar de juiste handlers
  const handleAction = (action: string) => {
    switch (action) {
      case "edit":
        handleEdit(task); // Gebruik de aangepaste handleEdit hier
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
  };

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
        {contextMenuOptions.map((option) => (
          <ContextMenuItem
            key={option.action}
            onClick={() => handleAction(option.action)}
            className={option.className}
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

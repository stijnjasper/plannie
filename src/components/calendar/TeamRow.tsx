import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import TeamMemberList from "./TeamMemberList";
import DayColumn from "./DayColumn";
import { Task, TeamMember } from "@/types/calendar";

interface TeamRowProps {
  team: string;
  isOpen: boolean;
  onToggle: () => void;
  teamMembers: TeamMember[];
  tasks: Task[];
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, day: string, team: string) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onCellClick: (day: string, team: string) => void;
  onEditTask: (task: Task) => void;
  onDuplicateTask: (task: Task) => void;
  onCopyLink: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onViewTask: (task: Task) => void;
}

const TeamRow = ({
  team,
  isOpen,
  onToggle,
  teamMembers,
  tasks,
  onDragOver,
  onDrop,
  onDragStart,
  onDragEnd,
  onCellClick,
  onEditTask,
  onDuplicateTask,
  onCopyLink,
  onDeleteTask,
  onViewTask,
}: TeamRowProps) => {
  const getBgColor = (team: string) => {
    switch (team) {
      case "Marketing":
        return "bg-orange-50";
      case "Development":
        return "bg-blue-50";
      case "Design":
        return "bg-green-50";
      default:
        return "bg-muted/50";
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger className="w-full">
        <div
          className={`flex items-center gap-2 p-2 border-b hover:bg-muted/80 transition-colors ${getBgColor(
            team
          )}`}
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              isOpen ? "transform rotate-180" : ""
            }`}
          />
          <span className="font-medium">{team}</span>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="grid grid-cols-[200px_1fr]">
          <TeamMemberList teamMembers={teamMembers} team={team} />
          <div className="grid grid-cols-5">
            {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
              <DayColumn
                key={`${team}-${day}`}
                day={day}
                team={team}
                tasks={tasks}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onCellClick={onCellClick}
                onEditTask={onEditTask}
                onDuplicateTask={onDuplicateTask}
                onCopyLink={onCopyLink}
                onDeleteTask={onDeleteTask}
                onViewTask={onViewTask}
              />
            ))}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default TeamRow;
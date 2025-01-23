import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Task, TeamMember } from "@/types/calendar";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import TeamContent from "./TeamContent";

interface TeamRowProps {
  team: string;
  teamMembers: TeamMember[];
  tasks: Task[];
  isOpen: boolean;
  onToggle: () => void;
  onDeleteTask: (taskId: string) => void;
  onViewTask: (task: Task) => void;
  onCellClick: (day: string, team: string, assignee: string) => void;
  onEditTask: (task: Task) => void;
  onDuplicateTask: (task: Task) => void;
  onCopyLink: (taskId: string) => void;
  currentDate: Date;
}

const TeamRow = ({
  team,
  teamMembers,
  tasks,
  isOpen,
  onToggle,
  onDeleteTask,
  onViewTask,
  onCellClick,
  onEditTask,
  onDuplicateTask,
  onCopyLink,
  currentDate,
}: TeamRowProps) => {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger className="w-full">
        <div
          className={cn(
            "flex items-center gap-2 p-2 border-b border-border hover:bg-muted/80 dark:hover:bg-muted/10 transition-colors",
            "bg-[#FAFAFA] dark:bg-background"
          )}
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform text-foreground ${
              isOpen ? "transform rotate-180" : ""
            }`}
          />
          <span className="font-medium text-foreground dark:text-gray-100">{team}</span>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <TeamContent
          teamMembers={teamMembers}
          tasks={tasks}
          team={team}
          onCellClick={onCellClick}
          onEditTask={onEditTask}
          onDuplicateTask={onDuplicateTask}
          onCopyLink={onCopyLink}
          onDeleteTask={onDeleteTask}
          onViewTask={onViewTask}
          currentDate={currentDate}
        />
      </CollapsibleContent>
    </Collapsible>
  );
};

export default TeamRow;
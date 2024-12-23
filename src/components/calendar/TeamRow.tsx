import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import TeamMemberList from "./TeamMemberList";
import DayColumn from "./DayColumn";
import { Task, TeamMember } from "@/types/calendar";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface TeamRowProps {
  team: string;
  teamMembers: TeamMember[];
  tasks: Task[];
  isOpen: boolean;
  onToggle: () => void;
  onCreateTask: (team: string, day: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onViewTask: (taskId: string) => void;
}

const TeamRow = ({
  team,
  teamMembers,
  tasks,
  isOpen,
  onToggle,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  onViewTask,
}: TeamRowProps) => {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger className="w-full">
        <div
          className={cn(
            "flex items-center gap-2 p-2 border-b border-border hover:bg-muted/80 dark:hover:bg-muted/10 transition-colors",
            `calendar-row-${team.toLowerCase()}`
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
        <div className="grid grid-cols-[200px_1fr]">
          <TeamMemberList teamMembers={teamMembers} team={team} />
          <div className="grid grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, index) => {
              const day = new Date();
              day.setDate(day.getDate() + index);
              const dayStr = day.toISOString().split('T')[0];
              const dayTasks = tasks.filter((task) => task.day === dayStr);

              return (
                <DayColumn
                  key={dayStr}
                  day={dayStr}
                  tasks={dayTasks}
                  team={team}
                  onCreateTask={onCreateTask}
                  onUpdateTask={onUpdateTask}
                  onDeleteTask={onDeleteTask}
                  onViewTask={onViewTask}
                />
              );
            })}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default TeamRow;
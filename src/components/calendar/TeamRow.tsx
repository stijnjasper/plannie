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
  onViewTask: (task: Task) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, day: string, team: string) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onCellClick: (day: string, team: string) => void;
  onEditTask: (task: Task) => void;
  onDuplicateTask: (task: Task) => void;
  onCopyLink: (taskId: string) => void;
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
  onDragOver,
  onDrop,
  onDragStart,
  onDragEnd,
  onCellClick,
  onEditTask,
  onDuplicateTask,
  onCopyLink,
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
        <div className="grid grid-cols-[200px_1fr] divide-x divide-border">
          <TeamMemberList teamMembers={teamMembers} team={team} />
          <div className="grid grid-cols-5 divide-x divide-border">
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
                  onCellClick={onCellClick}
                  onEditTask={onEditTask}
                  onDuplicateTask={onDuplicateTask}
                  onCopyLink={onCopyLink}
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
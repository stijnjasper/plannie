import { Task, TeamMember } from "@/types/calendar";
import DayColumn from "./DayColumn";
import { format, startOfWeek, addDays } from "date-fns";

interface TeamContentProps {
  teamMembers: TeamMember[];
  tasks: Task[];
  team: string;
  onCellClick: (day: string, team: string) => void;
  onEditTask: (task: Task) => void;
  onDuplicateTask: (task: Task) => void;
  onCopyLink: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onViewTask: (task: Task) => void;
  currentDate: Date;
}

const TeamContent = ({
  teamMembers,
  tasks,
  team,
  onCellClick,
  onEditTask,
  onDuplicateTask,
  onCopyLink,
  onDeleteTask,
  onViewTask,
  currentDate,
}: TeamContentProps) => {
  return (
    <div className="grid grid-cols-[200px_1fr] divide-x divide-border">
      <div className="divide-y divide-border">
        {teamMembers.map((member) => (
          <div key={member.id} className="team-member-list border-r border-b last:border-b-0 p-4 border-border bg-background dark:bg-background">
            <div className="flex items-center gap-3 mb-4 last:mb-0">
              <div className="text-left">
                <div className="font-medium text-sm text-foreground dark:text-gray-100">{member.full_name}</div>
                <div className="text-xs text-muted-foreground dark:text-gray-400">{member.title}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-5 divide-x divide-border">
        {Array.from({ length: 5 }).map((_, index) => {
          const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
          const day = addDays(weekStart, index);
          const dayStr = format(day, 'yyyy-MM-dd');

          return (
            <DayColumn
              key={dayStr}
              day={dayStr}
              team={team}
              tasks={tasks.filter(task => task.day === dayStr)}
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
  );
};

export default TeamContent;
import { Task, TeamMember } from "@/types/calendar";
import DayColumn from "./DayColumn";
import { format, startOfWeek, addDays } from "date-fns";
import TeamMembersList from "./team/TeamMembersList";

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
      <TeamMembersList teamMembers={teamMembers} />
      <div className="grid grid-cols-5 divide-x divide-border">
        {teamMembers.map((member) => (
          <div key={member.id} className="divide-y divide-border">
            {Array.from({ length: 5 }).map((_, index) => {
              const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
              const day = addDays(weekStart, index);
              const dayStr = format(day, 'yyyy-MM-dd');

              return (
                <DayColumn
                  key={`${member.id}-${dayStr}`}
                  day={dayStr}
                  team={team}
                  assignee={member.name}
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
        ))}
      </div>
    </div>
  );
};

export default TeamContent;
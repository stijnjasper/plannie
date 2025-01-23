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
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 5 }).map((_, index) => 
    format(addDays(weekStart, index), 'yyyy-MM-dd')
  );

  const filteredTeamMembers = teamMembers.filter(member => member.team === team);

  return (
    <div className="grid">
      {filteredTeamMembers.map((member) => (
        <div key={member.id} className="grid grid-cols-[200px_1fr]">
          <TeamMembersList member={member} />
          <div className="grid grid-cols-5">
            {weekDays.map((day) => (
              <DayColumn
                key={`${member.id}-${day}`}
                day={day}
                team={team}
                assignee={member.full_name}
                tasks={tasks}
                onCellClick={(day) => onCellClick(day, team)}
                onEditTask={onEditTask}
                onDuplicateTask={onDuplicateTask}
                onCopyLink={onCopyLink}
                onDeleteTask={onDeleteTask}
                onViewTask={onViewTask}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamContent;
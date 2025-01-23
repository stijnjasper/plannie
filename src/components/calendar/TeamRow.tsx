import { Task, TeamMember } from "@/types/calendar";
import TeamContent from "./TeamContent";

interface TeamRowProps {
  team: string;
  teamMembers: TeamMember[];
  tasks: Task[];
  isOpen: boolean;
  onToggle: () => void;
  onCellClick: (day: string, team: string, assignee: string) => void;
  onEditTask: (task: Task) => void;
  onDuplicateTask: (task: Task) => void;
  onCopyLink: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onViewTask: (task: Task) => void;
  currentDate: Date;
}

const TeamRow = ({
  team,
  teamMembers,
  tasks,
  isOpen,
  onToggle,
  onCellClick,
  onEditTask,
  onDuplicateTask,
  onCopyLink,
  onDeleteTask,
  onViewTask,
  currentDate,
}: TeamRowProps) => {
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full px-4 py-2 text-sm font-medium text-left hover:bg-muted/50 transition-colors"
      >
        {team}
      </button>
      {isOpen && (
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
      )}
    </div>
  );
};

export default TeamRow;
import { Task, TeamMember } from "@/types/calendar";
import TeamRow from "./TeamRow";
import { useDragDrop } from "./DragDropContext";

interface TimelineContentProps {
  tasks: Task[];
  teamMembers: TeamMember[];
  openTeams: Record<string, boolean>;
  onToggleTeam: (team: string) => void;
  onEditTask: (task: Task) => void;
  onDuplicateTask: (task: Task) => void;
  onCopyLink: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onViewTask: (task: Task) => void;
  onCellClick: (day: string, team: string) => void;
}

const TimelineContent = ({
  tasks,
  teamMembers,
  openTeams,
  onToggleTeam,
  onEditTask,
  onDuplicateTask,
  onCopyLink,
  onDeleteTask,
  onViewTask,
  onCellClick,
}: TimelineContentProps) => {
  const { handleDragStart, handleDragEnd, handleDrop } = useDragDrop();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-background shadow-sm transition-colors duration-200">
      {["Marketing", "Development", "Design"].map((team) => (
        <TeamRow
          key={team}
          team={team}
          isOpen={openTeams[team]}
          onToggle={() => onToggleTeam(team)}
          teamMembers={teamMembers}
          tasks={tasks.filter((task) => task.team === team)}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onCellClick={onCellClick}
          onEditTask={onEditTask}
          onDuplicateTask={onDuplicateTask}
          onCopyLink={onCopyLink}
          onDeleteTask={onDeleteTask}
          onViewTask={onViewTask}
        />
      ))}
    </div>
  );
};

export default TimelineContent;
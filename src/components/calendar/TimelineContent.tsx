import { Task, TeamMember } from "@/types/calendar";
import TeamRow from "./TeamRow";
import { useDragDrop } from "./DragDropContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

  const { data: teams = [] } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('order_index');
      
      if (error) throw error;
      return data;
    }
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-background shadow-sm transition-colors duration-200 dark:bg-background dark:[&]:bg-background">
      {teams.map((team) => (
        <TeamRow
          key={team.id}
          team={team.name}
          isOpen={openTeams[team.name]}
          onToggle={() => onToggleTeam(team.name)}
          teamMembers={teamMembers}
          tasks={tasks.filter((task) => task.team === team.name)}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onCellClick={onCellClick}
          onEditTask={onEditTask}
          onDuplicateTask={onDuplicateTask}
          onCopyLink={onCopyLink}
          onDeleteTask={(task) => onDeleteTask(task.id)}
          onViewTask={onViewTask}
        />
      ))}
    </div>
  );
};

export default TimelineContent;
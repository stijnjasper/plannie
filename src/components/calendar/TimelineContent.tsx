import { Task, TeamMember } from "@/types/calendar";
import TeamRow from "./TeamRow";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

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
  currentDate: Date;
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
  currentDate,
}: TimelineContentProps) => {
  const queryClient = useQueryClient();

  const { data: teams = [] } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      try {
        console.log('Fetching teams in TimelineContent');
        const { data, error } = await supabase
          .from('teams')
          .select('*')
          .order('order_index');
        
        if (error) {
          console.error('Error fetching teams:', error);
          throw error;
        }
        
        console.log('Teams fetched:', data);
        return data || [];
      } catch (error) {
        console.error('Error in teams query:', error);
        return [];
      }
    },
    retry: 1,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    const channel = supabase
      .channel('team-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'teams' },
        () => {
          console.log('Team change detected, invalidating teams query');
          queryClient.invalidateQueries({ queryKey: ['teams'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return (
    <div className="relative overflow-hidden rounded-lg bg-background shadow-sm transition-colors duration-200 dark:bg-background dark:[&]:bg-background">
      {teams.map((team) => {
        const teamMembers = teamMembers.filter(member => member.team === team.name);
        const teamTasks = tasks.filter(task => task.team === team.name);
        
        return (
          <TeamRow
            key={team.id}
            team={team.name}
            teamMembers={teamMembers}
            tasks={teamTasks}
            isOpen={openTeams[team.name] ?? true}
            onToggle={() => onToggleTeam(team.name)}
            onCellClick={onCellClick}
            onEditTask={onEditTask}
            onDuplicateTask={onDuplicateTask}
            onCopyLink={onCopyLink}
            onDeleteTask={onDeleteTask}
            onViewTask={onViewTask}
            currentDate={currentDate}
          />
        );
      })}
    </div>
  );
};

export default TimelineContent;
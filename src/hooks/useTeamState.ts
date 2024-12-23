import { useState, useEffect } from "react";
import { TeamMember } from "@/types/calendar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const useTeamState = () => {
  const [openTeams, setOpenTeams] = useState<Record<string, boolean>>({});
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const queryClient = useQueryClient();

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

  useEffect(() => {
    // Initialize openTeams state based on fetched teams
    const initialState: Record<string, boolean> = {};
    teams.forEach(team => {
      initialState[team.name] = true;
    });
    setOpenTeams(initialState);

    // Fetch team members
    const fetchMembers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching team members:', error);
        return;
      }

      const transformedMembers: TeamMember[] = data.map(member => ({
        ...member,
        status: member.status as "active" | "deactivated",
        name: member.full_name,
        title: member.team ? `${member.team} Team Member` : 'Team Member',
        avatar: member.avatar_url || '',
      }));

      setTeamMembers(transformedMembers);
    };

    fetchMembers();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('team-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'teams' },
        (payload) => {
          console.log('Team change detected:', payload);
          queryClient.invalidateQueries({ queryKey: ['teams'] });
          toast({
            title: "Team Update",
            description: "Team information has been updated",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [teams, queryClient]);

  const toggleTeam = (team: string) => {
    setOpenTeams((prev) => ({
      ...prev,
      [team]: !prev[team],
    }));
  };

  return {
    teamMembers,
    openTeams,
    toggleTeam,
  };
};
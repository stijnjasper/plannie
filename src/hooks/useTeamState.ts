import { useState, useEffect } from "react";
import { TeamMember } from "@/types/calendar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useTeamState = () => {
  const [openTeams, setOpenTeams] = useState<Record<string, boolean>>({});
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

  const { data: teamMembers = [] } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      // Fetch only active profiles with their associated team names
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          teams:team_id (
            name
          )
        `)
        .eq('status', 'active') // Only fetch active members
        .order('role', { ascending: true })
        .order('order_index', { ascending: true });

      if (error) throw error;

      return data.map(member => ({
        id: member.id,
        full_name: member.full_name || '',
        role: member.role,
        team_id: member.team_id,
        avatar_url: member.avatar_url,
        is_admin: member.is_admin || false,
        status: member.status as "active" | "deactivated",
        // UI specific aliases
        name: member.full_name || '',
        title: member.role ? `${member.role}` : 'Team Member',
        avatar: member.avatar_url || '',
        // Virtual team property from the joined teams table
        team: member.teams?.name || null,
      })) as TeamMember[];
    }
  });

  // Initialize openTeams state based on fetched teams
  useEffect(() => {
    const initialState: Record<string, boolean> = {};
    teams.forEach(team => {
      initialState[team.name] = true;
    });
    setOpenTeams(initialState);
  }, [teams]);

  // Set up realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['profiles'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

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
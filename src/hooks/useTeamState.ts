import { useState } from "react";
import { TeamMember } from "@/types/calendar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useTeamState = () => {
  const [teamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      full_name: "Sarah Chen",
      name: "Sarah Chen", // UI alias
      title: "Lead Designer",
      avatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
      avatar_url: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
      team: "Design",
      is_admin: false,
      status: "active"
    },
    {
      id: "2",
      full_name: "Mike Johnson",
      name: "Mike Johnson", // UI alias
      title: "Frontend Developer",
      avatar: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952",
      avatar_url: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952",
      team: "Development",
      is_admin: false,
      status: "active"
    },
    {
      id: "3",
      full_name: "Emma Davis",
      name: "Emma Davis", // UI alias
      title: "Marketing Manager",
      avatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      avatar_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      team: "Marketing",
      is_admin: false,
      status: "active"
    },
  ]);

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

  const [openTeams, setOpenTeams] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    teams.forEach(team => {
      initialState[team.name] = true;
    });
    return initialState;
  });

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
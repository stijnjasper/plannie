import { useState, useEffect } from "react";
import { TeamMember } from "@/types/calendar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useMemberManagement = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const { toast } = useToast();

  const fetchMembers = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          *,
          teams:team_id (
            name
          )
        `)
        .order('role', { ascending: true })
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error fetching profiles:', error);
        throw error;
      }

      if (!profiles) {
        setMembers([]);
        return;
      }

      const transformedMembers: TeamMember[] = profiles.map(profile => ({
        id: profile.id,
        full_name: profile.full_name || '',
        role: profile.role,
        team_id: profile.team_id,
        avatar_url: profile.avatar_url,
        is_admin: profile.is_admin || false,
        status: profile.status as "active" | "deactivated",
        name: profile.full_name || '',
        title: profile.role ? `${profile.role}` : 'Team Member',
        avatar: profile.avatar_url || '',
        team: profile.teams?.name || null,
      }));

      setMembers(transformedMembers);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast({
        title: "Error",
        description: "Could not load team members",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchMembers();

    const channel = supabase
      .channel('profiles-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        () => {
          fetchMembers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { destination } = result;
    const memberId = result.draggableId;

    try {
      // Get the team_id based on the team name
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .select('id')
        .eq('name', destination.droppableId)
        .single();

      if (teamError) throw teamError;

      const { error } = await supabase
        .from('profiles')
        .update({ team_id: teamData?.id })
        .eq('id', memberId);

      if (error) throw error;

      toast({
        description: "Team assignment updated successfully",
      });
      
      fetchMembers();
    } catch (error) {
      console.error('Error updating team assignment:', error);
      toast({
        title: "Error",
        description: "Could not update team assignment",
        variant: "destructive",
      });
    }
  };

  return {
    members,
    handleDragEnd,
  };
};
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
        .select('*')
        .order('team', { ascending: true })
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
        team: profile.team,
        avatar_url: profile.avatar_url,
        is_admin: profile.is_admin || false,
        status: profile.status as "active" | "deactivated",
        name: profile.full_name || '',
        title: profile.team ? `${profile.team} Team Member` : 'Team Member',
        avatar: profile.avatar_url || '',
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

    const { source, destination } = result;
    const team = destination.droppableId;
    const memberId = result.draggableId;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ team })
        .eq('id', memberId);

      if (error) throw error;

      toast({
        description: "Team assignment updated successfully",
      });
      
      // Refresh the members list
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
import { TeamMember } from "@/types/calendar";
import TeamSection from "./people/TeamSection";
import DeactivatedMembers from "./people/DeactivatedMembers";
import { DragDropContext } from "@hello-pangea/dnd";
import TeamManagement from "./people/TeamManagement";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Menu } from '@mantine/core';

const PeopleTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: members = [] } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      console.log('Fetching profiles...');
      const { data, error } = await supabase
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

      console.log('Fetched profiles:', data);

      return data.map(profile => ({
        ...profile,
        name: profile.full_name || '',
        title: profile.role ? `${profile.role}` : 'Team Member',
        avatar: profile.avatar_url || '',
        team: profile.teams?.name || null,
        status: profile.status as "active" | "deactivated",
        is_admin: Boolean(profile.is_admin)
      })) as TeamMember[];
    },
  });

  const activeMembers = members.filter(member => member.status === 'active');
  const deactivatedMembers = members.filter(member => member.status === 'deactivated');

  console.log('Active members:', activeMembers);
  console.log('Deactivated members:', deactivatedMembers);

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { destination, draggableId: memberId } = result;
    const newTeamId = destination.droppableId === 'unassigned' ? null : destination.droppableId;

    try {
      console.log('Updating team assignment:', { memberId, newTeamId });
      
      const { error } = await supabase
        .from('profiles')
        .update({ team_id: newTeamId })
        .eq('id', memberId);

      if (error) throw error;

      toast({
        description: "Team toewijzing succesvol bijgewerkt",
      });
      
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    } catch (error) {
      console.error('Error updating team assignment:', error);
      toast({
        title: "Error",
        description: "Kon team toewijzing niet updaten",
        variant: "destructive",
      });
    }
  };

  const handleToggleAdmin = async (memberId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !currentStatus })
        .eq('id', memberId);

      if (error) throw error;

      toast({
        description: `Admin status ${!currentStatus ? 'toegekend' : 'ingetrokken'}`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    } catch (error) {
      console.error('Error updating admin status:', error);
      toast({
        title: "Error",
        description: "Kon admin status niet updaten",
        variant: "destructive",
      });
    }
  };

  const handleDeactivate = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: 'deactivated' })
        .eq('id', memberId);

      if (error) throw error;

      toast({
        description: "Gebruiker succesvol gedeactiveerd",
      });
      
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    } catch (error) {
      console.error('Error deactivating member:', error);
      toast({
        title: "Error",
        description: "Kon gebruiker niet deactiveren",
        variant: "destructive",
      });
    }
  };

  const handleReactivate = async (memberId: string, teamId: string | null) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          status: 'active',
          team_id: teamId
        })
        .eq('id', memberId);

      if (error) throw error;

      toast({
        description: "Gebruiker succesvol gereactiveerd",
      });
      
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    } catch (error) {
      console.error('Error reactivating member:', error);
      toast({
        title: "Error",
        description: "Kon gebruiker niet reactiveren",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Menu.Dropdown />
      <TeamManagement />
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <TeamSection 
          activeMembers={activeMembers} 
          onToggleAdmin={handleToggleAdmin}
          onDeactivate={handleDeactivate}
        />
      </DragDropContext>

      <DeactivatedMembers
        members={deactivatedMembers}
        onReactivate={handleReactivate}
      />
    </div>
  );
};

export default PeopleTab;
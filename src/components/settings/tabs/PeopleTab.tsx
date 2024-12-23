import { TeamMember } from "@/types/calendar";
import TeamSection from "./people/TeamSection";
import DeactivatedMembers from "./people/DeactivatedMembers";
import { DragDropContext } from "@hello-pangea/dnd";
import TeamManagement from "./people/TeamManagement";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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
        .order('team_id', { ascending: true })
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
        is_admin: profile.is_admin || false,
      })) as TeamMember[];
    },
  });

  const activeMembers = members.filter(member => member.status === 'active');
  const deactivatedMembers = members.filter(member => member.status === 'deactivated');

  console.log('Active members:', activeMembers);
  console.log('Deactivated members:', deactivatedMembers);

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    try {
      let teamId = null;
      
      // Only look up team ID if not "Unassigned"
      if (destination.droppableId !== 'Unassigned') {
        const { data: teamData, error: teamError } = await supabase
          .from('teams')
          .select('id')
          .eq('name', destination.droppableId)
          .maybeSingle();

        if (teamError) throw teamError;
        if (teamData) {
          teamId = teamData.id;
        }
      }

      const { error } = await supabase
        .from('profiles')
        .update({ team_id: teamId })
        .eq('id', draggableId);

      if (error) throw error;

      toast({
        description: "Team assignment updated successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    } catch (error) {
      console.error('Error updating team assignment:', error);
      toast({
        title: "Error",
        description: "Could not update team assignment",
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
        description: `Admin status ${!currentStatus ? 'granted' : 'revoked'} successfully`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    } catch (error) {
      console.error('Error updating admin status:', error);
      toast({
        title: "Error",
        description: "Could not update admin status",
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
        description: "Member deactivated successfully",
      });
      
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    } catch (error) {
      console.error('Error deactivating member:', error);
      toast({
        title: "Error",
        description: "Could not deactivate member",
        variant: "destructive",
      });
    }
  };

  const handleReactivate = async (memberId: string, team: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: 'active', team })
        .eq('id', memberId);

      if (error) throw error;

      toast({
        description: "Member reactivated successfully",
      });
      
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    } catch (error) {
      console.error('Error reactivating member:', error);
      toast({
        title: "Error",
        description: "Could not reactivate member",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
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
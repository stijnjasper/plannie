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

  // Fetch all members
  const { data: members = [] } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('team', { ascending: true })
        .order('order_index', { ascending: true });

      if (error) throw error;

      return data.map(profile => ({
        ...profile,
        name: profile.full_name || '',
        title: profile.team ? `${profile.team} Team Member` : 'Team Member',
        avatar: profile.avatar_url || '',
      }));
    },
  });

  const activeMembers = members.filter(member => member.status === 'active');
  const deactivatedMembers = members.filter(member => member.status === 'deactivated');

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    const newTeam = destination.droppableId === 'unassigned' ? null : destination.droppableId;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ team: newTeam })
        .eq('id', draggableId);

      if (error) throw error;

      toast({
        description: "Team assignment updated successfully",
      });

      // Refresh the members list
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
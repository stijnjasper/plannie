import { TeamMember } from "@/types/calendar";
import TeamSection from "./people/TeamSection";
import DeactivatedMembers from "./people/DeactivatedMembers";
import { DragDropContext } from "@hello-pangea/dnd";
import TeamManagement from "./people/TeamManagement";
import { useMemberManagement } from "@/hooks/useMemberManagement";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PeopleTab = () => {
  const { members, handleDragEnd } = useMemberManagement();
  const { toast } = useToast();

  const activeMembers = members.filter(member => member.status === 'active');
  const deactivatedMembers = members.filter(member => member.status === 'deactivated');

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
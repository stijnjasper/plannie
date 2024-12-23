import { TeamMember } from "@/types/calendar";
import TeamSection from "./people/TeamSection";
import DeactivatedMembers from "./people/DeactivatedMembers";
import { DragDropContext } from "@hello-pangea/dnd";
import TeamManagement from "./people/TeamManagement";
import { useMemberManagement } from "@/hooks/useMemberManagement";
import { useToast } from "@/hooks/use-toast";

const PeopleTab = () => {
  const { members, handleDragEnd } = useMemberManagement();
  const { toast } = useToast();

  const activeMembers = members.filter(member => member.status === 'active');
  const deactivatedMembers = members.filter(member => member.status === 'deactivated');

  return (
    <div className="space-y-6">
      <TeamManagement />
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <TeamSection
          activeMembers={activeMembers}
          onToggleAdmin={(memberId, currentStatus) => {
            const updatedStatus = !currentStatus;
            // Update admin status in the database
            supabase
              .from('profiles')
              .update({ is_admin: updatedStatus })
              .eq('id', memberId)
              .then(() => {
                toast({
                  description: `Admin status ${updatedStatus ? 'granted' : 'revoked'} successfully`,
                });
              })
              .catch((error) => {
                console.error('Error updating admin status:', error);
                toast({
                  title: "Error",
                  description: "Could not update admin status",
                  variant: "destructive",
                });
              });
          }}
          onDeactivate={(memberId) => {
            supabase
              .from('profiles')
              .update({ status: 'deactivated' })
              .eq('id', memberId)
              .then(() => {
                toast({
                  description: "Member deactivated successfully",
                });
              })
              .catch((error) => {
                console.error('Error deactivating member:', error);
                toast({
                  title: "Error",
                  description: "Could not deactivate member",
                  variant: "destructive",
                });
              });
          }}
        />
      </DragDropContext>

      <DeactivatedMembers
        members={deactivatedMembers}
        onReactivate={(memberId, team) => {
          supabase
            .from('profiles')
            .update({ status: 'active', team })
            .eq('id', memberId)
            .then(() => {
              toast({
                description: "Member reactivated successfully",
              });
            })
            .catch((error) => {
              console.error('Error reactivating member:', error);
              toast({
                title: "Error",
                description: "Could not reactivate member",
                variant: "destructive",
              });
            });
        }}
      />
    </div>
  );
};

export default PeopleTab;

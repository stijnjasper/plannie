import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TeamMember } from "@/types/calendar";
import TeamSection from "./people/TeamSection";
import DeactivatedMembers from "./people/DeactivatedMembers";
import { DragDropContext } from "@hello-pangea/dnd";
import TeamManagement from "./people/TeamManagement";

const PeopleTab = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const { toast } = useToast();

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

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('team', { ascending: true })
        .order('order_index', { ascending: true });

      if (error) throw error;

      const transformedMembers: TeamMember[] = data.map(member => ({
        ...member,
        status: member.status as "active" | "deactivated",
        name: member.full_name,
        title: member.team ? `${member.team} Team Member` : 'Team Member',
        avatar: member.avatar_url || '',
      }));

      setMembers(transformedMembers);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast({
        title: "Error",
        description: "Kon teamleden niet laden",
        variant: "destructive",
      });
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const team = source.droppableId;
    const teamMembers = members.filter(m => m.team === team && m.status === 'active');
    const [reorderedMember] = teamMembers.splice(source.index, 1);
    teamMembers.splice(destination.index, 0, reorderedMember);

    const updates = teamMembers.map((member, index) => ({
      id: member.id,
      order_index: index + 1
    }));

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert(updates);

      if (error) throw error;

      toast({
        description: "Volgorde succesvol bijgewerkt",
      });
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "Kon volgorde niet bijwerken",
        variant: "destructive",
      });
    }
  };

  const activeMembers = members.filter(member => member.status === 'active');
  const deactivatedMembers = members.filter(member => member.status === 'deactivated');

  return (
    <div className="space-y-6">
      <TeamManagement />
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <TeamSection
          activeMembers={activeMembers}
          onToggleAdmin={(memberId, currentStatus) => {
            const toggleAdmin = async () => {
              try {
                const { error } = await supabase
                  .from('profiles')
                  .update({ is_admin: !currentStatus })
                  .eq('id', memberId);

                if (error) throw error;

                setMembers(members.map(member => 
                  member.id === memberId 
                    ? { ...member, is_admin: !currentStatus }
                    : member
                ));

                toast({
                  title: "Success",
                  description: `Admin status ${!currentStatus ? 'granted' : 'revoked'} successfully`,
                });
              } catch (error) {
                console.error('Error updating admin status:', error);
                toast({
                  title: "Error",
                  description: "Kon admin status niet bijwerken",
                  variant: "destructive",
                });
              }
            };
            toggleAdmin();
          }}
          onDeactivate={(memberId) => {
            const deactivateMember = async () => {
              try {
                const { error } = await supabase
                  .from('profiles')
                  .update({ status: 'deactivated' })
                  .eq('id', memberId);

                if (error) throw error;

                setMembers(members.map(member =>
                  member.id === memberId
                    ? { ...member, status: "deactivated" }
                    : member
                ));

                toast({
                  title: "Success",
                  description: "Lid succesvol gedeactiveerd",
                });
              } catch (error) {
                console.error('Error deactivating member:', error);
                toast({
                  title: "Error",
                  description: "Kon lid niet deactiveren",
                  variant: "destructive",
                });
              }
            };
            deactivateMember();
          }}
        />
      </DragDropContext>

      <DeactivatedMembers
        members={deactivatedMembers}
        onReactivate={(memberId, team) => {
          const reactivateMember = async () => {
            try {
              const { error } = await supabase
                .from('profiles')
                .update({ status: 'active', team })
                .eq('id', memberId);

              if (error) throw error;

              setMembers(members.map(member =>
                member.id === memberId
                  ? { ...member, status: "active", team }
                  : member
              ));

              toast({
                title: "Success",
                description: "Lid succesvol geheractiveerd",
              });
            } catch (error) {
              console.error('Error reactivating member:', error);
              toast({
                title: "Error",
                description: "Kon lid niet heractiveren",
                variant: "destructive",
              });
            }
          };
          reactivateMember();
        }}
      />
    </div>
  );
};

export default PeopleTab;

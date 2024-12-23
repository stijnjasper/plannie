import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TeamMember } from "@/types/calendar";
import TeamSection from "./people/TeamSection";
import DeactivatedMembers from "./people/DeactivatedMembers";

const PeopleTab = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchMembers();

    // Subscribe to realtime updates for profiles
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
        .order('team', { ascending: true });

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
        description: "Could not load team members",
        variant: "destructive",
      });
    }
  };

  const toggleAdminStatus = async (memberId: string, currentStatus: boolean) => {
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
        description: "Could not update admin status",
        variant: "destructive",
      });
    }
  };

  const deactivateMember = async (memberId: string) => {
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

  const reactivateMember = async (memberId: string, team: string) => {
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

  const activeMembers = members.filter(member => member.status === 'active');
  const deactivatedMembers = members.filter(member => member.status === 'deactivated');

  return (
    <div className="space-y-6">
      <TeamSection
        activeMembers={activeMembers}
        onToggleAdmin={toggleAdminStatus}
        onDeactivate={deactivateMember}
      />

      <DeactivatedMembers
        members={deactivatedMembers}
        onReactivate={reactivateMember}
      />
    </div>
  );
};

export default PeopleTab;
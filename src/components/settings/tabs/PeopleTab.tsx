import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { TeamMember } from "@/types/calendar";
import TeamMemberList from "./people/TeamMemberList";
import DeactivatedMembers from "./people/DeactivatedMembers";

const PeopleTab = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('team', { ascending: true });

      if (error) throw error;

      // Ensure the status is of type "active" | "deactivated"
      const typedMembers = data.map(member => ({
        ...member,
        status: member.status as "active" | "deactivated"
      }));

      setMembers(typedMembers);
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
  const teams = Array.from(new Set(activeMembers.map(member => member.team).filter(Boolean)));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Active Teams</h3>
        {teams.map(team => (
          <div key={team} className="mb-6">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">{team}</h4>
            <TeamMemberList
              members={activeMembers.filter(member => member.team === team)}
              onToggleAdmin={toggleAdminStatus}
              onDeactivate={deactivateMember}
            />
            <Button variant="outline" size="sm" className="w-full mt-2">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Member to {team}
            </Button>
          </div>
        ))}
      </div>

      <DeactivatedMembers
        members={deactivatedMembers}
        onReactivate={reactivateMember}
      />
    </div>
  );
};

export default PeopleTab;
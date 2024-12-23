import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { TeamMember } from "@/types/calendar";
import TeamMemberList from "./people/TeamMemberList";
import DeactivatedMembers from "./people/DeactivatedMembers";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface Team {
  id: string;
  name: string;
  color: string;
  order_index: number;
}

const PeopleTab = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch teams using React Query
  const { data: teams = [] } = useQuery<Team[]>({
    queryKey: ['teams'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('order_index');
      
      if (error) throw error;
      return data;
    }
  });

  useEffect(() => {
    fetchMembers();

    // Subscribe to realtime updates for teams
    const channel = supabase
      .channel('teams-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'teams' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['teams'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('team', { ascending: true });

      if (error) throw error;

      // Transform the data to match TeamMember interface
      const transformedMembers: TeamMember[] = data.map(member => ({
        ...member,
        status: member.status as "active" | "deactivated",
        // UI-specific aliases
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

  const handleAddTeam = async (teamName: string) => {
    try {
      const { error } = await supabase
        .from('teams')
        .insert({
          name: teamName,
          order_index: teams.length + 1
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Team "${teamName}" has been created`,
      });
    } catch (error) {
      console.error('Error adding team:', error);
      toast({
        title: "Error",
        description: "Could not create team",
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
      <div>
        <h3 className="text-lg font-medium mb-4">Active Teams</h3>
        {teams.map(team => (
          <div key={team.id} className="mb-6">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">{team.name}</h4>
            <TeamMemberList
              members={activeMembers.filter(member => member.team === team.name)}
              onToggleAdmin={toggleAdminStatus}
              onDeactivate={deactivateMember}
            />
            <Button variant="outline" size="sm" className="w-full mt-2">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Member to {team.name}
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
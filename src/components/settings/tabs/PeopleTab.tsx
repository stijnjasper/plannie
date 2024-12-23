import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, UserX, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface TeamMember {
  id: string;
  full_name: string;
  team: string | null;
  is_admin: boolean;
  status: 'active' | 'deactivated';
}

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
      setMembers(data || []);
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
          ? { ...member, status: 'deactivated' }
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
          ? { ...member, status: 'active', team }
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
            <div className="space-y-2">
              {activeMembers
                .filter(member => member.team === team)
                .map(member => (
                  <div key={member.id} className="flex items-center justify-between p-2 rounded-md border">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{member.full_name}</span>
                      {member.is_admin && (
                        <Badge variant="secondary" className="ml-2">
                          Admin
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={member.is_admin}
                          onCheckedChange={() => toggleAdminStatus(member.id, member.is_admin)}
                        />
                        <span className="text-sm text-muted-foreground">Admin</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deactivateMember(member.id)}
                      >
                        <UserX className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              <Button variant="outline" size="sm" className="w-full mt-2">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Member to {team}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {deactivatedMembers.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Deactivated Members</h3>
          <div className="space-y-2">
            {deactivatedMembers.map(member => (
              <div key={member.id} className="flex items-center justify-between p-2 rounded-md border bg-muted/50">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{member.full_name}</span>
                  <span className="text-sm text-muted-foreground">
                    (Previously: {member.team || 'No team'})
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => reactivateMember(member.id, member.team || '')}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Reactivate
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PeopleTab;
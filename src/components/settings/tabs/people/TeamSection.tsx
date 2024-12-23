import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { TeamMember } from "@/types/calendar";
import TeamMemberList from "./TeamMemberList";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface Team {
  id: string;
  name: string;
  color: string;
  order_index: number;
}

interface TeamSectionProps {
  activeMembers: TeamMember[];
  onToggleAdmin: (memberId: string, currentStatus: boolean) => void;
  onDeactivate: (memberId: string) => void;
}

const TeamSection = ({ activeMembers, onToggleAdmin, onDeactivate }: TeamSectionProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
      
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    } catch (error) {
      console.error('Error adding team:', error);
      toast({
        title: "Error",
        description: "Could not create team",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Active Teams</h3>
      {teams.map(team => (
        <div key={team.id} className="mb-6">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">{team.name}</h4>
          <TeamMemberList
            members={activeMembers.filter(member => member.team === team.name)}
            onToggleAdmin={onToggleAdmin}
            onDeactivate={onDeactivate}
          />
          <Button variant="outline" size="sm" className="w-full mt-2">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Member to {team.name}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default TeamSection;
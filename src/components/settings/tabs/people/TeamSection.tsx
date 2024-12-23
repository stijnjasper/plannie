import { TeamMember } from "@/types/calendar";
import { Droppable } from "@hello-pangea/dnd";
import TeamMemberList from "./TeamMemberList";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface TeamSectionProps {
  activeMembers: TeamMember[];
  onToggleAdmin: (memberId: string, currentStatus: boolean) => Promise<void>;
  onDeactivate: (memberId: string) => Promise<void>;
}

const TeamSection = ({ activeMembers, onToggleAdmin, onDeactivate }: TeamSectionProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Group members by team
  const membersByTeam = activeMembers.reduce((acc, member) => {
    const team = member.team || 'Unassigned';
    if (!acc[team]) {
      acc[team] = [];
    }
    acc[team].push(member);
    return acc;
  }, {} as Record<string, TeamMember[]>);

  const handleDeleteTeam = async (teamName: string) => {
    try {
      // Get team ID first
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .select('id')
        .eq('name', teamName)
        .single();

      if (teamError) throw teamError;

      // Update all members of this team to Unassigned (null team_id)
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ team_id: null })
        .eq('team_id', teamData.id);

      if (updateError) throw updateError;

      // Delete the team
      const { error: deleteError } = await supabase
        .from('teams')
        .delete()
        .eq('id', teamData.id);

      if (deleteError) throw deleteError;

      toast({
        description: "Team succesvol verwijderd",
      });

      // Refresh the data
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    } catch (error) {
      console.error('Error deleting team:', error);
      toast({
        title: "Error",
        description: "Kon team niet verwijderen",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {Object.entries(membersByTeam).map(([team, members]) => (
        <div key={team} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{team}</h3>
            {team !== 'Unassigned' && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => handleDeleteTeam(team)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          <Droppable droppableId={team}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-2"
              >
                <TeamMemberList 
                  members={members} 
                  onToggleAdmin={onToggleAdmin}
                  onDeactivate={onDeactivate}
                />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      ))}
    </div>
  );
};

export default TeamSection;
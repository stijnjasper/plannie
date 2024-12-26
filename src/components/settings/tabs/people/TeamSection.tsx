import { TeamMember } from "@/types/calendar";
import { Droppable } from "@hello-pangea/dnd";
import TeamMemberList from "./TeamMemberList";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useNavigate } from "react-router-dom";

interface TeamSectionProps {
  activeMembers: TeamMember[];
  onToggleAdmin: (memberId: string, currentStatus: boolean) => Promise<void>;
  onDeactivate: (memberId: string) => Promise<void>;
}

const TeamSection = ({ activeMembers, onToggleAdmin, onDeactivate }: TeamSectionProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Add hotkey for settings
  useHotkeys('cmd+shift+,', () => {
    navigate('/settings');
  }, { preventDefault: true });

  const { data: teams = [] } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      console.log('Fetching teams in TeamSection');
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('order_index');
      
      if (error) {
        console.error('Error fetching teams:', error);
        throw error;
      }
      
      console.log('Teams fetched successfully:', data);
      return data;
    }
  });

  // Group members by team
  const membersByTeam = activeMembers.reduce((acc, member) => {
    const team = member.team || 'Unassigned';
    if (!acc[team]) {
      acc[team] = [];
    }
    acc[team].push(member);
    return acc;
  }, {} as Record<string, TeamMember[]>);

  // Add empty arrays for teams with no members
  teams.forEach(team => {
    if (!membersByTeam[team.name]) {
      membersByTeam[team.name] = [];
    }
  });

  // Make sure Unassigned is always present
  if (!membersByTeam['Unassigned']) {
    membersByTeam['Unassigned'] = [];
  }

  const handleDeleteTeam = async (teamName: string) => {
    try {
      console.log('Attempting to delete team:', teamName);
      
      // Get team with this name
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .select('id')
        .eq('name', teamName)
        .maybeSingle();

      if (teamError) {
        console.error('Error finding team to delete:', teamError);
        throw teamError;
      }
      
      if (!teamData) {
        console.log('Team not found:', teamName);
        toast({
          title: "Error",
          description: "Team not found",
          variant: "destructive",
        });
        return;
      }

      console.log('Found team to delete:', teamData);

      // Update all members of this team to Unassigned (null team_id)
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ team_id: null })
        .eq('team_id', teamData.id);

      if (updateError) {
        console.error('Error updating team members:', updateError);
        throw updateError;
      }

      console.log('Updated team members to Unassigned');

      // Delete the team
      const { error: deleteError } = await supabase
        .from('teams')
        .delete()
        .eq('id', teamData.id);

      if (deleteError) {
        console.error('Error deleting team:', deleteError);
        throw deleteError;
      }

      console.log('Team deleted successfully');
      toast({
        description: "Team succesvol verwijderd",
      });

      // Refresh the data
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    } catch (error) {
      console.error('Error in handleDeleteTeam:', error);
      toast({
        title: "Error",
        description: "Kon team niet verwijderen",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {teams.map((team) => {
        const teamMembers = membersByTeam[team.name] || [];
        
        return (
          <div key={team.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{team.name}</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => handleDeleteTeam(team.name)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <Droppable droppableId={team.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-2"
                >
                  <TeamMemberList 
                    members={teamMembers} 
                    onToggleAdmin={onToggleAdmin}
                    onDeactivate={onDeactivate}
                  />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        );
      })}

      {/* Unassigned Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Unassigned</h3>
        <Droppable droppableId="unassigned">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-2"
            >
              <TeamMemberList 
                members={membersByTeam['Unassigned'] || []} 
                onToggleAdmin={onToggleAdmin}
                onDeactivate={onDeactivate}
              />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
};

export default TeamSection;
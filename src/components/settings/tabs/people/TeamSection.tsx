import { TeamMember } from "@/types/calendar";
import { Droppable } from "@hello-pangea/dnd";
import TeamMemberList from "./TeamMemberList";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useHotkeys } from "react-hotkeys-hook";
import { useNavigate } from "react-router-dom";
import { deleteTeam } from "@/utils/teamManagement";
import EmptyTeamState from "./EmptyTeamState";

interface TeamSectionProps {
  activeMembers: TeamMember[];
  onToggleAdmin: (memberId: string, currentStatus: boolean) => Promise<void>;
  onDeactivate: (memberId: string) => Promise<void>;
}

const TeamSection = ({ activeMembers, onToggleAdmin, onDeactivate }: TeamSectionProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useHotkeys('cmd+shift+,', (e) => {
    e.preventDefault();
    const settingsButton = document.querySelector('[aria-label="Settings"]') as HTMLButtonElement;
    if (settingsButton) {
      settingsButton.click();
    }
  });

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return profile;
    }
  });

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

  const validMembers = activeMembers.filter(member => 
    member && 
    member.id && 
    member.full_name && 
    typeof member.full_name === 'string'
  );

  const membersByTeam = validMembers.reduce((acc, member) => {
    const team = member.team || 'Unassigned';
    if (!acc[team]) {
      acc[team] = [];
    }
    acc[team].push(member);
    return acc;
  }, {} as Record<string, TeamMember[]>);

  teams.forEach(team => {
    if (!membersByTeam[team.name]) {
      membersByTeam[team.name] = [];
    }
  });

  if (!membersByTeam['Unassigned']) {
    membersByTeam['Unassigned'] = [];
  }

  const handleDeleteTeam = async (teamId: string) => {
    const success = await deleteTeam(teamId);
    if (success) {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    }
  };

  const isAdmin = currentUser?.is_admin ?? false;

  return (
    <div className="space-y-6">
      {teams.map((team) => {
        const teamMembers = membersByTeam[team.name] || [];
        
        return (
          <div key={team.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{team.name}</h3>
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleDeleteTeam(team.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <Droppable droppableId={team.id} isDropDisabled={!isAdmin}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`space-y-2 ${!isAdmin ? 'cursor-not-allowed' : ''}`}
                >
                  {teamMembers.length === 0 ? (
                    <EmptyTeamState />
                  ) : (
                    <TeamMemberList 
                      members={teamMembers}
                      isAdmin={isAdmin}
                      onToggleAdmin={onToggleAdmin}
                      onDeactivate={onDeactivate}
                    />
                  )}
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
        <Droppable droppableId="unassigned" isDropDisabled={!isAdmin}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`space-y-2 ${!isAdmin ? 'cursor-not-allowed' : ''}`}
            >
              {membersByTeam['Unassigned'].length === 0 ? (
                <EmptyTeamState />
              ) : (
                <TeamMemberList 
                  members={membersByTeam['Unassigned'] || []}
                  isAdmin={isAdmin}
                  onToggleAdmin={onToggleAdmin}
                  onDeactivate={onDeactivate}
                />
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
};

export default TeamSection;
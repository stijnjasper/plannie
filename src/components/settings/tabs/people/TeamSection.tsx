import { Button } from "@/components/ui/button";
import { TeamMember } from "@/types/calendar";
import TeamMemberList from "./TeamMemberList";
import { Droppable } from "@hello-pangea/dnd";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TeamSectionProps {
  activeMembers: TeamMember[];
  onToggleAdmin: (memberId: string, currentStatus: boolean) => void;
  onDeactivate: (memberId: string) => void;
}

const TeamSection = ({ activeMembers, onToggleAdmin, onDeactivate }: TeamSectionProps) => {
  const { data: teams = [] } = useQuery({
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

  // Get unassigned members (those without a team)
  const unassignedMembers = activeMembers.filter(member => !member.team);

  const getTeamHeight = (memberCount: number) => {
    const baseHeight = 90; // Base height for team header
    const memberHeight = 60; // Height per team member
    const padding = 32; // Additional padding
    return Math.max(baseHeight, (memberCount * memberHeight) + padding);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
        {/* Unassigned Members Section */}
        <Droppable droppableId="unassigned">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{ height: getTeamHeight(unassignedMembers.length) }}
              className={`bg-card p-4 rounded-lg border transition-colors duration-200
                ${snapshot.isDraggingOver ? 'border-primary/50 bg-accent/50' : 'border-border hover:bg-accent/20'}`}
            >
              <h4 className="text-sm font-medium text-muted-foreground mb-4">Geen team toegewezen</h4>
              <ScrollArea className="h-[calc(100%-2rem)]">
                <TeamMemberList
                  members={unassignedMembers}
                  onToggleAdmin={onToggleAdmin}
                  onDeactivate={onDeactivate}
                />
                {provided.placeholder}
              </ScrollArea>
            </div>
          )}
        </Droppable>

        {/* Team Columns */}
        {teams.map(team => {
          const teamMembers = activeMembers.filter(member => member.team === team.name);
          return (
            <Droppable key={team.id} droppableId={team.name}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{ height: getTeamHeight(teamMembers.length) }}
                  className={`bg-card p-4 rounded-lg border transition-colors duration-200
                    ${snapshot.isDraggingOver ? 'border-primary/50 bg-accent/50' : 'border-border hover:bg-accent/20'}`}
                >
                  <h4 className="text-sm font-medium text-muted-foreground mb-4">{team.name}</h4>
                  <ScrollArea className="h-[calc(100%-2rem)]">
                    <TeamMemberList
                      members={teamMembers}
                      onToggleAdmin={onToggleAdmin}
                      onDeactivate={onDeactivate}
                    />
                    {provided.placeholder}
                  </ScrollArea>
                </div>
              )}
            </Droppable>
          );
        })}
      </div>
    </div>
  );
};

export default TeamSection;
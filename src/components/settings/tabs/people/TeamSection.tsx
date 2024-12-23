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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
        {/* Unassigned Members Section */}
        <Droppable droppableId="unassigned">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="bg-card p-4 rounded-lg border min-h-[200px]"
            >
              <h4 className="text-sm font-medium text-muted-foreground mb-4">Geen team toegewezen</h4>
              <ScrollArea className="h-[400px]">
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
        {teams.map(team => (
          <Droppable key={team.id} droppableId={team.name}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-card p-4 rounded-lg border min-h-[200px]"
              >
                <h4 className="text-sm font-medium text-muted-foreground mb-4">{team.name}</h4>
                <ScrollArea className="h-[400px]">
                  <TeamMemberList
                    members={activeMembers.filter(member => member.team === team.name)}
                    onToggleAdmin={onToggleAdmin}
                    onDeactivate={onDeactivate}
                  />
                  {provided.placeholder}
                </ScrollArea>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </div>
  );
};

export default TeamSection;
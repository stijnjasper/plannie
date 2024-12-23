import { Button } from "@/components/ui/button";
import { TeamMember } from "@/types/calendar";
import TeamMemberList from "./TeamMemberList";
import { Droppable } from "@hello-pangea/dnd";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Active Teams</h3>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
        {teams.map(team => (
          <Droppable key={team.id} droppableId={team.name}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-card p-4 rounded-lg border"
              >
                <h4 className="text-sm font-medium text-muted-foreground mb-4">{team.name}</h4>
                <TeamMemberList
                  members={activeMembers.filter(member => member.team === team.name)}
                  onToggleAdmin={onToggleAdmin}
                  onDeactivate={onDeactivate}
                />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </div>
  );
};

export default TeamSection;
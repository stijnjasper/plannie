import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { TeamMember } from "@/types/calendar";
import TeamMemberList from "./TeamMemberList";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Droppable } from "@hello-pangea/dnd";

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

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Active Teams</h3>
      {teams.map(team => (
        <Droppable key={team.id} droppableId={team.name}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="mb-6"
            >
              <h4 className="text-sm font-medium text-muted-foreground mb-2">{team.name}</h4>
              <TeamMemberList
                members={activeMembers.filter(member => member.team === team.name)}
                onToggleAdmin={onToggleAdmin}
                onDeactivate={onDeactivate}
              />
              {provided.placeholder}
              <Button variant="outline" size="sm" className="w-full mt-2">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Member to {team.name}
              </Button>
            </div>
          )}
        </Droppable>
      ))}
    </div>
  );
};

export default TeamSection;
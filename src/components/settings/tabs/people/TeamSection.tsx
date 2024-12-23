import { Button } from "@/components/ui/button";
import { TeamMember } from "@/types/calendar";
import TeamMemberList from "./TeamMemberList";
import { Droppable } from "@hello-pangea/dnd";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

  const handleTeamChange = async (memberId: string, newTeam: string | null) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ team: newTeam })
        .eq('id', memberId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating team:', error);
    }
  };

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
              <div className="space-y-2">
                {activeMembers.map((member, index) => (
                  <div key={member.id} className="flex items-center justify-between p-2 rounded-md border bg-background">
                    <span>{member.full_name}</span>
                    <Select
                      value={member.team || "unassigned"}
                      onValueChange={(value) => handleTeamChange(member.id, value === "unassigned" ? null : value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select team" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">No team</SelectItem>
                        {teams.map((t) => (
                          <SelectItem key={t.id} value={t.name}>
                            {t.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      ))}
    </div>
  );
};

export default TeamSection;
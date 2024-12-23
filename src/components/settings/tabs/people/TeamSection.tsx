import { TeamMember } from "@/types/calendar";
import { Droppable } from "@hello-pangea/dnd";
import TeamMemberList from "./TeamMemberList";

interface TeamSectionProps {
  activeMembers: TeamMember[];
  onToggleAdmin: (memberId: string, currentStatus: boolean) => Promise<void>;
  onDeactivate: (memberId: string) => Promise<void>;
}

const TeamSection = ({ activeMembers, onToggleAdmin, onDeactivate }: TeamSectionProps) => {
  // Group members by team
  const membersByTeam = activeMembers.reduce((acc, member) => {
    const team = member.team || 'Unassigned';
    if (!acc[team]) {
      acc[team] = [];
    }
    acc[team].push(member);
    return acc;
  }, {} as Record<string, TeamMember[]>);

  return (
    <div className="space-y-6">
      {Object.entries(membersByTeam).map(([team, members]) => (
        <div key={team} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{team}</h3>
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
import { TeamMember } from "@/types/calendar";
import { Droppable } from "@hello-pangea/dnd";
import TeamMemberList from "./TeamMemberList";

interface TeamSectionProps {
  teamId: string | null;
  teamName: string;
  teamColor: string;
  members: TeamMember[];
}

const TeamSection = ({ teamId, teamName, teamColor, members }: TeamSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{teamName}</h3>
        <div className={`h-3 w-3 rounded-full ${teamColor}`} />
      </div>

      <Droppable droppableId={teamId || "no-team"}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-2 min-h-[100px]"
          >
            <TeamMemberList members={members} />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TeamSection;
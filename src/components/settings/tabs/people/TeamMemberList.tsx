import { TeamMember } from "@/types/calendar";
import { Draggable } from "@hello-pangea/dnd";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TeamMemberListProps {
  members: TeamMember[];
}

const TeamMemberList = ({ members }: TeamMemberListProps) => {
  return (
    <>
      {members.map((member, index) => (
        <Draggable key={member.id} draggableId={member.id} index={index}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className="flex items-center gap-3 rounded-lg border bg-card p-3 text-card-foreground shadow-sm"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src={member.avatar_url || undefined} alt={member.full_name} />
                <AvatarFallback>{member.full_name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{member.full_name}</p>
                <p className="text-sm text-muted-foreground">{member.role || "Geen functie"}</p>
              </div>
            </div>
          )}
        </Draggable>
      ))}
    </>
  );
};

export default TeamMemberList;
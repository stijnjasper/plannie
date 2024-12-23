import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TeamMember } from "@/types/calendar";

interface TeamMemberListProps {
  teamMembers: TeamMember[];
  team: string;
}

const TeamMemberList = ({ teamMembers, team }: TeamMemberListProps) => {
  return (
    <div className="team-member-list border-r border-b last:border-b-0 p-4 border-border bg-background dark:bg-background">
      {teamMembers
        .filter((member) => member.team === team)
        .map((member) => (
          <div key={member.id} className="flex items-center gap-3 mb-4 last:mb-0">
            <Avatar>
              <AvatarImage src={member.avatar_url || member.avatar} alt={member.full_name} />
              <AvatarFallback>{member.full_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="text-left">
              <div className="font-medium text-sm text-foreground dark:text-gray-100">{member.full_name}</div>
              <div className="text-xs text-muted-foreground dark:text-gray-400">{member.title}</div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default TeamMemberList;
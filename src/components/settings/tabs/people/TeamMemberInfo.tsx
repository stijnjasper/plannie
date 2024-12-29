import { TeamMember } from "@/types/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TeamMemberInfoProps {
  member: TeamMember;
}

const TeamMemberInfo = ({ member }: TeamMemberInfoProps) => {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-9 w-9">
        <AvatarImage src={member.avatar_url || undefined} alt={member.full_name} />
        <AvatarFallback>{member.full_name?.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none">{member.full_name}</p>
        <p className="text-sm text-muted-foreground">{member.role || "Geen functie"}</p>
      </div>
    </div>
  );
};

export default TeamMemberInfo;
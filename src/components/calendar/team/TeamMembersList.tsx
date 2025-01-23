import { TeamMember } from "@/types/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TeamMembersListProps {
  member: TeamMember;
}

const TeamMembersList = ({ member }: TeamMembersListProps) => {
  return (
    <div className="p-4 flex items-start bg-background border-r border-b border-border h-full">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={member.avatar_url || member.avatar} alt={member.full_name} />
          <AvatarFallback>{member.full_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div className="text-left">
          <div className="font-medium text-sm text-foreground dark:text-gray-100">{member.full_name}</div>
          <div className="text-xs text-muted-foreground dark:text-gray-400">{member.title}</div>
        </div>
      </div>
    </div>
  );
};

export default TeamMembersList;
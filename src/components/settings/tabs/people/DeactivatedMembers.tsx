import { Button } from "@/components/ui/button";
import { TeamMember } from "@/types/calendar";
import { User, UserPlus } from "lucide-react";

interface DeactivatedMembersProps {
  members: TeamMember[];
  onReactivate: (memberId: string, teamId: string | null) => void;
}

const DeactivatedMembers = ({ members, onReactivate }: DeactivatedMembersProps) => {
  if (members.length === 0) return null;

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Deactivated Members</h3>
      <div className="space-y-2">
        {members.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-2 rounded-md border bg-muted/50">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{member.full_name}</span>
              <span className="text-sm text-muted-foreground">
                (Previously: {member.team || 'No team'})
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReactivate(member.id, member.team_id)}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Reactivate
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeactivatedMembers;
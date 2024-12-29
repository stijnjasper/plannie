import { TeamMember } from "@/types/calendar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Shield, ShieldOff, UserMinus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TeamMemberActionsProps {
  member: TeamMember;
  onToggleAdmin: (memberId: string, currentStatus: boolean) => Promise<void>;
  onDeactivate: (memberId: string) => Promise<void>;
}

const TeamMemberActions = ({ member, onToggleAdmin, onDeactivate }: TeamMemberActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end"
        className="z-50 min-w-[200px] overflow-hidden rounded-md border bg-background dark:bg-gray-900 p-1 text-foreground shadow-md"
      >
        <DropdownMenuItem 
          onClick={() => onToggleAdmin(member.id, member.is_admin)}
          className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground hover:bg-primary hover:text-primary-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
        >
          {member.is_admin ? (
            <>
              <ShieldOff className="mr-2 h-4 w-4" />
              <span>Verwijder admin</span>
            </>
          ) : (
            <>
              <Shield className="mr-2 h-4 w-4" />
              <span>Maak admin</span>
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onDeactivate(member.id)}
          className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors text-destructive hover:bg-destructive hover:text-destructive-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
        >
          <UserMinus className="mr-2 h-4 w-4" />
          <span>Deactiveer</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TeamMemberActions;
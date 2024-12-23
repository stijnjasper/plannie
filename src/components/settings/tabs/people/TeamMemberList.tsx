import { TeamMember } from "@/types/calendar";
import { Draggable } from "@hello-pangea/dnd";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Shield, ShieldOff, UserMinus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TeamMemberListProps {
  members: TeamMember[];
  onToggleAdmin: (memberId: string, currentStatus: boolean) => Promise<void>;
  onDeactivate: (memberId: string) => Promise<void>;
}

const TeamMemberList = ({ members = [], onToggleAdmin, onDeactivate }: TeamMemberListProps) => {
  return (
    <>
      {members.map((member, index) => (
        <Draggable key={member.id} draggableId={member.id} index={index}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className="flex items-center justify-between gap-3 rounded-lg border bg-card p-3 text-card-foreground shadow-sm"
            >
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
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onToggleAdmin(member.id, member.is_admin)}>
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
                    className="text-destructive"
                  >
                    <UserMinus className="mr-2 h-4 w-4" />
                    <span>Deactiveer</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </Draggable>
      ))}
    </>
  );
};

export default TeamMemberList;
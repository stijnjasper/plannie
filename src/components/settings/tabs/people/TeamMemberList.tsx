import { TeamMember } from "@/types/calendar";
import { Draggable } from "@hello-pangea/dnd";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Shield, ShieldOff, UserMinus, Crown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TeamMemberListProps {
  members: TeamMember[];
  isAdmin: boolean;
  onToggleAdmin: (memberId: string, currentStatus: boolean) => Promise<void>;
  onDeactivate: (memberId: string) => Promise<void>;
}

const TeamMemberList = ({ members = [], isAdmin, onToggleAdmin, onDeactivate }: TeamMemberListProps) => {
  const handleDeactivate = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          status: 'deactivated',
          team_id: null 
        })
        .eq('id', memberId);

      if (error) throw error;

      await onDeactivate(memberId);
      toast.success("Gebruiker succesvol gedeactiveerd");
    } catch (error) {
      console.error('Error deactivating user:', error);
      toast.error("Kon gebruiker niet deactiveren");
    }
  };

  // Extra validatie om alleen geldige members te renderen
  const validMembers = members.filter(member => 
    member && 
    member.id && 
    member.full_name && 
    typeof member.full_name === 'string'
  );

  return (
    <>
      {validMembers.map((member, index) => (
        <Draggable 
          key={member.id} 
          draggableId={member.id} 
          index={index}
          isDragDisabled={!isAdmin}
        >
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={`flex items-center justify-between gap-3 rounded-lg border bg-card p-3 text-card-foreground shadow-sm ${
                !isAdmin ? 'cursor-default' : 'cursor-move'
              }`}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={member.avatar_url || undefined} alt={member.full_name} />
                  <AvatarFallback>{member.full_name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium leading-none">{member.full_name}</p>
                    {member.is_admin && (
                      <Crown className="h-4 w-4 text-yellow-500" aria-label="Administrator" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{member.role || "Geen functie"}</p>
                </div>
              </div>
              
              {isAdmin && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end"
                    className="z-50 min-w-[200px] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
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
                      onClick={() => handleDeactivate(member.id)}
                      className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors text-destructive hover:bg-destructive hover:text-destructive-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                    >
                      <UserMinus className="mr-2 h-4 w-4" />
                      <span>Deactiveer</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          )}
        </Draggable>
      ))}
    </>
  );
};

export default TeamMemberList;
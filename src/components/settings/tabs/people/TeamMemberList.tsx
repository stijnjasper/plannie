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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import TeamMemberActions from "./TeamMemberActions";
import TeamMemberInfo from "./TeamMemberInfo";

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
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={`flex items-center justify-between gap-3 rounded-lg border p-3 shadow-sm ${
                !isAdmin ? 'cursor-default' : 'cursor-move'
              } ${
                snapshot.isDragging 
                  ? 'bg-background dark:bg-gray-900 border-border' 
                  : 'bg-background dark:bg-gray-900 border-border'
              }`}
            >
              <TeamMemberInfo member={member} />
              
              <div className="flex items-center gap-2">
                {member.is_admin && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Crown className="h-4 w-4 text-yellow-500" aria-label="Administrator" />
                      </TooltipTrigger>
                      <TooltipContent 
                        className="z-50 rounded-md border bg-background px-2 py-1 text-sm text-foreground shadow-md dark:bg-gray-900"
                      >
                        <p>Admin</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                
                {isAdmin && (
                  <TeamMemberActions 
                    member={member}
                    onToggleAdmin={onToggleAdmin}
                    onDeactivate={handleDeactivate}
                  />
                )}
              </div>
            </div>
          )}
        </Draggable>
      ))}
    </>
  );
};

export default TeamMemberList;
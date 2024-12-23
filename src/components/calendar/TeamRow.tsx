import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import TeamMemberList from "./TeamMemberList";
import DayColumn from "./DayColumn";
import { Task, TeamMember } from "@/types/calendar";
import { cn } from "@/lib/utils";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface TeamRowProps {
  team: string;
  isOpen: boolean;
  onToggle: () => void;
  teamMembers: TeamMember[];
  tasks: Task[];
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, day: string, team: string) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onCellClick: (day: string, team: string) => void;
  onEditTask: (task: Task) => void;
  onDuplicateTask: (task: Task) => void;
  onCopyLink: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onViewTask: (task: Task) => void;
}

const TeamRow = ({
  team,
  isOpen,
  onToggle,
  teamMembers,
  tasks,
  onCellClick,
  onEditTask,
  onDuplicateTask,
  onCopyLink,
  onDeleteTask,
  onViewTask,
}: TeamRowProps) => {
  const session = useSession();
  const { toast } = useToast();

  const handleJoinTeam = async () => {
    if (!session?.user?.id) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ team: team })
        .eq('id', session.user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `You have joined the ${team} team`,
      });
    } catch (error) {
      console.error('Error joining team:', error);
      toast({
        title: "Error",
        description: "Could not join team",
        variant: "destructive",
      });
    }
  };

  const handleLeaveTeam = async () => {
    if (!session?.user?.id) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ team: null })
        .eq('id', session.user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `You have left the ${team} team`,
      });
    } catch (error) {
      console.error('Error leaving team:', error);
      toast({
        title: "Error",
        description: "Could not leave team",
        variant: "destructive",
      });
    }
  };

  const currentUserTeam = teamMembers.find(
    member => member.id === session?.user?.id
  )?.team;

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <ContextMenu>
        <ContextMenuTrigger>
          <CollapsibleTrigger className="w-full">
            <div
              className={cn(
                "flex items-center gap-2 p-2 border-b border-border hover:bg-muted/80 dark:hover:bg-muted/10 transition-colors",
                `calendar-row-${team.toLowerCase()}`
              )}
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform text-foreground ${
                  isOpen ? "transform rotate-180" : ""
                }`}
              />
              <span className="font-medium text-foreground dark:text-gray-100">{team}</span>
            </div>
          </CollapsibleTrigger>
        </ContextMenuTrigger>
        <ContextMenuContent>
          {currentUserTeam === team ? (
            <ContextMenuItem onClick={handleLeaveTeam}>
              Leave Team
            </ContextMenuItem>
          ) : (
            <ContextMenuItem onClick={handleJoinTeam}>
              Join Team
            </ContextMenuItem>
          )}
        </ContextMenuContent>
      </ContextMenu>
      <CollapsibleContent>
        <div className="grid grid-cols-[200px_1fr]">
          <TeamMemberList teamMembers={teamMembers} team={team} />
          <div className="grid grid-cols-5">
            {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
              <DayColumn
                key={`${team}-${day}`}
                day={day}
                team={team}
                tasks={tasks}
                onCellClick={onCellClick}
                onEditTask={onEditTask}
                onDuplicateTask={onDuplicateTask}
                onCopyLink={onCopyLink}
                onDeleteTask={onDeleteTask}
                onViewTask={onViewTask}
              />
            ))}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default TeamRow;
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Task } from "@/types/calendar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useProfileRealtime } from "@/hooks/useProfileRealtime";
import { Loader2 } from "lucide-react";

interface TaskAssignmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: string;
  teamMember: string;
  editingTask: Task | null;
  onSave: (project: any, timeBlock: 2 | 4 | 6 | 8, description?: string) => void;
}

const TaskAssignmentModal = ({ 
  open, 
  onOpenChange, 
  selectedDate, 
  teamMember, 
  editingTask, 
  onSave 
}: TaskAssignmentModalProps) => {
  const [search, setSearch] = useState("");
  useProfileRealtime();

  const { data: profiles = [], isLoading, error } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select(`
            *,
            teams:team_id (
              name
            )
          `)
          .eq('status', 'active')
          .order("full_name");

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching profiles:', error);
        return [];
      }
    }
  });

  // Transform profiles into team members with safe defaults
  const teamMembers = profiles.map(profile => ({
    id: profile.id || '',
    full_name: profile.full_name || '',
    role: profile.role || '',
    team_id: profile.team_id,
    avatar_url: profile.avatar_url || '',
    is_admin: profile.is_admin || false,
    status: profile.status as "active" | "deactivated",
    name: profile.full_name || '',
    title: profile.role ? `${profile.role}` : 'Team Member',
    avatar: profile.avatar_url || '',
    team: profile.teams?.name || null
  }));

  // Ensure filteredTeamMembers is always an array
  const filteredTeamMembers = search === "" 
    ? teamMembers 
    : teamMembers.filter((member) => {
        const searchLower = search.toLowerCase();
        return (
          member.full_name.toLowerCase().includes(searchLower) ||
          (member.title && member.title.toLowerCase().includes(searchLower))
        );
      });

  const handleSelect = (memberId: string) => {
    if (editingTask) {
      onSave(
        { name: editingTask.title, color: editingTask.color },
        editingTask.timeBlock,
        editingTask.description
      );
    }
    onOpenChange(false);
  };

  if (error) {
    console.error('Error loading team members:', error);
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Taak toewijzen</DialogTitle>
          <DialogDescription>
            Wijs deze taak toe aan een teamlid. Druk op <span className="px-1 py-0.5 bg-muted rounded text-xs">⌘</span> + <span className="px-1 py-0.5 bg-muted rounded text-xs">K</span> om snel een taak toe te wijzen.
          </DialogDescription>
        </DialogHeader>

        <Command>
          <CommandInput
            placeholder="Zoek een teamlid..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandEmpty>Geen teamleden gevonden.</CommandEmpty>
          <CommandGroup>
            {isLoading ? (
              <CommandItem className="flex items-center gap-2 cursor-default">
                <Loader2 className="h-4 w-4 animate-spin" />
                Laden...
              </CommandItem>
            ) : filteredTeamMembers.length > 0 ? (
              filteredTeamMembers.map((member) => (
                <CommandItem
                  key={member.id}
                  value={member.full_name}
                  onSelect={() => handleSelect(member.id)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={member.avatar_url}
                      alt={member.full_name}
                    />
                    <AvatarFallback>
                      {member.full_name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{member.full_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {member.title}
                    </div>
                  </div>
                </CommandItem>
              ))
            ) : (
              <CommandItem className="flex items-center gap-2 cursor-default">
                Geen resultaten gevonden
              </CommandItem>
            )}
          </CommandGroup>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default TaskAssignmentModal;
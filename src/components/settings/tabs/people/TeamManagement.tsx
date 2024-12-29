import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

const TeamManagement = () => {
  const [newTeamName, setNewTeamName] = useState("");
  const [showDuplicateAlert, setShowDuplicateAlert] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch current user's admin status
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return profile;
    }
  });

  const isAdmin = currentUser?.is_admin ?? false;

  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Attempting to add new team:', newTeamName);

    if (!newTeamName.trim()) {
      console.log('Team name is empty, showing error toast');
      toast({
        title: "Error",
        description: "Team naam is verplicht",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Checking if team already exists:', newTeamName.trim());
      const { data: existingTeam, error: checkError } = await supabase
        .from('teams')
        .select('id')
        .eq('name', newTeamName.trim())
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing team:', checkError);
        throw checkError;
      }

      if (existingTeam) {
        console.log('Team already exists, showing duplicate alert');
        setShowDuplicateAlert(true);
        return;
      }

      console.log('Adding new team to database');
      const { data: newTeam, error: insertError } = await supabase
        .from('teams')
        .insert([
          { 
            name: newTeamName.trim(),
            order_index: 999 // Will be sorted later
          }
        ])
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting new team:', insertError);
        throw insertError;
      }

      console.log('New team added successfully:', newTeam);
      setNewTeamName("");
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      
      toast({
        description: "Team succesvol toegevoegd",
      });
    } catch (error) {
      console.error('Error in handleAddTeam:', error);
      toast({
        title: "Error",
        description: "Kon team niet toevoegen",
        variant: "destructive",
      });
    }
  };

  // Only render the form if user is admin
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Teams</h3>
      <form onSubmit={handleAddTeam} className="flex gap-2">
        <Input
          placeholder="Nieuw team naam"
          value={newTeamName}
          onChange={(e) => setNewTeamName(e.target.value)}
        />
        <Button type="submit">
          <Plus className="h-4 w-4 mr-2" />
          Team Toevoegen
        </Button>
      </form>

      <AlertDialog open={showDuplicateAlert} onOpenChange={setShowDuplicateAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Team bestaat al</AlertDialogTitle>
            <AlertDialogDescription>
              Er bestaat al een team met deze naam. Kies een andere naam om een nieuw team te maken.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Begrepen</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TeamManagement;
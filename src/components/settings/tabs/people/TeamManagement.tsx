import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";

const TeamManagement = () => {
  const [newTeamName, setNewTeamName] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) {
      toast({
        title: "Error",
        description: "Team naam is verplicht",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('teams')
        .insert([
          { 
            name: newTeamName.trim(),
            order_index: 999 // Will be sorted later
          }
        ]);

      if (error) throw error;

      setNewTeamName("");
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      
      toast({
        description: "Team succesvol toegevoegd",
      });
    } catch (error) {
      console.error('Error adding team:', error);
      toast({
        title: "Error",
        description: "Kon team niet toevoegen",
        variant: "destructive",
      });
    }
  };

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
    </div>
  );
};

export default TeamManagement;
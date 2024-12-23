import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Plus, Users } from "lucide-react";

const ProjectsTab = () => {
  const [newTeamName, setNewTeamName] = useState("");
  const { toast } = useToast();
  const teams = ["Marketing", "Development", "Design"];

  const handleAddTeam = () => {
    if (!newTeamName.trim()) {
      toast({
        title: "Fout",
        description: "Voer een teamnaam in",
        variant: "destructive",
      });
      return;
    }
    
    // TODO: Implement team creation logic
    toast({
      title: "Team toegevoegd",
      description: `Team "${newTeamName}" is succesvol aangemaakt`,
    });
    setNewTeamName("");
  };

  const handleManageMembers = (team: string) => {
    // TODO: Implement member management logic
    toast({
      description: `Beheer teamleden voor ${team}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Teams</h3>
        <div className="flex gap-2">
          <Input
            placeholder="Nieuw team naam"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            className="max-w-xs"
          />
          <Button onClick={handleAddTeam}>
            <Plus className="h-4 w-4 mr-2" />
            Team Toevoegen
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {teams.map((team) => (
          <div
            key={team}
            className="flex items-center justify-between p-4 rounded-lg border"
          >
            <span className="font-medium">{team}</span>
            <Button variant="outline" onClick={() => handleManageMembers(team)}>
              <Users className="h-4 w-4 mr-2" />
              Beheer Leden
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsTab;
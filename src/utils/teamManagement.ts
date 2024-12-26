import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const deleteTeam = async (teamId: string) => {
  try {
    // Update team members to unassigned
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ team_id: null })
      .eq('team_id', teamId);

    if (updateError) throw updateError;

    // Delete the team
    const { error: deleteError } = await supabase
      .from('teams')
      .delete()
      .eq('id', teamId);

    if (deleteError) throw deleteError;

    toast.success("Team succesvol verwijderd");
    return true;
  } catch (error) {
    console.error('Error in deleteTeam:', error);
    toast.error("Kon team niet verwijderen");
    return false;
  }
};
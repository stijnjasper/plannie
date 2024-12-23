import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GeneralTabProps {
  onOpenChange: (open: boolean) => void;
}

const GeneralTab = ({ onOpenChange }: GeneralTabProps) => {
  const session = useSession();
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session?.user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: { theme_preference?: string }) => {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", session?.user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Instellingen opgeslagen");
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      toast.error("Er is iets misgegaan bij het opslaan van de instellingen");
    },
  });

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium mb-1.5 block">
              Gewenste naam
            </label>
            <Input
              value={profile?.full_name || ""}
              readOnly
              className="bg-muted"
            />
          </div>
          <Button variant="outline" className="mt-6">
            Naam wijzigen
          </Button>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium mb-1.5 block">
              E-mailadres
            </label>
            <Input
              value={session?.user?.email || ""}
              readOnly
              className="bg-muted"
            />
          </div>
          <Button variant="outline" className="mt-6">
            E-mail wijzigen
          </Button>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium mb-1.5 block">Functie</label>
            <Input value={profile?.team || ""} readOnly className="bg-muted" />
          </div>
          <Button variant="outline" className="mt-6">
            Functie wijzigen
          </Button>
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">Thema</label>
          <Select
            value={profile?.theme_preference || "system"}
            onValueChange={(value) => {
              updateProfile.mutate({ theme_preference: value });
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="system">Gebruik systeeminstelling</SelectItem>
              <SelectItem value="dark">Donker</SelectItem>
              <SelectItem value="light">Licht</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default GeneralTab;
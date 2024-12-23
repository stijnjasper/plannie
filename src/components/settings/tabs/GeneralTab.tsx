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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

interface GeneralTabProps {
  onOpenChange: (open: boolean) => void;
}

const GeneralTab = ({ onOpenChange }: GeneralTabProps) => {
  const session = useSession();
  const queryClient = useQueryClient();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("");

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          teams:team_id (
            name
          )
        `)
        .eq("id", session?.user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: { full_name?: string; role?: string }) => {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", session?.user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profiel bijgewerkt");
      setIsEditingName(false);
      setIsEditingRole(false);
      setNewName("");
      setNewRole("");
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      toast.error("Er is iets misgegaan bij het bijwerken van het profiel");
    },
  });

  const updateEmail = useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase.auth.updateUser({ email });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Er is een verificatie e-mail verzonden naar je nieuwe e-mailadres");
      setIsEditingEmail(false);
      setNewEmail("");
    },
    onError: (error) => {
      console.error("Error updating email:", error);
      toast.error("Er is iets misgegaan bij het bijwerken van je e-mailadres");
    },
  });

  const handleNameUpdate = () => {
    if (!newName.trim()) {
      setIsEditingName(false);
      return;
    }
    updateProfile.mutate({ full_name: newName });
  };

  const handleRoleUpdate = () => {
    if (!newRole.trim()) {
      setIsEditingRole(false);
      return;
    }
    updateProfile.mutate({ role: newRole });
  };

  const handleEmailUpdate = () => {
    if (!newEmail.trim()) {
      setIsEditingEmail(false);
      return;
    }
    updateEmail.mutate(newEmail);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={profile?.avatar_url || "https://github.com/shadcn.png"} alt={profile?.full_name || "User"} />
          <AvatarFallback>{profile?.full_name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Mijn profiel</h2>
          <p className="text-sm text-muted-foreground">
            Beheer je persoonlijke gegevens en voorkeuren
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium mb-1.5 block">
              Gewenste naam
            </label>
            {isEditingName ? (
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={profile?.full_name || ""}
              />
            ) : (
              <Input value={profile?.full_name || ""} readOnly className="bg-muted" />
            )}
          </div>
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => {
              if (isEditingName) {
                handleNameUpdate();
              } else {
                setNewName(profile?.full_name || "");
                setIsEditingName(true);
              }
            }}
          >
            {isEditingName ? "Opslaan" : "Naam wijzigen"}
          </Button>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium mb-1.5 block">
              E-mailadres
            </label>
            {isEditingEmail ? (
              <Input
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder={session?.user?.email || ""}
                type="email"
              />
            ) : (
              <Input value={session?.user?.email || ""} readOnly className="bg-muted" />
            )}
          </div>
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => {
              if (isEditingEmail) {
                handleEmailUpdate();
              } else {
                setNewEmail(session?.user?.email || "");
                setIsEditingEmail(true);
              }
            }}
          >
            {isEditingEmail ? "Opslaan" : "E-mail wijzigen"}
          </Button>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium mb-1.5 block">Functie</label>
            {isEditingRole ? (
              <Input
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                placeholder={profile?.role || ""}
              />
            ) : (
              <Input value={profile?.role || ""} readOnly className="bg-muted" />
            )}
          </div>
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => {
              if (isEditingRole) {
                handleRoleUpdate();
              } else {
                setNewRole(profile?.role || "");
                setIsEditingRole(true);
              }
            }}
          >
            {isEditingRole ? "Opslaan" : "Functie wijzigen"}
          </Button>
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">Thema</label>
          <Select
            value={profile?.theme_preference || "system"}
            onValueChange={(value) => {
              updateTheme.mutate({ theme_preference: value });
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

import { useSession } from "@supabase/auth-helpers-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import ProfileHeader from "./general/ProfileHeader";
import FormField from "./general/FormField";
import ThemeSelector from "./general/ThemeSelector";

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

  const updateTheme = useMutation({
    mutationFn: async (updates: { theme_preference: string }) => {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", session?.user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Thema bijgewerkt");
    },
    onError: (error) => {
      console.error("Error updating theme:", error);
      toast.error("Er is iets misgegaan bij het bijwerken van het thema");
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
    <div className="max-w-2xl mx-auto space-y-8">
      <ProfileHeader
        avatarUrl={profile?.avatar_url}
        fullName={profile?.full_name}
      />

      <div className="space-y-6">
        <FormField
          label="Gewenste naam"
          value={profile?.full_name || ""}
          isEditing={isEditingName}
          newValue={newName}
          onNewValueChange={setNewName}
          onEditToggle={() => {
            setNewName(profile?.full_name || "");
            setIsEditingName(true);
          }}
          onSave={handleNameUpdate}
        />

        <FormField
          label="E-mailadres"
          value={session?.user?.email || ""}
          isEditing={isEditingEmail}
          newValue={newEmail}
          onNewValueChange={setNewEmail}
          onEditToggle={() => {
            setNewEmail(session?.user?.email || "");
            setIsEditingEmail(true);
          }}
          onSave={handleEmailUpdate}
          type="email"
        />

        <FormField
          label="Functie"
          value={profile?.role || ""}
          isEditing={isEditingRole}
          newValue={newRole}
          onNewValueChange={setNewRole}
          onEditToggle={() => {
            setNewRole(profile?.role || "");
            setIsEditingRole(true);
          }}
          onSave={handleRoleUpdate}
        />

        <ThemeSelector
          value={profile?.theme_preference || "system"}
          onValueChange={(value) => {
            updateTheme.mutate({ theme_preference: value });
          }}
        />
      </div>
    </div>
  );
};

export default GeneralTab;
import { useProfileContext } from "@/contexts/ProfileContext";
import { useState } from "react";
import FormField from "./FormField";
import { useSession } from "@supabase/auth-helpers-react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ProfileForm = () => {
  const session = useSession();
  const { profile } = useProfileContext();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("");

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

  const { updateProfile } = useProfileContext();

  const handleNameUpdate = () => {
    if (!newName.trim()) {
      setIsEditingName(false);
      return;
    }
    updateProfile({ full_name: newName });
    setIsEditingName(false);
  };

  const handleRoleUpdate = () => {
    if (!newRole.trim()) {
      setIsEditingRole(false);
      return;
    }
    updateProfile({ role: newRole });
    setIsEditingRole(false);
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
    </div>
  );
};

export default ProfileForm;
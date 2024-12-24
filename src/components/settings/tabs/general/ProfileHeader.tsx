import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AvatarUpload from "./AvatarUpload";
import { useProfileRealtime } from "@/hooks/useProfileRealtime";

interface ProfileHeaderProps {
  avatarUrl?: string | null;
  fullName?: string | null;
}

const ProfileHeader = ({ avatarUrl, fullName }: ProfileHeaderProps) => {
  const queryClient = useQueryClient();
  // Add the real-time hook
  useProfileRealtime();

  const handleAvatarUpdate = async (url: string | null) => {
    const { error } = await supabase
      .from('profiles')
      .update({ avatar_url: url })
      .eq('id', (await supabase.auth.getUser()).data.user?.id);

    if (error) throw error;
    
    // Force an immediate refresh of the profile data
    await queryClient.refetchQueries({ queryKey: ['profile'] });
  };

  return (
    <div className="flex items-start gap-4">
      <AvatarUpload
        avatarUrl={avatarUrl}
        fullName={fullName}
        onAvatarUpdate={handleAvatarUpdate}
      />
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Mijn profiel</h2>
        <p className="text-sm text-muted-foreground">
          Beheer je persoonlijke gegevens en voorkeuren
        </p>
      </div>
    </div>
  );
};

export default ProfileHeader;
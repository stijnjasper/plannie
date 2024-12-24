import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AvatarUpload from "./AvatarUpload";

interface ProfileHeaderProps {
  avatarUrl?: string | null;
  fullName?: string | null;
}

const ProfileHeader = ({ avatarUrl, fullName }: ProfileHeaderProps) => {
  const queryClient = useQueryClient();

  const handleAvatarUpdate = async (url: string | null) => {
    const { error } = await supabase
      .from('profiles')
      .update({ avatar_url: url })
      .eq('id', (await supabase.auth.getUser()).data.user?.id);

    if (error) throw error;
    
    await queryClient.refetchQueries({ queryKey: ['profile'] });
  };

  return (
    <div className="flex items-start gap-4">
      <AvatarUpload
        avatarUrl={avatarUrl}
        fullName={fullName}
        onAvatarUpdate={handleAvatarUpdate}
      />
    </div>
  );
};

export default ProfileHeader;
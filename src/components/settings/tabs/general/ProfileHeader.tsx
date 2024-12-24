import { useProfileContext } from "@/contexts/ProfileContext";
import AvatarUpload from "./AvatarUpload";

interface ProfileHeaderProps {
  avatarUrl?: string | null;
  fullName?: string | null;
}

const ProfileHeader = ({ avatarUrl, fullName }: ProfileHeaderProps) => {
  const { updateProfile } = useProfileContext();

  const handleAvatarUpdate = async (url: string | null) => {
    await updateProfile({ avatar_url: url });
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
import ProfileHeader from "./general/ProfileHeader";
import ProfileForm from "./general/ProfileForm";
import ThemeSection from "./general/ThemeSection";
import { useProfileContext } from "@/contexts/ProfileContext";

interface GeneralTabProps {
  onOpenChange: (open: boolean) => void;
}

const GeneralTab = ({ onOpenChange }: GeneralTabProps) => {
  const { profile } = useProfileContext();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <ProfileHeader
        avatarUrl={profile?.avatar_url}
        fullName={profile?.full_name}
      />

      <ProfileForm />
      <ThemeSection />
    </div>
  );
};

export default GeneralTab;
import { useProfileContext } from "@/contexts/ProfileContext";
import ThemeSelector from "./ThemeSelector";

const ThemeSection = () => {
  const { profile, updateProfile } = useProfileContext();

  return (
    <ThemeSelector
      value={profile?.theme_preference || "system"}
      onValueChange={(value) => {
        updateProfile({ theme_preference: value });
      }}
    />
  );
};

export default ThemeSection;
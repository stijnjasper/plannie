import { useProfile } from "./useProfile";
import { useProfileRealtime } from "./useProfileRealtime";
import { useSession } from "@supabase/auth-helpers-react";

export const useProfileWithRealtime = () => {
  const session = useSession();
  const profileData = useProfile();
  
  // Always call useProfileRealtime, but only enable it conditionally
  useProfileRealtime(!!session?.user?.id);

  return profileData;
};
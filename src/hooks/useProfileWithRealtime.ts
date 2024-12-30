import { useProfile } from "./useProfile";
import { useProfileRealtime } from "./useProfileRealtime";
import { useSession } from "@supabase/auth-helpers-react";

export const useProfileWithRealtime = () => {
  const session = useSession();
  const profileData = useProfile();
  
  // Only set up realtime subscription if we have a session
  if (session?.user?.id) {
    useProfileRealtime();
  }

  return profileData;
};
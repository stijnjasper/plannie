import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useProfileRealtime } from "./useProfileRealtime";

export const useProfile = () => {
  const session = useSession();
  const queryClient = useQueryClient();
  
  console.log("[useProfile] Session state:", {
    hasSession: !!session,
    userId: session?.user?.id,
    userEmail: session?.user?.email
  });

  // Only set up realtime subscription if we have a session
  if (session?.user?.id) {
    useProfileRealtime();
  }

  const {
    data: profile,
    isLoading,
    error
  } = useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: async () => {
      const userId = session?.user?.id;
      console.log("[useProfile] Starting profile fetch for userId:", userId);
      
      if (!userId) {
        console.warn("[useProfile] No user ID available, skipping fetch");
        return null;
      }

      try {
        console.log("[useProfile] Fetching profile data from Supabase");
        const { data, error } = await supabase
          .from("profiles")
          .select(`
            *,
            teams:team_id (
              name
            )
          `)
          .eq("id", userId)
          .maybeSingle();

        if (error) {
          console.error("[useProfile] Supabase error:", error);
          throw error;
        }
        
        console.log("[useProfile] Profile data received:", data);
        return data;
      } catch (error) {
        console.error("[useProfile] Unexpected error during fetch:", error);
        throw error;
      }
    },
    enabled: !!session?.user?.id,
    staleTime: 1000 * 60, // Consider data fresh for 1 minute
    gcTime: 1000 * 60 * 5, // Keep unused data in cache for 5 minutes
    retry: 1, // Only retry once on failure
  });

  return {
    profile,
    isLoading: isLoading && !!session?.user?.id,
    error,
    session
  };
};
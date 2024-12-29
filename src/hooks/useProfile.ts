import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useProfileRealtime } from "./useProfileRealtime";

export const useProfile = () => {
  const session = useSession();
  const queryClient = useQueryClient();
  
  // Add the real-time hook
  useProfileRealtime();

  const {
    data: profile,
    isLoading,
    error
  } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      console.log("[useProfile] Starting profile fetch");
      const userId = session?.user?.id;
      if (!userId) {
        console.warn("[useProfile] No user ID available");
        throw new Error("No user ID available");
      }

      console.log("[useProfile] Fetching profile for user:", userId);
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
        console.error("[useProfile] Error fetching profile:", error);
        throw error;
      }
      
      console.log("[useProfile] Profile data received:", data);
      return data;
    },
    enabled: !!session?.user?.id,
  });

  return {
    profile,
    isLoading,
    error,
    session
  };
};
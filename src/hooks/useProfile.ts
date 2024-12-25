import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useProfileRealtime } from "./useProfileRealtime";

export const useProfile = () => {
  const session = useSession();
  const queryClient = useQueryClient();
  
  useProfileRealtime();

  const {
    data: profile,
    isLoading,
    error
  } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          teams:team_id (
            name
          )
        `)
        .eq("id", session?.user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
    staleTime: 1000, // Data wordt als verouderd beschouwd na 1 seconde
    cacheTime: 5 * 60 * 1000, // Cache blijft 5 minuten behouden
  });

  return {
    profile,
    isLoading,
    error,
    session
  };
};
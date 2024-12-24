import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { useEffect } from "react";
import { toast } from "sonner";

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string | null;
  theme_preference: string;
  is_admin: boolean;
  status: 'active' | 'deactivated';
  team?: {
    name: string;
  } | null;
}

export function useProfile() {
  const session = useSession();
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'profiles'
        },
        () => {
          Promise.all([
            queryClient.refetchQueries({ queryKey: ['profile'] }),
            queryClient.refetchQueries({ queryKey: ['profiles'] })
          ]);
          console.log('Profile data refreshed');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) {
        console.log('No user session found');
        return null;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          teams:team_id (
            name
          )
        `)
        .eq('id', session.user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
      
      return data as Profile | null;
    },
    enabled: !!session?.user?.id,
  });

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!session?.user?.id) {
      console.error('No user session');
      toast.error("Je moet ingelogd zijn om je profiel bij te werken");
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', session.user.id);

      if (error) throw error;

      toast.success("Profiel bijgewerkt");
      await queryClient.refetchQueries({ queryKey: ['profile'] });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Er is iets misgegaan bij het bijwerken van het profiel");
    }
  };

  return {
    profile,
    isLoading,
    error,
    updateProfile,
  };
}
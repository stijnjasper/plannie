import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useProfileRealtime = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log("[useProfileRealtime] Setting up realtime subscription");
    
    const channel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'profiles'
        },
        (payload) => {
          console.log("[useProfileRealtime] Received profile change:", payload);
          // Invalidate any queries that use profile data
          queryClient.invalidateQueries({ queryKey: ['profile'] });
          queryClient.invalidateQueries({ queryKey: ['profiles'] });
        }
      )
      .subscribe((status) => {
        console.log("[useProfileRealtime] Subscription status:", status);
      });

    return () => {
      console.log("[useProfileRealtime] Cleaning up subscription");
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
};
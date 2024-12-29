import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';

export const useProfileRealtime = () => {
  const queryClient = useQueryClient();
  const session = useSession();

  useEffect(() => {
    if (!session?.user?.id) {
      console.log("[useProfileRealtime] No user session, skipping subscription");
      return;
    }

    console.log("[useProfileRealtime] Setting up realtime subscription for user:", session.user.id);
    
    const channel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'profiles',
          filter: `id=eq.${session.user.id}`
        },
        (payload) => {
          console.log("[useProfileRealtime] Received profile change:", payload);
          queryClient.invalidateQueries({ queryKey: ['profile'] });
        }
      )
      .subscribe((status) => {
        console.log("[useProfileRealtime] Subscription status:", status);
      });

    return () => {
      console.log("[useProfileRealtime] Cleaning up subscription");
      supabase.removeChannel(channel);
    };
  }, [queryClient, session?.user?.id]);
};
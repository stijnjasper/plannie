import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';

export const useProfileRealtime = () => {
  const queryClient = useQueryClient();
  const session = useSession();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    if (!session?.user?.id) {
      console.log("[useProfileRealtime] No user session, skipping subscription");
      return;
    }

    // Clean up any existing subscription
    if (channelRef.current) {
      console.log("[useProfileRealtime] Cleaning up existing subscription");
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
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
        async (payload) => {
          console.log("[useProfileRealtime] Received profile change:", payload);
          // Invalidate and refetch in one go
          await queryClient.invalidateQueries({ 
            queryKey: ['profile', session.user.id]
          });
        }
      )
      .subscribe((status) => {
        console.log("[useProfileRealtime] Subscription status:", status);
      });

    channelRef.current = channel;

    return () => {
      console.log("[useProfileRealtime] Cleaning up subscription");
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [queryClient, session?.user?.id]);
};
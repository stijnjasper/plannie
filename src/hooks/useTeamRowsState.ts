import { useState, useEffect } from 'react';
import { useProfile } from './useProfile';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useTeamRowsState = () => {
  const { profile } = useProfile();
  const [openTeams, setOpenTeams] = useState<Record<string, boolean>>({});
  const [localCache, setLocalCache] = useState<Record<string, boolean> | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  // Initialize state from profile
  useEffect(() => {
    if (profile?.team_rows_state) {
      setOpenTeams(profile.team_rows_state as Record<string, boolean>);
    }
  }, [profile?.team_rows_state]);

  // Save state to local cache
  useEffect(() => {
    if (Object.keys(openTeams).length > 0) {
      setLocalCache(openTeams);
    }
  }, [openTeams]);

  const saveState = async (newState: Record<string, boolean>) => {
    if (!profile?.id) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ team_rows_state: newState })
        .eq('id', profile.id);

      if (error) throw error;

      // Clear retry count on successful save
      setRetryCount(0);
    } catch (error) {
      console.error('Error saving team rows state:', error);
      
      // Increment retry count and attempt retry if under max
      if (retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => saveState(newState), 1000 * Math.pow(2, retryCount)); // Exponential backoff
      } else {
        toast.error('Could not save team state. Changes will be preserved locally.');
        // Save to local cache as fallback
        setLocalCache(newState);
      }
    }
  };

  const toggleTeam = async (team: string) => {
    const newState = {
      ...openTeams,
      [team]: !openTeams[team]
    };
    setOpenTeams(newState);
    await saveState(newState);
  };

  return {
    openTeams,
    toggleTeam,
    localCache
  };
};
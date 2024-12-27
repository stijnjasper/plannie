import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check current session on mount
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('Current session:', session);
        
        if (error) {
          console.error('Session error:', error);
          navigate("/login");
          return;
        }

        if (!session) {
          console.log('No active session found');
          navigate("/login");
          return;
        }

        // Verify the session is still valid
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          console.error('User verification failed:', userError);
          await supabase.auth.signOut();
          navigate("/login");
          return;
        }
      } catch (error) {
        console.error('Session check failed:', error);
        navigate("/login");
      }
    };
    
    checkSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_OUT' || !session) {
        console.log('User signed out or session expired');
        navigate("/login");
        return;
      }

      if (event === 'TOKEN_REFRESHED') {
        console.log('Session token refreshed');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return <>{children}</>;
};

export default AuthGuard;
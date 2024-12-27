import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        // First check if we have a session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          if (mounted) {
            navigate("/login");
            toast({
              title: "Session Error",
              description: "Please log in again",
              variant: "destructive",
            });
          }
          return;
        }

        if (!session) {
          console.log('No active session found');
          if (mounted) {
            navigate("/login");
          }
          return;
        }

        // Then verify if the session is still valid
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('User verification failed:', userError);
          if (mounted) {
            // Clear the invalid session
            await supabase.auth.signOut();
            navigate("/login");
            toast({
              title: "Authentication Error",
              description: "Your session has expired. Please log in again.",
              variant: "destructive",
            });
          }
          return;
        }

        if (!user && mounted) {
          navigate("/login");
        }
      } catch (error) {
        console.error('Session check failed:', error);
        if (mounted) {
          navigate("/login");
          toast({
            title: "Error",
            description: "An error occurred checking your session",
            variant: "destructive",
          });
        }
      }
    };

    // Check session immediately
    checkSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, 'Session:', session);
      
      if (event === 'SIGNED_OUT' || !session) {
        console.log('User signed out or session expired');
        if (mounted) {
          navigate("/login");
        }
        return;
      }

      if (event === 'TOKEN_REFRESHED') {
        console.log('Session token refreshed');
        // Recheck session after token refresh
        await checkSession();
      }
    });

    // Cleanup function
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  return <>{children}</>;
};

export default AuthGuard;
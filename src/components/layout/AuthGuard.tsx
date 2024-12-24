import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const navigate = useNavigate();
  const session = useSession();

  useEffect(() => {
    // Controleer initiële sessie
    if (!session) {
      console.log("No session found, redirecting to login");
      navigate("/login");
      return;
    }

    // Luister naar auth state veranderingen
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, "Session:", session?.user?.id);
      
      if (event === 'SIGNED_OUT' || !session) {
        console.log("User signed out or session expired");
        navigate("/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, session]);

  // Toon niets tijdens het controleren van de sessie
  if (!session) {
    console.log("Session not available, rendering null");
    return null;
  }

  console.log("Session available, rendering children");
  return <>{children}</>;
};

export default AuthGuard;
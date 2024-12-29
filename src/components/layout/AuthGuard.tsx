import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("[AuthGuard] Setting up auth state listener");
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("[AuthGuard] Auth state changed:", { event, hasSession: !!session });
      
      if (!session) {
        console.log("[AuthGuard] No session found, redirecting to login");
        navigate("/login");
      }
    });

    return () => {
      console.log("[AuthGuard] Cleaning up auth state listener");
      subscription.unsubscribe();
    };
  }, [navigate]);

  return <>{children}</>;
};

export default AuthGuard;
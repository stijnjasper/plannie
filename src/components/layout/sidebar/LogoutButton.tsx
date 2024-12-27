import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import SidebarTooltip from "../SidebarTooltip";
import { toast } from "sonner";
import { useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";

const LogoutButton = () => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { supabaseClient } = useSessionContext();

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    try {
      setIsLoggingOut(true);
      
      // First clear any existing session
      await supabaseClient.auth.setSession(null);
      
      // Then sign out
      const { error } = await supabaseClient.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        toast.error("Er ging iets mis bij het uitloggen. Probeer het opnieuw.");
        return;
      }

      // Clear any local storage or session storage
      localStorage.clear();
      sessionStorage.clear();

      toast.success("Je bent succesvol uitgelogd");
      navigate("/login");
    } catch (error) {
      console.error('Unexpected logout error:', error);
      toast.error("Er ging iets mis bij het uitloggen. Probeer het opnieuw.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="px-3">
      <SidebarTooltip label="Uitloggen">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`group flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:bg-muted dark:hover:bg-gray-700 ${
            isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-label="Uitloggen"
        >
          <LogOut className="h-5 w-5 text-foreground transition-colors" />
        </button>
      </SidebarTooltip>
    </div>
  );
};

export default LogoutButton;
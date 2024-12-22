import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import SidebarTooltip from "../SidebarTooltip";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="px-3">
      <SidebarTooltip label="Uitloggen">
        <button
          onClick={handleLogout}
          className="group flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:bg-muted/50 dark:hover:bg-muted/10"
          aria-label="Uitloggen"
        >
          <LogOut className="h-5 w-5 text-foreground" />
        </button>
      </SidebarTooltip>
    </div>
  );
};

export default LogoutButton;
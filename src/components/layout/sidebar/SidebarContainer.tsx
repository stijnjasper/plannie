import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import SidebarNavigation from "./SidebarNavigation";
import SidebarActions from "./SidebarActions";
import SidebarProfile from "./components/SidebarProfile";
import { useProfileWithRealtime } from "@/hooks/useProfileWithRealtime";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import SettingsModal from "@/components/settings/SettingsModal";
import { HotkeysProvider } from "@/contexts/HotkeysContext";
import GlobalHotkeys from "@/components/global/GlobalHotkeys";
import { useTheme } from "@/contexts/ThemeContext";

const SidebarContainer = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { profile } = useProfileWithRealtime();
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme, themePreference } = useTheme();

  useEffect(() => {
    if (profile?.sidebar_expanded !== undefined) {
      setIsExpanded(profile.sidebar_expanded);
    }
  }, [profile?.sidebar_expanded]);

  const toggleSidebar = async () => {
    try {
      const newState = !isExpanded;
      setIsExpanded(newState);
      
      const { error } = await supabase
        .from('profiles')
        .update({ sidebar_expanded: newState })
        .eq('id', profile?.id);

      if (error) {
        console.error('[SidebarContainer] Error updating sidebar state:', error);
        throw error;
      }
    } catch (error) {
      console.error('[SidebarContainer] Error in toggleSidebar:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
      toast.success('Je bent succesvol uitgelogd');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Er ging iets mis bij het uitloggen');
    }
  };

  const hotkeysValue = {
    toggleSidebar,
    toggleTheme,
    openSettings: () => setSettingsOpen(true),
    handleLogout,
  };

  return (
    <HotkeysProvider value={hotkeysValue}>
      <GlobalHotkeys />
      <div className="relative">
        <div className="fixed left-0 top-0 z-50 flex h-auto flex-col transition-all duration-300 ease-in-out w-[72px]">
          <div
            className={cn(
              "m-4 flex flex-col items-center gap-3 rounded-2xl bg-background shadow-[0px_2px_10px_rgba(0,0,0,0.08)] transition-all duration-300 ease-in-out py-3",
              "animate-in slide-in-from-left"
            )}
          >
            <SidebarNavigation isExpanded={isExpanded} onToggle={toggleSidebar} />

            {isExpanded && (
              <>
                <div className="h-[1px] w-4 dark:bg-muted bg-border" />
                <SidebarActions 
                  isDarkMode={isDarkMode} 
                  onToggleDarkMode={toggleTheme}
                  themePreference={themePreference}
                  settingsOpen={settingsOpen}
                  setSettingsOpen={setSettingsOpen}
                  onLogout={handleLogout}
                />
                <SidebarProfile />
              </>
            )}
          </div>
        </div>
        <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
      </div>
    </HotkeysProvider>
  );
};

export default SidebarContainer;
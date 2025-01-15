import { Settings } from "lucide-react";
import SidebarTooltip from "../SidebarTooltip";
import ThemeToggle from "./ThemeToggle";
import LogoutButton from "./LogoutButton";

interface SidebarActionsProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  themePreference?: string;
  settingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
  onLogout: () => void;
}

const SidebarActions = ({ 
  isDarkMode, 
  onToggleDarkMode, 
  themePreference,
  settingsOpen,
  setSettingsOpen,
  onLogout
}: SidebarActionsProps) => {
  const getThemeTooltip = () => {
    switch (themePreference) {
      case 'light':
        return "Schakel naar donkere modus (⌘/Ctrl + ⌥/Alt + L)";
      case 'dark':
        return "Gebruik systeem thema (⌘/Ctrl + ⌥/Alt + L)";
      default:
        return "Schakel naar lichte modus (⌘/Ctrl + ⌥/Alt + L)";
    }
  };

  return (
    <>
      <div className="px-3">
        <SidebarTooltip label={getThemeTooltip()}>
          <ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleDarkMode} />
        </SidebarTooltip>
      </div>

      <div className="px-3">
        <SidebarTooltip label="Instellingen (⌘/Ctrl + ⌥/Alt + ,)">
          <button
            onClick={() => setSettingsOpen(true)}
            className="group flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:bg-muted dark:hover:bg-gray-700"
            aria-label="Instellingen"
          >
            <Settings className="h-5 w-5 text-foreground transition-colors" />
          </button>
        </SidebarTooltip>
      </div>

      <div className="h-[1px] w-4 bg-border dark:bg-muted" />

      <LogoutButton onLogout={onLogout} />
    </>
  );
};

export default SidebarActions;
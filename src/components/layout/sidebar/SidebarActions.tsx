import { Settings } from "lucide-react";
import SidebarTooltip from "../SidebarTooltip";
import ThemeToggle from "./ThemeToggle";
import LogoutButton from "./LogoutButton";
import { useState } from "react";
import SettingsModal from "@/components/settings/SettingsModal";

interface SidebarActionsProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  themePreference?: string;
}

const SidebarActions = ({ isDarkMode, onToggleDarkMode, themePreference }: SidebarActionsProps) => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const getThemeTooltip = () => {
    switch (themePreference) {
      case 'light':
        return "Schakel naar donkere modus";
      case 'dark':
        return "Gebruik systeem thema";
      default:
        return "Schakel naar lichte modus";
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
        <SidebarTooltip label="Instellingen">
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

      <LogoutButton />

      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
};

export default SidebarActions;
import { Settings } from "lucide-react";
import SidebarTooltip from "../SidebarTooltip";
import ThemeToggle from "./ThemeToggle";
import LogoutButton from "./LogoutButton";
import { useState } from "react";
import SettingsModal from "@/components/settings/SettingsModal";

interface SidebarActionsProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const SidebarActions = ({ isDarkMode, onToggleDarkMode }: SidebarActionsProps) => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <div className="px-3">
        <SidebarTooltip label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
          <ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleDarkMode} />
        </SidebarTooltip>
      </div>

      <div className="px-3">
        <SidebarTooltip label="Settings">
          <button
            onClick={() => setSettingsOpen(true)}
            className="group flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:bg-muted dark:hover:bg-gray-700"
            aria-label="Settings"
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
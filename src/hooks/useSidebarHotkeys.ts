import { useHotkeys } from "react-hotkeys-hook";

interface UseSidebarHotkeysProps {
  toggleSidebar: () => void;
  toggleTheme: () => void;
  openSettings: () => void;
  handleLogout: () => void;
}

export const useSidebarHotkeys = ({
  toggleSidebar,
  toggleTheme,
  openSettings,
  handleLogout,
}: UseSidebarHotkeysProps) => {
  useHotkeys('meta+option+s, ctrl+alt+s', toggleSidebar, { preventDefault: true });
  useHotkeys('meta+option+l, ctrl+alt+l', toggleTheme, { preventDefault: true });
  useHotkeys('meta+option+,, ctrl+alt+,', openSettings, { preventDefault: true });
  useHotkeys('meta+option+q, ctrl+alt+q', handleLogout, { preventDefault: true });
};
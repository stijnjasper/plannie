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
  useHotkeys('alt+s, option+s', (e) => {
    e.preventDefault();
    console.log('[Hotkeys] Sidebar toggle triggered');
    toggleSidebar();
  });
  
  useHotkeys('alt+l, option+l', (e) => {
    e.preventDefault();
    console.log('[Hotkeys] Theme toggle triggered');
    toggleTheme();
  });
  
  useHotkeys('alt+,, option+,', (e) => {
    e.preventDefault();
    console.log('[Hotkeys] Settings triggered');
    openSettings();
  });
  
  useHotkeys('alt+q, option+q', (e) => {
    e.preventDefault();
    console.log('[Hotkeys] Logout triggered');
    handleLogout();
  });
};
import { useHotkeys as useHotkeysHook } from "react-hotkeys-hook";
import { useHotkeys } from "@/contexts/HotkeysContext";

const GlobalHotkeys = () => {
  const { toggleSidebar, toggleTheme, openSettings, handleLogout } = useHotkeys();

  useHotkeysHook('alt+s, option+s', (e) => {
    e.preventDefault();
    console.log('[Hotkeys] Sidebar toggle triggered');
    toggleSidebar();
  });
  
  useHotkeysHook('alt+l, option+l', (e) => {
    e.preventDefault();
    console.log('[Hotkeys] Theme toggle triggered');
    toggleTheme();
  });
  
  useHotkeysHook('alt+i, option+i', (e) => {
    e.preventDefault();
    console.log('[Hotkeys] Settings triggered');
    openSettings();
  });
  
  useHotkeysHook('alt+q, option+q', (e) => {
    e.preventDefault();
    console.log('[Hotkeys] Logout triggered');
    handleLogout();
  });

  return null;
};

export default GlobalHotkeys;
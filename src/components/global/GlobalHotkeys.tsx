import { useHotkeys } from "react-hotkeys-hook";
import { useHotkeysContext } from "@/contexts/HotkeysContext";

const GlobalHotkeys = () => {
  const { toggleSidebar, openSettings, handleLogout } = useHotkeysContext();

  useHotkeys('alt+s, option+s', (e) => {
    e.preventDefault();
    console.log('[Hotkeys] Sidebar toggle triggered');
    toggleSidebar();
  });
  
  useHotkeys('alt+i, option+i', (e) => {
    e.preventDefault();
    console.log('[Hotkeys] Settings triggered');
    openSettings();
  });
  
  useHotkeys('alt+q, option+q', (e) => {
    e.preventDefault();
    console.log('[Hotkeys] Logout triggered');
    handleLogout();
  });

  return null;
};

export default GlobalHotkeys;
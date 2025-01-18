import { useHotkeys } from "react-hotkeys-hook";
import { useHotkeysContext } from "@/contexts/HotkeysContext";
import { useTheme } from "@/contexts/ThemeContext";

const GlobalHotkeys = () => {
  const { toggleSidebar, openSettings, handleLogout } = useHotkeysContext();
  const { toggleTheme, themePreference } = useTheme();

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

  useHotkeys('alt+l, option+l', (e) => {
    e.preventDefault();
    console.log('[Hotkeys] Theme toggle triggered, current theme:', themePreference);
    
    // Only toggle between light and dark
    if (themePreference === 'system') {
      // If currently on system, switch to light mode first
      toggleTheme('light');
    } else {
      // Toggle between light and dark
      toggleTheme(themePreference === 'light' ? 'dark' : 'light');
    }
  });

  return null;
};

export default GlobalHotkeys;
import { useHotkeys } from "react-hotkeys-hook";
import { useTheme } from "@/contexts/ThemeContext";

const ThemeHotkey = () => {
  const { toggleTheme, themePreference } = useTheme();

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

export default ThemeHotkey;
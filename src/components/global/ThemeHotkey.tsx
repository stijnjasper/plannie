import { useHotkeys } from "react-hotkeys-hook";
import { useTheme } from "@/contexts/ThemeContext";

const ThemeHotkey = () => {
  const { toggleTheme } = useTheme();

  useHotkeys('alt+l, option+l', (e) => {
    e.preventDefault();
    console.log('[Hotkeys] Theme toggle triggered');
    toggleTheme();
  });

  return null;
};

export default ThemeHotkey;
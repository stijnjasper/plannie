import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const ThemeToggle = ({ isDarkMode, onToggleDarkMode }: ThemeToggleProps) => {
  return (
    <button
      onClick={onToggleDarkMode}
      className="group flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:bg-muted dark:hover:bg-gray-700"
      aria-label="Toggle theme"
    >
      {isDarkMode ? (
        <Moon className="h-5 w-5 text-foreground transition-colors" />
      ) : (
        <Sun className="h-5 w-5 text-foreground transition-colors" />
      )}
    </button>
  );
};

export default ThemeToggle;
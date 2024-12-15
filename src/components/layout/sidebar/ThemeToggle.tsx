import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

const ThemeToggle = ({ isDarkMode, onToggle }: ThemeToggleProps) => {
  return (
    <button
      onClick={onToggle}
      className="group flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:bg-gray-100 dark:hover:bg-gray-700"
      aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDarkMode ? (
        <Sun className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      ) : (
        <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      )}
    </button>
  );
};

export default ThemeToggle;
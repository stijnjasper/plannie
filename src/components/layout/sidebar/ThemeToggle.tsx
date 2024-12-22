import { Moon, Sun } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

const ThemeToggle = ({ isDarkMode, onToggle }: ThemeToggleProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onToggle}
          className="group flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:bg-muted dark:hover:bg-gray-700"
          aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5 text-foreground transition-colors" />
          ) : (
            <Moon className="h-5 w-5 text-foreground transition-colors" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" className="bg-background border-border text-foreground dark:bg-background dark:text-foreground">
        <p className="text-sm font-medium">
          {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </p>
      </TooltipContent>
    </Tooltip>
  );
};

export default ThemeToggle;
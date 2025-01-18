import { Moon, Sun, SunMoon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useProfile } from "@/hooks/useProfile";
import { useTheme } from "@/contexts/ThemeContext";

const ThemeToggle = () => {
  const { profile } = useProfile();
  const { toggleTheme } = useTheme();

  const getIcon = () => {
    if (profile?.theme_preference === "system") {
      return <SunMoon className="h-5 w-5 text-foreground transition-colors" />;
    }
    return profile?.theme_preference === "dark" ? (
      <Sun className="h-5 w-5 text-foreground transition-colors" />
    ) : (
      <Moon className="h-5 w-5 text-foreground transition-colors" />
    );
  };

  const getTooltipText = () => {
    switch (profile?.theme_preference) {
      case 'light':
        return "Schakel naar donkere modus (⌥/Alt + L)";
      case 'dark':
        return "Gebruik systeem thema (⌥/Alt + L)";
      default:
        return "Schakel naar lichte modus (⌥/Alt + L)";
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={() => {
            console.log("[ThemeToggle] Theme toggle clicked");
            toggleTheme();
          }}
          className="group flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:bg-muted dark:hover:bg-gray-700"
          aria-label={getTooltipText()}
        >
          {getIcon()}
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="right"
        className="bg-background border-border text-foreground dark:bg-background dark:border-gray-800"
      >
        <p className="text-sm font-medium">{getTooltipText()}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default ThemeToggle;
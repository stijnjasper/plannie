import { Moon, Sun, SunMoon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

const ThemeToggle = ({ isDarkMode, onToggle }: ThemeToggleProps) => {
  const session = useSession();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      console.log("[ThemeToggle] Fetching profile for theme preference");
      const { data, error } = await supabase
        .from("profiles")
        .select("theme_preference")
        .eq("id", session?.user?.id)
        .single();

      if (error) {
        console.error("[ThemeToggle] Error fetching profile:", error);
        throw error;
      }
      
      console.log("[ThemeToggle] Theme preference data:", data);
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const getIcon = () => {
    if (profile?.theme_preference === "system") {
      return <SunMoon className="h-5 w-5 text-foreground transition-colors" />;
    }
    return isDarkMode ? (
      <Sun className="h-5 w-5 text-foreground transition-colors" />
    ) : (
      <Moon className="h-5 w-5 text-foreground transition-colors" />
    );
  };

  const getTooltipText = () => {
    switch (profile?.theme_preference) {
      case 'light':
        return "Schakel naar donkere modus";
      case 'dark':
        return "Gebruik systeem thema";
      default:
        return "Schakel naar lichte modus";
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={() => {
            console.log("[ThemeToggle] Theme toggle clicked");
            onToggle();
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
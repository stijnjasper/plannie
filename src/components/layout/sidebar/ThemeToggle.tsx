import { Moon, Sun, SunMoon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

const ThemeToggle = ({ isDarkMode, onToggle }: ThemeToggleProps) => {
  const session = useSession();
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      console.log("[ThemeToggle] Fetching profile for theme preference");
      const { data, error } = await supabase
        .from("profiles")
        .select("theme_preference")
        .eq("id", session?.user?.id)
        .maybeSingle();

      if (error) {
        console.error("[ThemeToggle] Error fetching profile:", error);
        throw error;
      }
      
      console.log("[ThemeToggle] Theme preference data:", data);
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const updateTheme = useMutation({
    mutationFn: async () => {
      if (!session?.user?.id) {
        console.error("[ThemeToggle] No user ID available for theme update");
        throw new Error("No user ID available");
      }

      console.log("[ThemeToggle] Starting theme update for user:", session.user.id);
      let newTheme: string;
      
      if (profile?.theme_preference === 'light') {
        newTheme = 'dark';
      } else if (profile?.theme_preference === 'dark') {
        newTheme = 'system';
      } else {
        newTheme = 'light';
      }

      console.log("[ThemeToggle] Updating theme to:", newTheme);
      const { error } = await supabase
        .from("profiles")
        .update({ theme_preference: newTheme })
        .eq("id", session.user.id);

      if (error) {
        console.error("[ThemeToggle] Error updating theme:", error);
        throw error;
      }

      console.log("[ThemeToggle] Theme update successful");
      return newTheme;
    },
    onSuccess: () => {
      console.log("[ThemeToggle] Invalidating profile queries after theme update");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      onToggle();
    },
    onError: (error) => {
      console.error("[ThemeToggle] Mutation error:", error);
      toast.error("Er ging iets mis bij het updaten van het thema");
    }
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
            updateTheme.mutate();
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
import { Moon, Sun, SunMoon } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useSession } from "@supabase/auth-helpers-react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

const SidebarThemeToggle = ({ isDarkMode, onToggle }: ThemeToggleProps) => {
  const session = useSession();
  const { profile } = useProfile();
  const queryClient = useQueryClient();

  const updateTheme = async () => {
    if (!session?.user?.id) {
      console.error("[ThemeToggle] No user ID available for theme update");
      return;
    }

    let newTheme: string;
    if (profile?.theme_preference === 'light') {
      newTheme = 'dark';
    } else if (profile?.theme_preference === 'dark') {
      newTheme = 'system';
    } else {
      newTheme = 'light';
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ theme_preference: newTheme })
        .eq("id", session.user.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["profile"] });
      onToggle();
    } catch (error) {
      console.error("[ThemeToggle] Error updating theme:", error);
      toast.error("Er ging iets mis bij het updaten van het thema");
    }
  };

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
        return "Schakel naar donkere modus (⌥/Alt + L)";
      case 'dark':
        return "Gebruik systeem thema (⌥/Alt + L)";
      default:
        return "Schakel naar lichte modus (⌥/Alt + L)";
    }
  };

  return (
    <button
      onClick={updateTheme}
      className="group flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:bg-muted dark:hover:bg-gray-700"
      aria-label={getTooltipText()}
    >
      {getIcon()}
    </button>
  );
};

export default SidebarThemeToggle;
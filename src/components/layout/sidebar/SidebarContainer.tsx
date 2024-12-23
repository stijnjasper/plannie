import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import SidebarNavigation from "./SidebarNavigation";
import SidebarActions from "./SidebarActions";
import SidebarProfile from "./SidebarProfile";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const SidebarContainer = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const session = useSession();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("theme_preference")
        .eq("id", session?.user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    const handleThemeChange = () => {
      if (profile?.theme_preference === "system") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setIsDarkMode(prefersDark);
        if (prefersDark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } else {
        const isDark = profile?.theme_preference === "dark";
        setIsDarkMode(isDark);
        if (isDark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    };

    handleThemeChange();

    if (profile?.theme_preference === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", handleThemeChange);

      return () => {
        mediaQuery.removeEventListener("change", handleThemeChange);
      };
    }
  }, [profile?.theme_preference]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="relative">
      <div className="fixed left-0 top-0 z-50 flex h-auto flex-col transition-all duration-300 ease-in-out w-[72px]">
        <div
          className={cn(
            "m-4 flex flex-col items-center gap-3 rounded-2xl bg-background shadow-[0px_2px_10px_rgba(0,0,0,0.08)] transition-all duration-300 ease-in-out py-3",
            "animate-in slide-in-from-left"
          )}
        >
          <SidebarNavigation isExpanded={isExpanded} onToggle={() => setIsExpanded(!isExpanded)} />

          {isExpanded && (
            <>
              <div className="h-[1px] w-4 dark:bg-muted bg-border" />
              <SidebarActions isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
              <SidebarProfile />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidebarContainer;
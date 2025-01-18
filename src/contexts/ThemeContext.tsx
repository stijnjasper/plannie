import React, { createContext, useContext, useEffect, useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { profile } = useProfile();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (profile?.theme_preference === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(prefersDark);
      document.documentElement.classList.toggle("dark", prefersDark);
    } else {
      const isDark = profile?.theme_preference === "dark";
      setIsDarkMode(isDark);
      document.documentElement.classList.toggle("dark", isDark);
    }
  }, [profile?.theme_preference]);

  const toggleTheme = async () => {
    try {
      if (!profile?.id) {
        console.error("[ThemeContext] No user ID available for theme update");
        return;
      }

      let newTheme: string;
      if (profile.theme_preference === 'light') {
        newTheme = 'dark';
      } else if (profile.theme_preference === 'dark') {
        newTheme = 'system';
      } else {
        newTheme = 'light';
      }

      const { error } = await supabase
        .from("profiles")
        .update({ theme_preference: newTheme })
        .eq("id", profile.id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["profile"] });
    } catch (error) {
      console.error("[ThemeContext] Error updating theme:", error);
      toast.error("Er ging iets mis bij het updaten van het thema");
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
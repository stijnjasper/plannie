import React, { createContext, useContext, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';
import { toast } from 'sonner';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => Promise<void>;
  themePreference?: string;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { profile } = useProfile();
  const session = useSession();

  const toggleTheme = async () => {
    if (!session?.user?.id) return;

    let newTheme;
    if (profile?.theme_preference === 'light') {
      newTheme = 'dark';
    } else if (profile?.theme_preference === 'dark') {
      newTheme = 'system';
    } else {
      newTheme = 'light';
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ theme_preference: newTheme })
        .eq('id', session.user.id);

      if (error) throw error;
    } catch (error) {
      console.error('[ThemeContext] Error in toggleTheme:', error);
      toast.error('Er ging iets mis bij het updaten van het thema');
    }
  };

  useEffect(() => {
    const handleThemeChange = () => {
      if (profile?.theme_preference === "system") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (prefersDark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } else {
        const isDark = profile?.theme_preference === "dark";
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
      return () => mediaQuery.removeEventListener("change", handleThemeChange);
    }
  }, [profile?.theme_preference]);

  const isDarkMode = document.documentElement.classList.contains('dark');

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, themePreference: profile?.theme_preference }}>
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
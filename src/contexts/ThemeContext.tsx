import React, { createContext, useContext, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';
import { toast } from 'sonner';

type ThemePreference = 'light' | 'dark' | 'system';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: (newTheme?: ThemePreference) => Promise<void>;
  themePreference?: string;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { profile } = useProfile();
  const session = useSession();

  const toggleTheme = async (newTheme?: ThemePreference) => {
    console.log('[Theme] Toggle theme called, current preference:', profile?.theme_preference);
    
    if (!session?.user?.id) return;

    // If a specific theme is provided, use that
    if (newTheme) {
      console.log('[Theme] Setting specific theme:', newTheme);
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ theme_preference: newTheme })
          .eq('id', session.user.id);

        if (error) throw error;
        
        console.log('[Theme] Theme update successful');
      } catch (error) {
        console.error('[ThemeContext] Error in toggleTheme:', error);
        toast.error('Er ging iets mis bij het updaten van het thema');
      }
      return;
    }

    // Otherwise cycle through the themes as before
    let nextTheme: ThemePreference;
    if (profile?.theme_preference === 'light') {
      nextTheme = 'dark';
    } else if (profile?.theme_preference === 'dark') {
      nextTheme = 'system';
    } else {
      nextTheme = 'light';
    }

    console.log('[Theme] Setting new theme to:', nextTheme);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ theme_preference: nextTheme })
        .eq('id', session.user.id);

      if (error) throw error;
      
      console.log('[Theme] Theme update successful');
    } catch (error) {
      console.error('[ThemeContext] Error in toggleTheme:', error);
      toast.error('Er ging iets mis bij het updaten van het thema');
    }
  };

  useEffect(() => {
    const handleThemeChange = () => {
      console.log('[Theme] Handling theme change, preference:', profile?.theme_preference);
      
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

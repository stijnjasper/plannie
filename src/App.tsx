import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { MantineProvider, createTheme } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import AuthGuard from "./components/layout/AuthGuard";
import { useEffect, useState } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const theme = createTheme({
  primaryColor: 'green',
  defaultRadius: 'md',
  components: {
    Popover: {
      defaultProps: {
        zIndex: 9999
      }
    },
    DatePickerInput: {
      styles: (theme) => ({
        input: {
          '&[data-dark]': {
            backgroundColor: 'var(--mantine-color-dark-7)',
            borderColor: 'var(--mantine-color-dark-4)',
            color: 'var(--mantine-color-dark-0)',
          }
        },
        dropdown: {
          '&[data-dark]': {
            backgroundColor: 'var(--mantine-color-dark-7)',
            borderColor: 'var(--mantine-color-dark-4)',
          }
        }
      })
    }
  }
});

const App = () => {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check if dark mode is active
    const isDarkMode = document.documentElement.classList.contains('dark');
    setColorScheme(isDarkMode ? 'dark' : 'light');

    // Create observer for dark mode changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          setColorScheme(isDark ? 'dark' : 'light');
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <MantineProvider theme={theme} defaultColorScheme={colorScheme}>
      <DatesProvider settings={{ locale: 'nl', firstDayOfWeek: 1 }}>
        <QueryClientProvider client={queryClient}>
          <SessionContextProvider supabaseClient={supabase}>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/"
                    element={
                      <AuthGuard>
                        <Index />
                      </AuthGuard>
                    }
                  />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </SessionContextProvider>
        </QueryClientProvider>
      </DatesProvider>
    </MantineProvider>
  );
};

export default App;
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { MantineProvider, createTheme } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import { ThemeProvider } from "@/contexts/ThemeContext";
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
        withinPortal: true,
        zIndex: 9999,
        shadow: 'md',
        position: 'bottom'
      },
      styles: (theme) => ({
        dropdown: {
          backgroundColor: theme.colorScheme === 'dark' ? '#171717' : '#FFFFFF',
          borderColor: theme.colorScheme === 'dark' ? 'rgb(40, 40, 40)' : '#E5E7EB',
          color: theme.colorScheme === 'dark' ? '#f0f0f0' : '#374151'
        }
      })
    },
    
    DatePickerInput: {
      styles: (theme) => ({
        input: {
          backgroundColor: theme.colorScheme === 'dark' ? '#171717' : '#FFFFFF',
          borderColor: theme.colorScheme === 'dark' ? 'rgb(40, 40, 40)' : '#E5E7EB',
          color: theme.colorScheme === 'dark' ? '#f0f0f0' : '#374151'
        },
        calendar: {
          backgroundColor: theme.colorScheme === 'dark' ? '#171717' : '#FFFFFF',
          borderColor: theme.colorScheme === 'dark' ? 'rgb(40, 40, 40)' : '#E5E7EB'
        },
        day: {
          '&[data-selected]': {
            backgroundColor: '#34C759',
            color: '#FFFFFF'
          }
        }
      })
    },

    Select: {
      defaultProps: {
        withinPortal: true,
        zIndex: 9999
      },
      styles: (theme) => ({
        input: {
          backgroundColor: theme.colorScheme === 'dark' ? '#171717' : '#FFFFFF',
          borderColor: theme.colorScheme === 'dark' ? 'rgb(40, 40, 40)' : '#E5E7EB',
          color: theme.colorScheme === 'dark' ? '#f0f0f0' : '#374151'
        },
        dropdown: {
          backgroundColor: theme.colorScheme === 'dark' ? '#171717' : '#FFFFFF',
          borderColor: theme.colorScheme === 'dark' ? 'rgb(40, 40, 40)' : '#E5E7EB'
        },
        item: {
          color: theme.colorScheme === 'dark' ? '#f0f0f0' : '#374151',
          '&[data-selected]': {
            backgroundColor: '#34C759',
            color: '#FFFFFF'
          },
          '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? '#262626' : '#F3F4F6'
          }
        }
      })
    },

    Menu: {
      styles: (theme) => ({
        dropdown: {
          backgroundColor: theme.colorScheme === 'dark' ? '#171717' : '#FFFFFF',
          borderColor: theme.colorScheme === 'dark' ? 'rgb(40, 40, 40)' : '#E5E7EB'
        },
        item: {
          color: theme.colorScheme === 'dark' ? '#f0f0f0' : '#374151',
          '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? '#262626' : '#F3F4F6'
          }
        }
      })
    }
  }
});

const App = () => {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setColorScheme(isDarkMode ? 'dark' : 'light');

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
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <ThemeProvider>
          <TooltipProvider>
            <MantineProvider theme={theme} defaultColorScheme={colorScheme}>
              <DatesProvider settings={{ locale: 'nl', firstDayOfWeek: 1 }}>
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
              </DatesProvider>
            </MantineProvider>
          </TooltipProvider>
        </ThemeProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
};

export default App;
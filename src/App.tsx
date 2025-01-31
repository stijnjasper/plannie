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
      styles: ({ colorScheme }) => ({
        dropdown: {
          backgroundColor: colorScheme === 'dark' ? 'var(--mantine-color-dark-7)' : 'var(--mantine-color-white)',
          borderColor: colorScheme === 'dark' ? 'var(--mantine-color-dark-border)' : 'var(--mantine-color-gray-3)',
          color: colorScheme === 'dark' ? 'var(--mantine-color-white)' : 'var(--mantine-color-dark)'
        }
      })
    },
    
    DatePickerInput: {
      defaultProps: {
        withinPortal: true,
        zIndex: 9999,
      },
      styles: ({ colorScheme }) => ({
        input: {
          backgroundColor: colorScheme === 'dark' ? 'var(--mantine-color-dark-7)' : 'var(--mantine-color-white)',
          borderColor: colorScheme === 'dark' ? 'var(--mantine-color-dark-border)' : 'var(--mantine-color-gray-3)',
          color: colorScheme === 'dark' ? 'var(--mantine-color-white)' : 'var(--mantine-color-dark)',
        },
        dropdown: {
          backgroundColor: colorScheme === 'dark' ? 'var(--mantine-color-dark-7)' : 'var(--mantine-color-white)',
          borderColor: colorScheme === 'dark' ? 'var(--mantine-color-dark-border)' : 'var(--mantine-color-gray-3)',
        },
        day: {
          color: colorScheme === 'dark' ? 'var(--mantine-color-white)' : 'var(--mantine-color-dark)',
          '&[data-selected]': {
            backgroundColor: 'var(--mantine-color-green-filled)',
            color: 'var(--mantine-color-white)',
          },
          '&:hover': {
            backgroundColor: colorScheme === 'dark' ? 'var(--mantine-color-dark-6)' : 'var(--mantine-color-gray-1)',
          }
        }
      })
    },

    Select: {
      defaultProps: {
        withinPortal: true,
        zIndex: 9999
      },
      styles: ({ colorScheme }) => ({
        input: {
          backgroundColor: colorScheme === 'dark' ? 'var(--mantine-color-dark-7)' : 'var(--mantine-color-white)',
          borderColor: colorScheme === 'dark' ? 'var(--mantine-color-dark-border)' : 'var(--mantine-color-gray-3)',
          color: colorScheme === 'dark' ? 'var(--mantine-color-white)' : 'var(--mantine-color-dark)',
        },
        dropdown: {
          backgroundColor: colorScheme === 'dark' ? 'var(--mantine-color-dark-7)' : 'var(--mantine-color-white)',
          borderColor: colorScheme === 'dark' ? 'var(--mantine-color-dark-border)' : 'var(--mantine-color-gray-3)',
        },
        item: {
          color: colorScheme === 'dark' ? 'var(--mantine-color-white)' : 'var(--mantine-color-dark)',
          '&[data-selected]': {
            backgroundColor: 'var(--mantine-color-green-filled)',
            color: 'var(--mantine-color-white)',
          },
          '&:hover': {
            backgroundColor: colorScheme === 'dark' ? 'var(--mantine-color-dark-6)' : 'var(--mantine-color-gray-1)',
          }
        }
      })
    },

    Menu: {
      styles: ({ colorScheme }) => ({
        dropdown: {
          backgroundColor: colorScheme === 'dark' ? 'var(--mantine-color-dark-7)' : 'var(--mantine-color-white)',
          borderColor: colorScheme === 'dark' ? 'var(--mantine-color-dark-border)' : 'var(--mantine-color-gray-3)',
        },
        item: {
          color: colorScheme === 'dark' ? 'var(--mantine-color-white)' : 'var(--mantine-color-dark)',
          '&:hover': {
            backgroundColor: colorScheme === 'dark' ? 'var(--mantine-color-dark-6)' : 'var(--mantine-color-gray-1)',
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
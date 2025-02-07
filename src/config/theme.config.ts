
import { MantineThemeOverride } from '@mantine/core';

// Base colors using CSS variables
export const themeTokens = {
  background: 'var(--background)',
  foreground: 'var(--foreground)',
  border: 'var(--border)',
  input: 'var(--input)',
  ring: 'var(--ring)',
  muted: 'var(--muted)',
  mutedForeground: 'var(--muted-foreground)',
} as const;

// Mantine specific theme configuration
export const mantineTheme: MantineThemeOverride = {
  primaryColor: 'green',
  defaultRadius: 'md',
  components: {
    Select: {
      styles: (theme) => ({
        input: {
          backgroundColor: 'var(--background)',
          borderColor: 'var(--border)',
          color: 'var(--foreground)',
          cursor: 'pointer',
          '&:hover': {
            borderColor: theme.colorScheme === 'dark' ? 'rgb(60, 60, 60)' : '#D1D5DB'
          }
        },
        dropdown: {
          backgroundColor: 'var(--background)',
          borderColor: 'var(--border)',
          zIndex: 9999
        },
        option: {
          color: 'var(--foreground)',
          '&[data-selected]': {
            backgroundColor: '#34C759',
            color: '#FFFFFF'
          },
          '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? '#262626' : '#F3F4F6'
          }
        }
      })
    }
  }
};

// Theme utility functions
export const getThemeColor = (colorKey: keyof typeof themeTokens) => {
  return themeTokens[colorKey];
};


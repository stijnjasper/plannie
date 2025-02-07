
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
      styles: () => ({
        input: {
          backgroundColor: 'var(--background)',
          borderColor: 'var(--border)',
          color: 'var(--foreground)',
          cursor: 'pointer',
          '&:hover': {
            borderColor: 'var(--border)'
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
            backgroundColor: 'var(--muted)',
            color: 'var(--foreground)'
          },
          '&:hover': {
            backgroundColor: 'var(--muted)'
          }
        },
        item: {
          '&[data-selected]': {
            backgroundColor: 'var(--muted)',
            color: 'var(--foreground)'
          }
        }
      })
    },
    Menu: {
      styles: () => ({
        dropdown: {
          backgroundColor: 'var(--background)',
          borderColor: 'var(--border)',
          zIndex: 9999
        },
        item: {
          color: 'var(--foreground)',
          '&:hover': {
            backgroundColor: 'var(--muted)'
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

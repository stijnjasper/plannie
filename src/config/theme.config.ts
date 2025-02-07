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
            borderColor: 'var(--border)'
          }
        },
        dropdown: {
          backgroundColor: 'var(--background)',
          borderColor: 'var(--border)',
          border: '1px solid var(--border)',
          zIndex: 9999
        },
        option: {
          color: 'var(--foreground)',
          '&[data-selected]': {
            backgroundColor: 'var(--primary)',
            color: 'var(--primary-foreground)'
          },
          '&:hover': {
            backgroundColor: 'var(--primary)',
            color: 'var(--primary-foreground)'
          }
        },
        item: {
          '&[data-selected]': {
            backgroundColor: 'var(--primary)',
            color: 'var(--primary-foreground)'
          }
        }
      })
    },
    Menu: {
      styles: {
        root: {
          '.mantine-Menu-dropdown': {
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border)',
            border: '1px solid var(--border)',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            zIndex: 9999
          },
          '.mantine-Menu-item': {
            color: 'var(--foreground)',
            '&:hover': {
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)'
            }
          }
        }
      }
    }
  }
};

// Theme utility functions
export const getThemeColor = (colorKey: keyof typeof themeTokens) => {
  return themeTokens[colorKey];
};
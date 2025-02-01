import { Select, MantineTheme, MantineColorScheme } from '@mantine/core';
import { useEffect } from 'react';

interface ThemeSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

const ThemeSelector = ({ value, onValueChange }: ThemeSelectorProps) => {
  useEffect(() => {
    console.log('[ThemeSelector] Current value:', value);
  }, [value]);

  return (
    <div>
      <label className="text-sm font-medium mb-1.5 block">Thema</label>
      <Select
        value={value}
        onChange={(newValue) => {
          console.log('[ThemeSelector] New value selected:', newValue);
          if (newValue) {
            onValueChange(newValue);
          }
        }}
        data={[
          { value: 'system', label: 'Gebruik systeeminstelling' },
          { value: 'dark', label: 'Donker' },
          { value: 'light', label: 'Licht' }
        ]}
        className="w-full"
        comboboxProps={{ 
          position: 'bottom',
          withinPortal: false,
          zIndex: 9999
        }}
        styles={(theme: MantineTheme & { colorScheme: MantineColorScheme }) => ({
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
        })}
      />
    </div>
  );
};

export default ThemeSelector;
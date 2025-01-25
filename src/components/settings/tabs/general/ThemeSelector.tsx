import { Select } from '@mantine/core';
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
          withinPortal: true,
          zIndex: 9999,
          position: 'bottom-start'
        }}
        styles={(theme) => ({
          input: {
            cursor: 'pointer',
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
            borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[4],
            color: theme.colorScheme === 'dark' ? theme.white : theme.black,
          },
          dropdown: {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
            borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[4],
            zIndex: 9999,
          },
          option: {
            cursor: 'pointer',
            '&[data-selected]': {
              backgroundColor: theme.colors.green[6],
              color: theme.white,
            },
            '&:hover': {
              backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[1],
            },
            color: theme.colorScheme === 'dark' ? theme.white : theme.black,
          },
        })}
      />
    </div>
  );
};

export default ThemeSelector;
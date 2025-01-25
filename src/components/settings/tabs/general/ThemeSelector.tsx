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
        comboboxProps={{ withinPortal: true }}
        styles={{
          input: {
            cursor: 'pointer'
          },
          option: {
            cursor: 'pointer',
            '&[data-selected]': {
              backgroundColor: 'var(--mantine-color-green-6) !important',
              color: 'var(--mantine-color-white)',
            },
            '&:hover': {
              backgroundColor: 'var(--mantine-color-gray-1)',
              '[data-mantine-color-scheme="dark"] &': {
                backgroundColor: 'var(--mantine-color-dark-4)',
              },
            },
          },
          dropdown: {
            zIndex: 9999
          }
        }}
      />
    </div>
  );
};

export default ThemeSelector;
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
          position: 'bottom',
          withinPortal: false,
          zIndex: 9999
        }}
        styles={{
          input: {
            cursor: 'pointer',
            backgroundColor: 'var(--muted)',
            borderColor: 'var(--border)',
            '&[data-dark]': {
              backgroundColor: 'var(--muted)',
              borderColor: 'var(--border)',
              color: 'var(--foreground)',
            }
          },
          dropdown: {
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border)',
            zIndex: 9999,
            '&[data-dark]': {
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border)',
            }
          },
          option: {
            cursor: 'pointer',
            '&[data-selected]': {
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)',
            },
            '&:hover': {
              backgroundColor: 'var(--muted)',
              '&[data-dark]': {
                backgroundColor: 'var(--muted)',
              }
            },
            '&[data-dark]': {
              color: 'var(--foreground)',
            }
          },
        }}
      />
    </div>
  );
};

export default ThemeSelector;
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
      <label className="text-sm font-medium mb-1.5 block text-foreground dark:text-gray-100">Thema</label>
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
            backgroundColor: '#171717',
            borderColor: 'rgb(40 40 40)',
            color: '#f0f0f0',
            '&:hover': {
              borderColor: 'rgb(60 60 60)',
            },
            '&[data-dark]': {
              backgroundColor: '#171717',
              borderColor: 'rgb(40 40 40)',
              color: '#f0f0f0',
            }
          },
          dropdown: {
            backgroundColor: '#171717',
            borderColor: 'rgb(40 40 40)',
            zIndex: 9999,
            '&[data-dark]': {
              backgroundColor: '#171717',
              borderColor: 'rgb(40 40 40)',
            }
          },
          option: {
            cursor: 'pointer',
            color: '#f0f0f0',
            '&[data-selected]': {
              backgroundColor: '#34C759',
              color: '#FFFFFF',
            },
            '&:hover': {
              backgroundColor: '#262626',
              '&[data-dark]': {
                backgroundColor: '#262626',
              }
            },
            '&[data-dark]': {
              color: '#f0f0f0',
            }
          },
        }}
      />
    </div>
  );
};

export default ThemeSelector;
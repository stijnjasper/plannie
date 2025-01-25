import { Select } from '@mantine/core';

interface ThemeSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

const ThemeSelector = ({ value, onValueChange }: ThemeSelectorProps) => {
  return (
    <div>
      <label className="text-sm font-medium mb-1.5 block">Thema</label>
      <Select
        value={value}
        onChange={(newValue) => onValueChange(newValue || 'system')}
        data={[
          { value: 'system', label: 'Gebruik systeeminstelling' },
          { value: 'dark', label: 'Donker' },
          { value: 'light', label: 'Licht' }
        ]}
        className="w-full"
        styles={{
          option: {
            '&[data-selected]': {
              backgroundColor: 'var(--mantine-color-green-6) !important',
              color: 'var(--mantine-color-white)',
              
              '&:hover': {
                backgroundColor: 'var(--mantine-color-green-6) !important',
              },
            },
            '&:hover': {
              backgroundColor: 'var(--mantine-color-gray-1)',
            },
            '[data-mantine-color-scheme="dark"] &:hover': {
              backgroundColor: 'var(--mantine-color-dark-4)',
            },
          },
        }}
      />
    </div>
  );
};

export default ThemeSelector;
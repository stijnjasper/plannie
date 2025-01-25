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
        styles={(theme) => ({
          item: {
            '&[data-selected]': {
              '&, &:hover': {
                backgroundColor: theme.colors.green[6],
                color: theme.white,
              },
            },
            '&[data-hovered]': {
              backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[1],
            },
          },
        })}
      />
    </div>
  );
};

export default ThemeSelector;
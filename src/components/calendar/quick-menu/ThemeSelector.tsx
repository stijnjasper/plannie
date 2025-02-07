
import { useEffect } from 'react';
import ThemedSelect from '@/components/ui/select/ThemedSelect';

interface ThemeSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

const ThemeSelector = ({ value, onValueChange }: ThemeSelectorProps) => {
  useEffect(() => {
    console.log('[ThemeSelector] Current value:', value);
  }, [value]);

  return (
    <ThemedSelect
      label="Thema"
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
    />
  );
};

export default ThemeSelector;

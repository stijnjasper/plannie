import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ThemeSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

const ThemeSelector = ({ value, onValueChange }: ThemeSelectorProps) => {
  return (
    <div>
      <label className="text-sm font-medium mb-1.5 block">Thema</label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="system">Gebruik systeeminstelling</SelectItem>
          <SelectItem value="dark">Donker</SelectItem>
          <SelectItem value="light">Licht</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ThemeSelector;
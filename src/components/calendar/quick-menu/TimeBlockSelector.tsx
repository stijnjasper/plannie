import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface TimeBlockSelectorProps {
  value: 2 | 4 | 6 | 8;
  onChange: (value: 2 | 4 | 6 | 8) => void;
}

const TimeBlockSelector = ({ value, onChange }: TimeBlockSelectorProps) => {
  const handleTimeBlockChange = (newValue: string) => {
    onChange(Number(newValue) as 2 | 4 | 6 | 8);
  };

  return (
    <div className="space-y-2">
      <Label>Time Block</Label>
      <RadioGroup
        value={value.toString()}
        onValueChange={handleTimeBlockChange}
        className="flex gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="2" id="2-hours" />
          <Label htmlFor="2-hours">2 hours</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="4" id="4-hours" />
          <Label htmlFor="4-hours">4 hours</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="6" id="6-hours" />
          <Label htmlFor="6-hours">6 hours</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="8" id="8-hours" />
          <Label htmlFor="8-hours">8 hours</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default TimeBlockSelector;
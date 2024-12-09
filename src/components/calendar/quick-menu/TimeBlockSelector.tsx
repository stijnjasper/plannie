import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface TimeBlockSelectorProps {
  value: "whole-day" | "morning" | "afternoon";
  onChange: (value: "whole-day" | "morning" | "afternoon") => void;
}

const TimeBlockSelector = ({ value, onChange }: TimeBlockSelectorProps) => {
  const handleTimeBlockChange = (newValue: string) => {
    if (newValue === "whole-day" || newValue === "morning" || newValue === "afternoon") {
      onChange(newValue);
    }
  };

  return (
    <div className="space-y-2">
      <Label>Time Block</Label>
      <RadioGroup
        value={value}
        onValueChange={handleTimeBlockChange}
        className="flex gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="whole-day" id="whole-day" />
          <Label htmlFor="whole-day">Whole Day</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="morning" id="morning" />
          <Label htmlFor="morning">Morning</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="afternoon" id="afternoon" />
          <Label htmlFor="afternoon">Afternoon</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default TimeBlockSelector;
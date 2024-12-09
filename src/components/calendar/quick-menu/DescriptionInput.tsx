import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

const DescriptionInput = ({ value, onChange }: DescriptionInputProps) => {
  return (
    <div className="space-y-2">
      <Label>Description</Label>
      <Textarea
        placeholder="Add a description..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-24"
      />
    </div>
  );
};

export default DescriptionInput;
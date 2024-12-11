import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DescriptionInputProps {
  description: string;
  onDescriptionChange: (value: string) => void;
}

const DescriptionInput = ({ description, onDescriptionChange }: DescriptionInputProps) => {
  return (
    <div className="space-y-2">
      <Label>Description</Label>
      <Textarea
        placeholder="Add a description..."
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        className="h-24"
      />
    </div>
  );
};

export default DescriptionInput;
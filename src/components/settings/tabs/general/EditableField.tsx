import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EditableFieldProps {
  label: string;
  value: string;
  isEditing: boolean;
  newValue: string;
  onNewValueChange: (value: string) => void;
  onEditToggle: () => void;
  onSave: () => void;
  type?: string;
}

const EditableField = ({
  label,
  value,
  isEditing,
  newValue,
  onNewValueChange,
  onEditToggle,
  onSave,
  type = "text",
}: EditableFieldProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 max-w-md">
        <label className="text-sm font-medium mb-1.5 block">{label}</label>
        {isEditing ? (
          <Input
            value={newValue}
            onChange={(e) => onNewValueChange(e.target.value)}
            placeholder={value}
            type={type}
          />
        ) : (
          <Input value={value} readOnly className="bg-muted" />
        )}
      </div>
      <Button
        variant="outline"
        className="mt-6 whitespace-nowrap"
        onClick={() => {
          if (isEditing) {
            onSave();
          } else {
            onEditToggle();
          }
        }}
      >
        {isEditing ? "Opslaan" : `${label} wijzigen`}
      </Button>
    </div>
  );
};

export default EditableField;
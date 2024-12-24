import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FormFieldProps {
  label: string;
  value: string;
  isEditing: boolean;
  newValue: string;
  onNewValueChange: (value: string) => void;
  onEditToggle: () => void;
  onSave: () => void;
  type?: string;
}

const FormField = ({
  label,
  value,
  isEditing,
  newValue,
  onNewValueChange,
  onEditToggle,
  onSave,
  type = "text",
}: FormFieldProps) => {
  return (
    <div className="flex items-center gap-6">
      <div className="flex-1">
        <label className="text-sm font-medium mb-1.5 block">{label}</label>
        <Input
          value={isEditing ? newValue : value}
          onChange={(e) => onNewValueChange(e.target.value)}
          placeholder={value}
          type={type}
          readOnly={!isEditing}
          className={!isEditing ? "bg-muted" : ""}
        />
      </div>
      <Button
        variant="outline"
        className="mt-6 w-32"
        onClick={() => {
          if (isEditing) {
            onSave();
          } else {
            onEditToggle();
          }
        }}
      >
        {isEditing ? "Opslaan" : label === "Gewenste naam" ? "Naam wijzigen" : `${label} wijzigen`}
      </Button>
    </div>
  );
};

export default FormField;
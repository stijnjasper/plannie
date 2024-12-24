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
  description?: string;
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
  description,
}: FormFieldProps) => {
  const getButtonLabel = () => {
    if (isEditing) return "Opslaan";
    if (label === "Gewenste naam") return "Naam wijzigen";
    return `${label} wijzigen`;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <label className="text-sm font-medium">{label}</label>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <Button
          variant="outline"
          className="px-4"
          onClick={() => {
            if (isEditing) {
              onSave();
            } else {
              onEditToggle();
            }
          }}
        >
          {getButtonLabel()}
        </Button>
      </div>
      <Input
        value={isEditing ? newValue : value}
        onChange={(e) => onNewValueChange(e.target.value)}
        placeholder={value}
        type={type}
        readOnly={!isEditing}
        className={!isEditing ? "bg-muted" : ""}
      />
    </div>
  );
};

export default FormField;
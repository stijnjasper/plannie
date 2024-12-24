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
  const getButtonLabel = () => {
    if (isEditing) return "Opslaan";
    if (label === "Gewenste naam") return "Naam wijzigen";
    return `${label} wijzigen`;
  };

  return (
    <div className="flex items-center gap-6">
      <div className="w-[280px]">
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
        className="mt-6 whitespace-nowrap px-4"
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
  );
};

export default FormField;
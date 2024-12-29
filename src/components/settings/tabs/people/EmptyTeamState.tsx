import { UserPlus } from "lucide-react";
import { useState } from "react";

const EmptyTeamState = () => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  return (
    <div 
      className={`
        flex flex-col items-center justify-center p-8 text-center 
        border-2 border-dashed border-muted-foreground/20 rounded-lg 
        bg-muted/50 transition-colors duration-200
        ${isDraggingOver ? 'bg-primary/10 border-primary cursor-copy' : ''}
      `}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDraggingOver(true);
      }}
      onDragLeave={() => setIsDraggingOver(false)}
      onDrop={() => setIsDraggingOver(false)}
    >
      <UserPlus className={`h-8 w-8 mb-2 transition-colors duration-200 ${
        isDraggingOver ? 'text-primary' : 'text-muted-foreground'
      }`} />
      <p className={`text-sm transition-colors duration-200 ${
        isDraggingOver ? 'text-primary' : 'text-muted-foreground'
      }`}>
        Dit team heeft nog geen leden
      </p>
    </div>
  );
};

export default EmptyTeamState;
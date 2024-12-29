import { UserPlus } from "lucide-react";

interface EmptyTeamStateProps {
  isDraggingOver: boolean;
}

const EmptyTeamState = ({ isDraggingOver }: EmptyTeamStateProps) => {
  return (
    <div 
      className={`
        flex flex-col items-center justify-center p-8 text-center 
        border-2 border-dashed rounded-lg 
        transition-colors duration-200
        ${isDraggingOver 
          ? 'border-primary bg-primary/10' 
          : 'border-muted-foreground/20 bg-muted/50'
        }
      `}
    >
      <UserPlus 
        className={`
          h-8 w-8 mb-2 
          transition-colors duration-200
          ${isDraggingOver ? 'text-primary' : 'text-muted-foreground'}
        `} 
      />
      <p 
        className={`
          text-sm 
          transition-colors duration-200
          ${isDraggingOver ? 'text-primary' : 'text-muted-foreground'}
        `}
      >
        Dit team heeft nog geen leden
      </p>
    </div>
  );
};

export default EmptyTeamState;
import { UserPlus } from "lucide-react";
import { useState } from "react";

const EmptyTeamState = () => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  return (
    <div 
      className={`
        flex flex-col items-center justify-center p-8 text-center 
        border-2 border-dashed rounded-lg 
        transition-colors duration-200
        ${isDraggingOver 
          ? 'border-primary bg-primary/10 cursor-copy' 
          : 'border-muted-foreground/20 bg-muted/50'
        }
      `}
      onDragOver={(e) => {
        e.preventDefault();
        if (!isDraggingOver) {
          setIsDraggingOver(true);
          console.log('🎯 Drag over event triggered');
          console.log('Event target:', e.target);
          console.log('isDraggingOver set to:', true);
        }
      }}
      onDragLeave={(e) => {
        // Only trigger if we're actually leaving the component
        const relatedTarget = e.relatedTarget as Element;
        console.log('👋 Drag leave event triggered');
        console.log('Related target:', relatedTarget);
        console.log('Current target:', e.currentTarget);
        
        // Check if we're actually leaving the drop zone
        if (!e.currentTarget.contains(relatedTarget)) {
          setIsDraggingOver(false);
          console.log('isDraggingOver set to:', false);
        } else {
          console.log('Ignoring drag leave - still within component');
        }
      }}
      onDrop={(e) => {
        e.preventDefault();
        console.log('🎪 Drop event triggered');
        setIsDraggingOver(false);
        console.log('isDraggingOver set to:', false);
      }}
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
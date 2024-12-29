import { UserPlus } from "lucide-react";

const EmptyTeamState = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-muted-foreground/20 rounded-lg bg-muted/50">
      <UserPlus className="h-8 w-8 text-muted-foreground mb-2" />
      <p className="text-sm text-muted-foreground">
        Dit team heeft nog geen leden
      </p>
    </div>
  );
};

export default EmptyTeamState;
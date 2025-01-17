import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarTooltipProps {
  label: string;
  children: React.ReactNode;
}

const SidebarTooltip = ({ label, children }: SidebarTooltipProps) => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent 
          side="right" 
          className="z-[9999] bg-background border-border text-foreground dark:bg-background dark:border-gray-800"
          sideOffset={5}
        >
          <p className="text-sm font-medium">{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SidebarTooltip;
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
          className="bg-white border shadow-md"
          sideOffset={5}
        >
          <p className="text-sm font-medium text-gray-700">{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SidebarTooltip;
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarIconProps {
  expanded: boolean;
  onClick: () => void;
}

const SidebarIcon = ({ expanded, onClick }: SidebarIconProps) => {
  const getTooltipText = () => {
    return expanded 
      ? "Zijbalk inklappen (⌥/Alt + S)" 
      : "Zijbalk uitklappen (⌥/Alt + S)";
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className="group flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:bg-muted dark:hover:bg-gray-700"
          aria-label={expanded ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          <svg 
            className="h-sidebar-icon w-sidebar-icon text-foreground transition-colors"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.25 16.5L13.75 11L8.25 5.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              transform={expanded ? "rotate(180 11 11)" : ""}
            />
          </svg>
        </button>
      </TooltipTrigger>
      <TooltipContent 
        side="right"
        className="z-[60] bg-background border-border text-foreground dark:bg-background dark:border-gray-800"
      >
        <p className="text-sm font-medium">{getTooltipText()}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default SidebarIcon;
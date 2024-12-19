import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarIconProps {
  expanded: boolean;
  onClick: () => void;
}

const SidebarIcon = forwardRef<HTMLButtonElement, SidebarIconProps>(
  ({ expanded, onClick }, ref) => {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            ref={ref}
            onClick={onClick}
            className="group flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label={expanded ? "Collapse Sidebar" : "Extend Sidebar"}
            aria-expanded={expanded}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={cn(
                "text-gray-700 dark:text-gray-300 transition-transform duration-200",
                expanded ? "rotate-0" : "rotate-180"
              )}
            >
              <path
                d="M3 7C3 5.89543 3.89543 5 5 5H19C20.1046 5 21 5.89543 21 7V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V7Z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M15 5V19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-background border-border text-foreground dark:bg-background dark:text-foreground">
          <p className="text-sm font-medium">
            {expanded ? "Collapse Sidebar" : "Extend Sidebar"}
          </p>
        </TooltipContent>
      </Tooltip>
    );
  }
);

SidebarIcon.displayName = "SidebarIcon";

export default SidebarIcon;
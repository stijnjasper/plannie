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
            className="group flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:bg-muted dark:hover:bg-gray-700"
            aria-label={expanded ? "Collapse Sidebar" : "Extend Sidebar"}
            aria-expanded={expanded}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={cn(
                "text-gray-700 dark:text-gray-300 transition-transform duration-200",
                expanded ? "rotate-0" : "rotate-180"
              )}
            >
              <path
                d="M9.5 3.99988L11 3.99988"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
              />
              <path
                d="M9.5 6.49988L11 6.49988"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
              />
              <path
                d="M0.959867 10.2685C1.114 11.7092 2.2727 12.8679 3.71266 13.0284C4.78221 13.1476 5.88037 13.25 7 13.25C8.11963 13.25 9.21779 13.1476 10.2873 13.0284C11.7273 12.8679 12.886 11.7092 13.0401 10.2685C13.1539 9.20502 13.25 8.11315 13.25 7C13.25 5.88684 13.1539 4.79498 13.0401 3.73147C12.886 2.29082 11.7273 1.13211 10.2873 0.971609C9.21779 0.852392 8.11963 0.75 7 0.75C5.88037 0.75 4.78221 0.852392 3.71266 0.971609C2.2727 1.13211 1.114 2.29082 0.959867 3.73147C0.846083 4.79498 0.75 5.88684 0.75 7C0.75 8.11315 0.846083 9.20502 0.959867 10.2685Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
              />
              <path
                d="M7.5 0.756592L7.5 13.2435"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
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
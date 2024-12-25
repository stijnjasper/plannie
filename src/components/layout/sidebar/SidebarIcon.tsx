import { ArrowLeft, ArrowRight } from "lucide-react";

interface SidebarIconProps {
  expanded: boolean;
  onClick: () => void;
}

const SidebarIcon = ({ expanded, onClick }: SidebarIconProps) => {
  return (
    <button
      onClick={onClick}
      className="group flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:bg-muted dark:hover:bg-gray-700"
      aria-label={expanded ? "Collapse Sidebar" : "Expand Sidebar"}
    >
      {expanded ? (
        <ArrowLeft className="h-sidebar-icon w-sidebar-icon text-foreground transition-colors" />
      ) : (
        <ArrowRight className="h-sidebar-icon w-sidebar-icon text-foreground transition-colors" />
      )}
    </button>
  );
};

export default SidebarIcon;
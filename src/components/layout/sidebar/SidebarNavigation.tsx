import SidebarTooltip from "../SidebarTooltip";
import SidebarIcon from "./SidebarIcon";

interface SidebarNavigationProps {
  isExpanded: boolean;
  onToggle: () => void;
}

const SidebarNavigation = ({ isExpanded, onToggle }: SidebarNavigationProps) => {
  return (
    <div className="w-full py-3">
      <SidebarTooltip label={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}>
        <SidebarIcon expanded={isExpanded} onClick={onToggle} />
      </SidebarTooltip>
    </div>
  );
};

export default SidebarNavigation;
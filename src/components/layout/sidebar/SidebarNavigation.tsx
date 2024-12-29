import SidebarTooltip from "../SidebarTooltip";
import SidebarIcon from "./SidebarIcon";

interface SidebarNavigationProps {
  isExpanded: boolean;
  onToggle: () => void;
}

const SidebarNavigation = ({ isExpanded, onToggle }: SidebarNavigationProps) => {
  return (
    <div className="w-full py-1.2">
      <SidebarTooltip label={isExpanded ? "Zijbalk inklappen" : "Zijbalk uitklappen"}>
        <SidebarIcon expanded={isExpanded} onClick={onToggle} />
      </SidebarTooltip>
    </div>
  );
};

export default SidebarNavigation;
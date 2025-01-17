interface SidebarNavigationProps {
  isExpanded: boolean;
  onToggle: () => void;
}

const SidebarNavigation = ({ isExpanded, onToggle }: SidebarNavigationProps) => {
  return (
    <div className="w-full py-1.2">
      <SidebarIcon expanded={isExpanded} onClick={onToggle} />
    </div>
  );
};

export default SidebarNavigation;
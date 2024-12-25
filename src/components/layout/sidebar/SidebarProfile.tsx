import SidebarTooltip from "../SidebarTooltip";
import UserAvatar from "@/components/common/UserAvatar";

const SidebarProfile = () => {
  return (
    <div className="pb-3">
      <SidebarTooltip label="User Profile">
        <UserAvatar />
      </SidebarTooltip>
    </div>
  );
};

export default SidebarProfile;
import { useProfile } from "@/hooks/useProfile";
import UserAvatar from "@/components/common/UserAvatar";
import SidebarTooltip from "../../SidebarTooltip";

const SidebarProfile = () => {
  const { profile } = useProfile();

  return (
    <div className="px-3">
      <SidebarTooltip label="Profiel">
        <button
          className="group flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:bg-muted dark:hover:bg-gray-700"
          aria-label="Profiel"
        >
          <UserAvatar className="h-7 w-7" />
        </button>
      </SidebarTooltip>
    </div>
  );
};

export default SidebarProfile;
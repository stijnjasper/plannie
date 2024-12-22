import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SidebarTooltip from "../SidebarTooltip";

const SidebarProfile = () => {
  return (
    <div className="pb-3">
      <SidebarTooltip label="User Profile">
        <Avatar className="h-8 w-8 cursor-pointer transition-opacity hover:opacity-80">
          <AvatarImage src="https://github.com/shadcn.png" alt="User" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </SidebarTooltip>
    </div>
  );
};

export default SidebarProfile;
import { Moon, Sun, Settings } from "lucide-react";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SidebarTooltip from "./SidebarTooltip";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div className="relative">
      {/* Sidebar Container */}
      <div
        className={`fixed left-0 top-0 z-50 flex h-auto flex-col transition-all duration-300 ease-in-out ${
          isExpanded ? "w-[72px]" : "w-[72px]"
        }`}
      >
        {/* Main Sidebar Content */}
        <div
          className={`m-4 flex flex-col items-center gap-4 rounded-2xl bg-white p-3 shadow-[0px_2px_10px_rgba(0,0,0,0.08)] transition-all duration-300 ease-in-out ${
            isExpanded ? "opacity-100" : "opacity-100"
          }`}
        >
          {/* Toggle Button - Now integrated into the sidebar */}
          <SidebarTooltip label={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="group flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:bg-gray-100"
              aria-label="Toggle Sidebar"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-700"
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
          </SidebarTooltip>

          {/* Theme Toggle */}
          <SidebarTooltip label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="group flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:bg-gray-100"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-gray-700" />
              ) : (
                <Moon className="h-5 w-5 text-gray-700" />
              )}
            </button>
          </SidebarTooltip>

          {/* Settings */}
          <SidebarTooltip label="Settings">
            <button
              className="group flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:bg-gray-100"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5 text-gray-700" />
            </button>
          </SidebarTooltip>

          <Separator className="h-[1px] w-6 bg-[#B9B9B9]" />

          {/* Avatar */}
          <SidebarTooltip label="User Profile">
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src="https://github.com/shadcn.png" alt="User" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </SidebarTooltip>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
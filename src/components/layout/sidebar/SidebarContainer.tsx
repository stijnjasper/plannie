import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import SidebarNavigation from "./SidebarNavigation";
import SidebarActions from "./SidebarActions";
import SidebarProfile from "./SidebarProfile";

const SidebarContainer = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="relative">
      <div className="fixed left-0 top-0 z-50 flex h-auto flex-col transition-all duration-300 ease-in-out w-[72px]">
        <div className={cn(
          "m-4 flex flex-col items-center gap-3 rounded-2xl bg-background shadow-[0px_2px_10px_rgba(0,0,0,0.08)] transition-all duration-300 ease-in-out py-3",
          "animate-in slide-in-from-left"
        )}>
          <SidebarNavigation 
            isExpanded={isExpanded} 
            onToggle={() => setIsExpanded(!isExpanded)} 
          />
          
          <div className="h-[1px] w-4 bg-border dark:bg-muted" />

          {isExpanded && (
            <>
              <SidebarActions 
                isDarkMode={isDarkMode} 
                onToggleDarkMode={toggleDarkMode} 
              />
              <SidebarProfile />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidebarContainer;
import { LogOut } from "lucide-react";
import SidebarTooltip from "../SidebarTooltip";
import { useState } from "react";

interface LogoutButtonProps {
  onLogout: () => void;
}

const LogoutButton = ({ onLogout }: LogoutButtonProps) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleClick = async () => {
    if (isLoggingOut) return;
    
    try {
      setIsLoggingOut(true);
      await onLogout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="px-3">
      <SidebarTooltip label="Uitloggen (⌥/Alt + Q)">
        <button
          onClick={handleClick}
          disabled={isLoggingOut}
          className={`group flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:bg-muted dark:hover:bg-gray-700 ${
            isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-label="Uitloggen"
        >
          <LogOut className="h-5 w-5 text-foreground transition-colors" />
        </button>
      </SidebarTooltip>
    </div>
  );
};

export default LogoutButton;
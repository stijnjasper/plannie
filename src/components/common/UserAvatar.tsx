import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfileWithRealtime } from "@/hooks/useProfileWithRealtime";

interface UserAvatarProps {
  className?: string;
  showTooltip?: boolean;
}

const UserAvatar = ({ className, showTooltip = false }: UserAvatarProps) => {
  const { profile, isLoading, error } = useProfileWithRealtime();

  console.log("[UserAvatar] Rendering with profile:", profile);
  console.log("[UserAvatar] Loading state:", isLoading);
  if (error) console.error("[UserAvatar] Error:", error);

  if (isLoading) {
    console.log("[UserAvatar] Showing loading skeleton");
    return <Skeleton className={`h-8 w-8 rounded-full ${className}`} />;
  }

  if (error || !profile) {
    console.log("[UserAvatar] Showing fallback avatar");
    return (
      <Avatar className={`h-8 w-8 ${className}`}>
        <AvatarFallback>?</AvatarFallback>
      </Avatar>
    );
  }

  console.log("[UserAvatar] Showing user avatar with URL:", profile.avatar_url);
  return (
    <Avatar className={`h-8 w-8 cursor-pointer transition-opacity hover:opacity-80 ${className}`}>
      <AvatarImage 
        src={profile.avatar_url || undefined} 
        alt={profile.full_name || "User"} 
      />
      <AvatarFallback>
        {profile.full_name?.charAt(0) || "U"}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
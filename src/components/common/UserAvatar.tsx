import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile } from "@/hooks/useProfile";

interface UserAvatarProps {
  className?: string;
  showTooltip?: boolean;
}

const UserAvatar = ({ className, showTooltip = false }: UserAvatarProps) => {
  const { profile, isLoading, error } = useProfile();

  if (isLoading) {
    return <Skeleton className={`h-8 w-8 rounded-full ${className}`} />;
  }

  if (error || !profile) {
    return (
      <Avatar className={`h-8 w-8 ${className}`}>
        <AvatarFallback>?</AvatarFallback>
      </Avatar>
    );
  }

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  return (
    <Avatar className={`h-8 w-8 cursor-pointer transition-opacity hover:opacity-80 ${className}`}>
      <AvatarImage 
        src={profile.avatar_url || undefined} 
        alt={profile.full_name || "User"} 
      />
      <AvatarFallback>
        {getInitials(profile.full_name)}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
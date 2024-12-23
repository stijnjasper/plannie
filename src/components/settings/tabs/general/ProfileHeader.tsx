import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileHeaderProps {
  avatarUrl?: string | null;
  fullName?: string | null;
}

const ProfileHeader = ({ avatarUrl, fullName }: ProfileHeaderProps) => {
  return (
    <div className="flex items-start gap-4">
      <Avatar className="h-16 w-16">
        <AvatarImage src={avatarUrl || "https://github.com/shadcn.png"} alt={fullName || "User"} />
        <AvatarFallback>{fullName?.charAt(0) || "U"}</AvatarFallback>
      </Avatar>
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Mijn profiel</h2>
        <p className="text-sm text-muted-foreground">
          Beheer je persoonlijke gegevens en voorkeuren
        </p>
      </div>
    </div>
  );
};

export default ProfileHeader;
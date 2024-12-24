import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@supabase/auth-helpers-react";
import { Upload } from "lucide-react";

interface AvatarUploadProps {
  avatarUrl?: string | null;
  fullName?: string | null;
  onAvatarUpdate?: (url: string) => Promise<void>;
}

const AvatarUpload = ({ avatarUrl, fullName, onAvatarUpdate }: AvatarUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const user = useUser();

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      const file = event.target.files?.[0];
      if (!file || !user) {
        return;
      }

      // Remove old file if it exists
      if (avatarUrl) {
        const oldFilePath = avatarUrl.split('/').pop();
        if (oldFilePath) {
          await supabase.storage
            .from('avatars')
            .remove([oldFilePath]);
        }
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        toast.error("Upload mislukt: " + uploadError.message);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      if (onAvatarUpdate) {
        await onAvatarUpdate(publicUrl);
      }

      toast.success("Avatar succesvol geüpload");

    } catch (error: any) {
      toast.error("Er is een fout opgetreden: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-20 w-20">
        <AvatarImage src={avatarUrl || ''} alt="Avatar" />
        <AvatarFallback>
          {fullName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          className="relative"
          disabled={uploading}
        >
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading}
          />
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? 'Uploading...' : 'Upload avatar'}
        </Button>
        <p className="text-sm text-muted-foreground">
          Aanbevolen: vierkante afbeelding, maximaal 1MB
        </p>
      </div>
    </div>
  );
};

export default AvatarUpload;
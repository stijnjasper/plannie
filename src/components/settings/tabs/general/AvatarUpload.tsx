import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
    <div className="relative group">
      <Avatar className="h-20 w-20">
        <AvatarImage src={avatarUrl || ''} alt="Avatar" />
        <AvatarFallback>
          {fullName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
        <Upload className="h-6 w-6 text-white" />
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  );
};

export default AvatarUpload;
import { useState, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImagePlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AvatarUploadProps {
  avatarUrl?: string | null;
  fullName?: string | null;
  onAvatarUpdate: (url: string) => Promise<void>;
}

const AvatarUpload = ({ avatarUrl, fullName, onAvatarUpdate }: AvatarUploadProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      toast.error("De afbeelding mag niet groter zijn dan 1MB");
      return;
    }

    try {
      setIsUploading(true);
      const uploadToast = toast.loading("Avatar wordt geüpload...");
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.dismiss(uploadToast);
        toast.error("Geen gebruiker gevonden");
        return;
      }

      // Eerst het oude bestand verwijderen als het bestaat
      if (avatarUrl) {
        const oldFilePath = avatarUrl.split('/').pop();
        if (oldFilePath) {
          await supabase.storage
            .from('avatars')
            .remove([oldFilePath]);
        }
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast.dismiss(uploadToast);
        toast.error(`Upload mislukt: ${uploadError.message}`);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      await onAvatarUpdate(publicUrl);
      toast.dismiss(uploadToast);
      toast.success("Avatar succesvol bijgewerkt");
      
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error("Er is iets misgegaan bij het uploaden van de avatar");
    } finally {
      setIsUploading(false);
    }
  }, [avatarUrl, onAvatarUpdate]);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Avatar className="h-16 w-16 cursor-pointer">
        <AvatarImage 
          src={avatarUrl || undefined} 
          alt={fullName || "User"} 
          className={isUploading ? "opacity-50" : ""}
        />
        <AvatarFallback>{fullName?.charAt(0) || "U"}</AvatarFallback>
      </Avatar>
      
      {isHovered && !isUploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            <ImagePlus className="h-6 w-6 text-white" />
          </label>
        </div>
      )}
    </div>
  );
};

export default AvatarUpload;
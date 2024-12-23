import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImagePlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface AvatarUploadProps {
  avatarUrl?: string | null;
  fullName?: string | null;
  onAvatarUpdate: (url: string) => Promise<void>;
}

const AvatarUpload = ({ avatarUrl, fullName, onAvatarUpdate }: AvatarUploadProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (1MB = 1024 * 1024 bytes)
    if (file.size > 1024 * 1024) {
      toast({
        title: "Fout",
        description: "De afbeelding mag niet groter zijn dan 1MB",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // Create a unique file path for the user's avatar
      const fileExt = file.name.split('.').pop();
      const userId = (await supabase.auth.getUser()).data.user?.id;
      const filePath = `${userId}/avatar.${fileExt}`;

      // Upload the file to Supabase storage
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { 
          upsert: true,
          contentType: file.type 
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update the profile with the new avatar URL
      await onAvatarUpdate(publicUrl);

      toast({
        description: "Avatar succesvol bijgewerkt",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Fout",
        description: "Het uploaden van de afbeelding is mislukt. Probeer het opnieuw.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

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
      
      {isHovered && (
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
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@supabase/auth-helpers-react";
import { Upload } from "lucide-react";

const AvatarUpload = () => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const user = useUser();

  useEffect(() => {
    if (user) {
      getProfile();
    }
  }, [user]);

  const getProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user?.id)
        .single();

      if (error) {
        throw error;
      }

      setAvatarUrl(data?.avatar_url);
    } catch (error) {
      console.error('Error loading avatar:', error);
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      const file = event.target.files?.[0];
      if (!file || !user) {
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
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        toast({
          variant: "destructive",
          title: "Upload mislukt",
          description: uploadError.message
        });
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) {
        toast({
          variant: "destructive",
          title: "Profiel update mislukt",
          description: updateError.message
        });
        return;
      }

      setAvatarUrl(publicUrl);
      toast({
        title: "Success",
        description: "Avatar succesvol geüpload"
      });

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-20 w-20">
        <AvatarImage src={avatarUrl || ''} alt="Avatar" />
        <AvatarFallback>
          {user?.email?.charAt(0).toUpperCase() || 'U'}
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
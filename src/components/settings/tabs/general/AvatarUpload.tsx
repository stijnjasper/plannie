import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { Upload, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AvatarUploadProps {
  avatarUrl?: string | null;
  fullName?: string | null;
  onAvatarUpdate?: (url: string | null) => Promise<void>;
}

const AvatarUpload = ({ avatarUrl, fullName, onAvatarUpdate }: AvatarUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const session = useSession();

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      console.log("Starting upload process");

      const file = event.target.files?.[0];
      if (!file) {
        console.log("No file selected");
        return;
      }

      if (!session?.user?.id) {
        console.log("No active session found", session);
        toast.error("Er is een probleem met je sessie. Probeer opnieuw in te loggen.");
        return;
      }

      if (avatarUrl) {
        console.log("Removing old avatar");
        const oldFilePath = avatarUrl.split('/').pop();
        if (oldFilePath) {
          const { error: removeError } = await supabase.storage
            .from('avatars')
            .remove([oldFilePath]);
          if (removeError) {
            console.error("Error removing old avatar:", removeError);
          }
        }
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${session.user.id}-${Math.random()}.${fileExt}`;
      console.log("New file name:", fileName);

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      console.log("Upload response:", { uploadError, uploadData });

      if (uploadError) {
        toast.error("Upload mislukt: " + uploadError.message);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      console.log("Public URL generated:", publicUrl);

      if (onAvatarUpdate) {
        await onAvatarUpdate(publicUrl);
        console.log("Profile updated with new avatar URL");
      }

      toast.success("Avatar succesvol geüpload");

    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error("Er is een fout opgetreden: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const deleteAvatar = async () => {
    try {
      setIsDeleting(true);
      console.log("Starting avatar deletion");
      
      if (!avatarUrl) return;
      
      const fileName = avatarUrl.split('/').pop();
      if (!fileName) return;

      const { error: storageError } = await supabase.storage
        .from('avatars')
        .remove([fileName]);

      console.log("Storage deletion response:", { storageError });

      if (storageError) {
        throw storageError;
      }

      if (onAvatarUpdate) {
        await onAvatarUpdate(null);
        console.log("Profile updated - avatar removed");
      }

      toast.success("Avatar succesvol verwijderd");
      setShowDeleteDialog(false);
    } catch (error: any) {
      console.error("Deletion error:", error);
      toast.error("Er ging iets mis bij het verwijderen van de avatar. Probeer het opnieuw.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="relative group">
        <Avatar className="h-20 w-20">
          <AvatarImage src={avatarUrl || ''} alt="Avatar" />
          <AvatarFallback>
            {fullName?.charAt(0).toUpperCase() || session?.user?.email?.charAt(0).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          {avatarUrl && !uploading && !isDeleting && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteDialog(true);
              }}
              className="absolute top-0 right-0 p-1 bg-background border border-gray-400 dark:border-gray-600 rounded-full text-foreground hover:bg-muted transition-colors z-20"
              aria-label="Delete avatar"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <Upload className="h-6 w-6 text-white" />
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading || isDeleting}
          />
        </div>
        {(uploading || isDeleting) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Avatar verwijderen</AlertDialogTitle>
            <AlertDialogDescription>
              Weet je zeker dat je jouw avatar wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuleren</AlertDialogCancel>
            <AlertDialogAction onClick={deleteAvatar}>Bevestigen</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AvatarUpload;
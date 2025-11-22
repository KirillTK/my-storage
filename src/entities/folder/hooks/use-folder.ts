"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteFolder, restoreFolder } from "~/server/actions/folder.actions";

interface UseFolderParams {
  folderId: string;
  folderName: string;
  parentFolderId?: string | null;
}

export function useFolder({ folderId, folderName, parentFolderId }: UseFolderParams) {
  const router = useRouter();

  const handleFolderDelete = async () => {
    try {
      await deleteFolder(folderId);

      // Show toast with undo action
      toast(`Folder "${folderName}" has been deleted`, {
        description: "You can undo this action",
        action: {
          label: "Undo",
          //eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick: async () => {
            try {
              await restoreFolder(folderId);
              router.refresh();
              toast.success("Folder restored");
            } catch (error) {
              console.error("Failed to restore folder:", error);
              toast.error("Failed to restore folder");
            }
          },
        },
      });

      // Navigate to parent folder or root after deletion
      const redirectUrl = parentFolderId
        ? `/dashboard/${parentFolderId}`
        : "/dashboard";
      router.push(redirectUrl);

      router.refresh();
    } catch (error) {
      console.error("Failed to delete folder:", error);
      toast.error("Failed to delete folder");
    }
  };

  return {
    handleFolderDelete,
  };
}


"use client";
import { useState } from "react";
import { Folder } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { FolderWithChildrenAndDocumentsModel } from "~/server/db/schema";
import { FolderActionsMenu } from "../components/folder-actions-menu";
import { RenameFolderPopover } from "../components/rename-folder-popover";
import { Popover, PopoverAnchor } from "~/shared/components/ui/popover";
import { deleteFolder, restoreFolder } from "~/server/actions/folder.actions";
import Link from "next/link";

interface FolderViewerProps {
  folder: FolderWithChildrenAndDocumentsModel;
}

export function FolderViewer({ folder }: FolderViewerProps) {
  const router = useRouter();
  const [isRenamePopoverOpen, setIsRenamePopoverOpen] = useState(false);

  const handleFolderRename = () => {
    setIsRenamePopoverOpen(true);
  };

  const handleFolderDelete = async () => {
    try {
      await deleteFolder(folder.id);

      // Show toast with undo action
      toast(`Folder "${folder.name}" has been deleted`, {
        description: "You can undo this action",
        action: {
          label: "Undo",
          //eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick: async () => {
            try {
              await restoreFolder(folder.id);
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
      const redirectUrl = folder.parentFolderId
        ? `/dashboard/${folder.parentFolderId}`
        : "/dashboard";
      router.push(redirectUrl);

      router.refresh();
    } catch (error) {
      console.error("Failed to delete folder:", error);
      toast.error("Failed to delete folder");
    }
  };

  const totalItems =
    (folder.documents?.length || 0) + (folder.children?.length || 0);

  return (
    <>
      <Popover
        open={isRenamePopoverOpen}
        onOpenChange={setIsRenamePopoverOpen}
        modal={true}
      >
        <div
          key={folder.id}
          className="group border-border bg-card hover:border-primary relative cursor-pointer rounded-lg border transition-all hover:shadow-md"
        >
          <PopoverAnchor asChild>
            <div className="pointer-events-none absolute inset-0" />
          </PopoverAnchor>

          <Link href={`/dashboard/${folder.id}`}>
            <div className="flex min-w-0 flex-1 items-center gap-3 p-2">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-950">
                <Folder className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-foreground truncate text-base leading-tight font-semibold">
                    {folder.name}
                  </h3>
                  <FolderActionsMenu
                    onRename={handleFolderRename}
                    onDelete={handleFolderDelete}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground text-xs">
                    {totalItems} items
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs font-medium">
                    {folder.updatedAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <RenameFolderPopover
          folderId={folder.id}
          currentName={folder.name}
          isOpen={isRenamePopoverOpen}
          onOpenChange={setIsRenamePopoverOpen}
        />
      </Popover>
    </>
  );
}

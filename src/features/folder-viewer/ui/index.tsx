"use client";
import { useState } from "react";
import { Folder } from "lucide-react";
import type { FolderWithChildrenAndDocumentsModel } from "~/server/db/schema";
import { FolderActionsMenu } from "../components/folder-actions-menu";
import { RenameFolderPopover } from "../components/rename-folder-popover";
import { Popover, PopoverAnchor } from "~/shared/components/ui/popover";
import { useFolder } from "~/entities/folder/hooks/use-folder";
import Link from "next/link";

interface FolderViewerProps {
  folder: FolderWithChildrenAndDocumentsModel;
}

export function FolderViewer({ folder }: FolderViewerProps) {
  const [isRenamePopoverOpen, setIsRenamePopoverOpen] = useState(false);
  const { handleFolderDelete } = useFolder({
    folderId: folder.id,
    folderName: folder.name,
    parentFolderId: folder.parentFolderId,
  });

  const handleFolderRename = () => {
    setIsRenamePopoverOpen(true);
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

          <Link href={`/dashboard/${folder.id}`} prefetch>
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

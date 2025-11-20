'use client';
import { useState } from 'react';
import { Folder } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { FolderWithChildrenAndDocumentsModel } from '~/server/db/schema';
import { FolderActionsMenu } from '../components/folder-actions-menu';
import { RenameFolderPopover } from '../components/rename-folder-popover';
import { Popover, PopoverAnchor } from '@/_shared/components/ui/popover';

interface FolderViewerProps {
  folder: FolderWithChildrenAndDocumentsModel;
}

export function FolderViewer({ folder }: FolderViewerProps) {
  const router = useRouter();
  const [isRenamePopoverOpen, setIsRenamePopoverOpen] = useState(false);

  const handleFolderClick = (folderId: string) => {
    console.log(folderId);
    router.push(`/dashboard/${folderId}`);
  };

  const handleFolderRename = () => {
    setIsRenamePopoverOpen(true);
  };

  const handleFolderDelete = (folderId: string) => {
    console.log(folderId);
  };

  const totalItems = (folder.documents?.length || 0) + (folder.children?.length || 0);

  return (
    <>
      <Popover open={isRenamePopoverOpen} onOpenChange={setIsRenamePopoverOpen} modal={true}>
        <div
          key={folder.id}
          className="group relative rounded-lg border border-border bg-card hover:border-primary hover:shadow-md transition-all cursor-pointer"
        >
          <PopoverAnchor asChild>
            <div className="absolute inset-0 pointer-events-none" />
          </PopoverAnchor>
          <div onClick={() => handleFolderClick(folder.id)} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/15">
                <Folder className="h-6 w-6 text-accent" />
              </div>
              <FolderActionsMenu
                folderId={folder.id}
                onRename={handleFolderRename}
                onDelete={() => handleFolderDelete(folder.id)}
              />
            </div>
            <h3 className="font-medium text-foreground text-balance mb-1">{folder.name}</h3>
            <p className="text-xs text-muted-foreground">
              {totalItems} items
            </p>
          </div>
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
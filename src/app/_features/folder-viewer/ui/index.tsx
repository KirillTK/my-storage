'use client';
import { useState } from 'react';
import { Folder } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { FolderWithChildrenAndDocumentsModel } from '~/server/db/schema';
import { FolderActionsMenu } from '../components/folder-actions-menu';
import { RenameFolderPopover } from '../components/rename-folder-popover';
import { Popover, PopoverAnchor } from '@/_shared/components/ui/popover';
import { deleteFolder, restoreFolder } from '~/server/actions/folder.actions';
import Link from 'next/link';

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
        description: 'You can undo this action',
        action: {
          label: 'Undo',
          //eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick: async () => {
            try {
              await restoreFolder(folder.id);
              router.refresh();
              toast.success('Folder restored');
            } catch (error) {
              console.error('Failed to restore folder:', error);
              toast.error('Failed to restore folder');
            }
          },
        },
      });

      // Navigate to parent folder or root after deletion
      const redirectUrl = folder.parentFolderId ? `/dashboard/${folder.parentFolderId}` : '/dashboard';
      router.push(redirectUrl);

      router.refresh();
    } catch (error) {
      console.error('Failed to delete folder:', error);
      toast.error('Failed to delete folder');
    }
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

          <Link href={`/dashboard/${folder.id}`}>
            <div className="flex items-center gap-3 flex-1 min-w-0 p-2">
              <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Folder className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-base text-foreground truncate leading-tight">{folder.name}</h3>
                  <FolderActionsMenu
                    onRename={handleFolderRename}
                    onDelete={handleFolderDelete}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {totalItems} items
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">{folder.updatedAt.toLocaleDateString()}</p>
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
      </Popover >
    </>
  );
}
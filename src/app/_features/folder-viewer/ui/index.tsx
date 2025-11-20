'use client';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/_shared/components/ui/dropdown-menu';
import { Edit2, Folder, MoreVertical, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '~/app/_shared/components/ui/button';
import type { FolderWithChildrenAndDocumentsModel } from '~/server/db/schema';


interface FolderViewerProps {
  folder: FolderWithChildrenAndDocumentsModel;
}

export function FolderViewer({ folder }: FolderViewerProps) {
  const router = useRouter();

  const handleFolderClick = (folderId: string) => {
    console.log(folderId);
    router.push(`/dashboard/${folderId}`);
  }

  const handleFolderRename = (folderId: string) => {
    console.log(folderId);
  }

  const handleFolderDelete = (folderId: string) => {
    console.log(folderId);
  }

  const totalItems = (folder.documents?.length || 0) + (folder.children?.length || 0);

  return (
    <div
      key={folder.id}
      className="group relative rounded-lg border border-border bg-card hover:border-primary hover:shadow-md transition-all cursor-pointer"
    >
      <div onClick={() => handleFolderClick(folder.id)} className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/15">
            <Folder className="h-6 w-6 text-accent" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleFolderRename(folder.id)}>
                <Edit2 className="mr-2 h-4 w-4" />
                {"Rename"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFolderDelete(folder.id)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                {"Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <h3 className="font-medium text-foreground text-balance mb-1">{folder.name}</h3>
        <p className="text-xs text-muted-foreground">
          {totalItems} {" items"}
        </p>
      </div>
    </div>
  )
}
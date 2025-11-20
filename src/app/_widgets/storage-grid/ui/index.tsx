'use client';
import { Edit2, FileText, Folder, MoreVertical, Trash2 } from 'lucide-react';
import { FolderViewer } from '~/app/_features/folder-viewer/ui';
import { Button } from '~/app/_shared/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/app/_shared/components/ui/dropdown-menu';
import { formatDate, formatFileSize } from '~/app/_shared/lib/formatters.utils';
import type { DocumentModel } from '~/server/db/schema';
import type { FolderModel, FolderWithChildrenAndDocumentsModel } from '~/server/db/schema/folders';

interface StorageGridProps {
  folders: FolderWithChildrenAndDocumentsModel[];
  documents: DocumentModel[];
}

export function StorageGrid({ folders, documents }: StorageGridProps) {



  const handleFileClick = (file: DocumentModel) => {
    console.log(file);
  }

  const handleFileRename = (fileId: string) => {
    console.log(fileId);
  }

  const handleFileDelete = (fileId: string) => {
    console.log(fileId);
  }


  return (
    <div className="p-6">
      {folders.length === 0 && documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Folder className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">{"No items yet"}</h3>
          <p className="text-sm text-muted-foreground">
            {"Create a folder, upload a PDF, or drag and drop files here"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {folders.map((folder) => (
            <FolderViewer key={folder.id} folder={folder} />
          ))}

          {documents.map((file) => (
            <div
              key={file.id}
              className="group relative rounded-lg border border-border bg-card hover:border-primary hover:shadow-md transition-all cursor-pointer"
            >
              <div onClick={() => handleFileClick(file)} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/15">
                    <FileText className="h-6 w-6 text-primary" />
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
                      <DropdownMenuItem onClick={() => handleFileRename(file.id)}>
                        <Edit2 className="mr-2 h-4 w-4" />
                        {"Rename"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleFileDelete(file.id)} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        {"Delete"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <h3 className="font-medium text-foreground text-balance mb-1 break-words">{file.name}</h3>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatFileSize(file.fileSize)}</span>
                  <span>{formatDate(file.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
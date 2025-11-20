'use client';
import { Folder } from 'lucide-react';
import { DocumentViewer } from '@/_features/document-viewer/ui';
import { FolderViewer } from '@/_features/folder-viewer/ui';
import type { DocumentModel } from '~/server/db/schema';
import type { FolderWithChildrenAndDocumentsModel } from '~/server/db/schema';

interface StorageGridProps {
  folders: FolderWithChildrenAndDocumentsModel[];
  documents: DocumentModel[];
}

export function StorageGrid({ folders, documents }: StorageGridProps) {
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
          {documents.map((document) => (
            <DocumentViewer key={document.id} document={document} />
          ))}
        </div>
      )}
    </div>
  )
}
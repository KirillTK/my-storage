"use client";
import { Folder } from "lucide-react";
import { DocumentViewer } from "~/features/document-viewer/ui";
import { FolderViewer } from "~/features/folder-viewer/ui";
import type { DocumentModel } from "~/server/db/schema";
import type { FolderWithChildrenAndDocumentsModel } from "~/server/db/schema";

interface StorageGridProps {
  folders: FolderWithChildrenAndDocumentsModel[];
  documents: DocumentModel[];
}

export function StorageGrid({ folders, documents }: StorageGridProps) {
  return (
    <div>
      {folders.length === 0 && documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-muted mb-4 rounded-full p-4">
            <Folder className="text-muted-foreground h-8 w-8" />
          </div>
          <h3 className="text-foreground mb-1 text-lg font-semibold">
            {"No items yet"}
          </h3>
          <p className="text-muted-foreground text-sm">
            {"Create a folder, upload a files, or drag and drop files here"}
          </p>
        </div>
      ) : (
        <>
          {folders.length > 0 && (
            <div className="mb-6">
              <div className="text-muted-foreground mb-2 text-base font-medium">
                Folders
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {folders.map((folder) => (
                  <FolderViewer key={folder.id} folder={folder} />
                ))}
              </div>
            </div>
          )}
          {documents.length > 0 && (
            <div>
              <div className="text-muted-foreground mb-2 text-base font-medium">
                Documents
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {documents.map((document) => (
                  <DocumentViewer key={document.id} document={document} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

'use client';

import { DragDropZone } from '@/_shared/components/ui/drag-drop-zone';

interface FileDropHandlerProps {
  folderId: string | null;
  children: React.ReactNode;
}

export function FileDropHandler({ folderId, children }: FileDropHandlerProps) {
  return (
    <DragDropZone folderId={folderId}>
      {children}
    </DragDropZone>
  );
}


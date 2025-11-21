'use client';

import { toast } from 'sonner';
import { DragDropZone } from '@/_shared/components/ui/drag-drop-zone';
import { validateUniqueFileNames } from '~/server/actions/validation.actions';
import { useRouter } from 'next/navigation';

interface FileDropHandlerProps {
  folderId: string | null;
  children: React.ReactNode;
}

export function FileDropHandler({ folderId, children }: FileDropHandlerProps) {
  const router = useRouter();

  const handleFileDrop = async (files: File[]) => {
    try {
      const isUnique = await validateUniqueFileNames(files.map((file) => file.name), folderId);

      if (!isUnique) {
        toast.error("File name must be unique");
        return;
      }

      // const promises = files.map((file) => createDocument(file, folderId));

      // console.log(promises);

      // await Promise.allSettled(promises);

      router.refresh();
    } catch (error) {
      console.error('Failed to upload files:', error);

      if (error instanceof Error) {
        toast.error(`${error.message}`, {
          description: "Please try again",
        });
      } else {
        toast.error("Failed to upload files", {
          description: "Please try again",
        });
      }
    }
  };

  return (
    <DragDropZone onFileDrop={handleFileDrop}>
      {children}
    </DragDropZone>
  );
}


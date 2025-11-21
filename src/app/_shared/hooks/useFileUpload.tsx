'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { upload } from '@vercel/blob/client';
import { formatBytes } from '../lib/formatters.utils';
import { createDocumentFromBlob } from '~/server/actions/document.actions';

interface UseFileUploadOptions {
  folderId?: string | null;
  onUploadComplete?: () => void;
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const { folderId, onUploadComplete } = options;
  const router = useRouter();

  const uploadSingleFile = async (file: File): Promise<boolean> => {
    const toastId = toast.loading('Preparing upload...', {
      description: file.name,
    });

    try {
      // Direct upload to Vercel Blob
      const newBlob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
        clientPayload: JSON.stringify({
          folderId,
          fileName: file.name,
          fileSize: file.size
        }),
        onUploadProgress: (progress) => {
          const percentage = (progress.loaded / progress.total) * 100;

          console.log(progress, "progress");

          toast.loading(
            <div className="w-full">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Uploading...</span>
                <span className="text-xs text-muted-foreground">
                  {Math.round(percentage)}%
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {file.name}
              </p>
            </div>,
            {
              id: toastId,
              description: `${formatBytes(progress.loaded)} / ${formatBytes(progress.total)}`,
            }
          );
        },
      });

      console.log(newBlob, "newBlob");

      await createDocumentFromBlob(newBlob, file.name, file.size, file.type, folderId ?? null);

      toast.success('Upload complete', {
        id: toastId,
        description: file.name,
        duration: 2000,
      });

      router.refresh();
      return true;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed', {
        id: toastId,
        description: error instanceof Error ? error.message : 'Failed to upload file',
      });
      return false;
    }
  };

  const uploadFiles = async (files: File[]): Promise<void> => {
    const uploadPromises = files.map(file => uploadSingleFile(file));
    const results = await Promise.allSettled(uploadPromises);

    const hasSuccessfulUpload = results.some(
      result => result.status === 'fulfilled' && result.value === true
    );

    if (hasSuccessfulUpload) {
      router.refresh();
      onUploadComplete?.();
    }
  };

  return {
    uploadFiles,
    uploadSingleFile,
  };
}
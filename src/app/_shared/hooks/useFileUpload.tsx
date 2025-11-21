'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { formatBytes } from '../lib/formatters.utils';

interface UseFileUploadOptions {
  folderId?: string | null;
  onUploadComplete?: () => void;
}

interface UploadProgressData {
  type: 'progress';
  percentage: number;
  loaded: number;
  total: number;
}

interface UploadErrorData {
  type: 'error';
  error?: string;
}

interface UploadSuccessData {
  type: 'success';
}

type UploadStreamData = UploadProgressData | UploadErrorData | UploadSuccessData;

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const { folderId, onUploadComplete } = options;
  const router = useRouter();

  const uploadSingleFile = async (file: File): Promise<boolean> => {
    const toastId = toast.loading('Preparing upload...', {
      description: file.name,
    });

    try {
      const formData = new FormData();
      formData.append('file', file);

      if (folderId) {
        formData.append('folderId', folderId);
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        // Try to parse error from response
        try {
          const errorData = await response.json();
          toast.error('Upload failed', {
            id: toastId,
            description: errorData.error ?? 'Failed to upload file. Please try again.',
          });
        } catch {
          toast.error('Upload failed', {
            id: toastId,
            description: 'Failed to upload file. Please try again.',
          });
        }
        return false;
      }

      // Read the stream
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        toast.error('Upload failed', {
          id: toastId,
          description: 'No response body received.',
        });
        return false;
      }

      let buffer = '';
      let uploadSuccess = false;

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6)) as UploadStreamData;

              if (data.type === 'progress') {
                // Update toast with progress
                toast.loading(
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Uploading...</span>
                      <span className="text-xs text-muted-foreground">
                        {Math.round(data.percentage)}%
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300 ease-out"
                        style={{ width: `${data.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {file.name}
                    </p>
                  </div>,
                  {
                    id: toastId,
                    description: `${formatBytes(data.loaded)} / ${formatBytes(data.total)}`,
                  }
                );
              } else if (data.type === 'error') {
                toast.error('Upload failed', {
                  id: toastId,
                  description: data.error ?? 'Upload failed. Please try again.',
                });
              } else if (data.type === 'success') {
                uploadSuccess = true;
                toast.success('Upload complete', {
                  id: toastId,
                  description: file.name,
                  duration: 2000,
                });
                router.refresh();
              }
            } catch (e) {
              console.error('Failed to parse stream data:', e);
            }
          }
        }
      }

      if (!uploadSuccess) {
        toast.error('Upload failed', {
          id: toastId,
          description: 'Upload completed but no success message received.',
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed', {
        id: toastId,
        description: 'Network error. Please check your connection and try again.',
      });
      return false;
    }
  };

  const uploadFiles = async (files: File[]): Promise<void> => {
    // Upload all files in parallel with individual progress tracking
    const uploadPromises = files.map(file => uploadSingleFile(file));
    
    // Wait for all uploads to complete
    const results = await Promise.allSettled(uploadPromises);
    
    // Check if at least one upload succeeded
    const hasSuccessfulUpload = results.some(
      result => result.status === 'fulfilled' && result.value === true
    );

    // Refresh to show the new documents if any upload succeeded
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


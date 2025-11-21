'use client';

import { Upload } from 'lucide-react';
import { Button } from '~/app/_shared/components/ui/button';
import { UploadDocumentModal } from '../components/upload-document-modal';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUrlFolder } from '~/app/_shared/hooks/useUrlFolder';

type UploadProgress = {
  percentage: number;
  loaded: number;
  total: number;
};

export function UploadDocumentButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const folderId = useUrlFolder();

  const handleUploadDocument = async (
    file: File,
    onProgress?: (progress: UploadProgress) => void,
  ): Promise<{ success: boolean; error?: string }> => {
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
          return {
            success: false,
            error: errorData.error ?? 'Failed to upload file. Please try again.',
          };
        } catch {
          return {
            success: false,
            error: 'Failed to upload file. Please try again.',
          };
        }
      }

      // Read the stream
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        return {
          success: false,
          error: 'No response body received.',
        };
      }

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === 'progress' && onProgress) {
                onProgress({
                  percentage: data.percentage,
                  loaded: data.loaded,
                  total: data.total,
                });
              } else if (data.type === 'error') {
                return {
                  success: false,
                  error: data.error ?? 'Upload failed. Please try again.',
                };
              } else if (data.type === 'success') {
                // Refresh the page to show the new document
                router.refresh();
                return {
                  success: true,
                };
              }
            } catch (e) {
              console.error('Failed to parse stream data:', e);
            }
          }
        }
      }

      // If we get here without success, something went wrong
      return {
        success: false,
        error: 'Upload completed but no success message received.',
      };
    } catch (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection and try again.',
      };
    }
  };

  return (
    <>
      <Button className="gap-2" onClick={() => setOpen(true)}>
        <Upload className="h-4 w-4" />
        {"Upload"}
      </Button>
      <UploadDocumentModal open={open} onOpenChange={setOpen} onConfirm={handleUploadDocument} />
    </>
  );
}
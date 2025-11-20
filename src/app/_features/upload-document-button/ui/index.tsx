'use client';

import { Upload } from 'lucide-react';
import { Button } from '~/app/_shared/components/ui/button';
import { UploadDocumentModal } from '../components/upload-document-modal';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUrlFolder } from '~/app/_shared/hooks/useUrlFolder';

export function UploadDocumentButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const folderId = useUrlFolder();

  const handleUploadDocument = async (file: File): Promise<{ success: boolean; error?: string }> => {
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

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to upload file. Please try again.',
        };
      }

      // Refresh the page to show the new document
      router.refresh();

      return {
        success: true,
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
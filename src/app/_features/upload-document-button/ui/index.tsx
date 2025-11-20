import { Upload } from 'lucide-react';
import { Button } from '~/app/_shared/components/ui/button';
import { UploadDocumentModal } from '../components/upload-document-modal';
import { useState } from 'react';



export function UploadDocumentButton() {
  const [open, setOpen] = useState(false);

  const handleUploadDocument = async (file: File) => {
    'use server';
    console.log(file);
  }

  return (
    <>
      <Button className="gap-2" onClick={() => setOpen(true)}>
        <Upload className="h-4 w-4" />
        {"Upload"}
      </Button>
      <UploadDocumentModal open={open} onOpenChange={setOpen} onConfirm={handleUploadDocument} />
    </>
  )
}
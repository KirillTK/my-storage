"use client";

import { Upload } from "lucide-react";
import { Button } from "~/shared/components/ui/button";
import { UploadDocumentModal } from "../components/upload-document-modal";
import { useState } from "react";
import { useUrlFolder } from "~/shared/hooks/useUrlFolder";
import { useFileUpload } from "~/shared/hooks/useFileUpload";

export function UploadDocumentButton() {
  const [open, setOpen] = useState(false);
  const folderId = useUrlFolder();
  const { uploadFiles } = useFileUpload({ folderId });

  const handleUploadDocuments = async (files: File[]) => {
    setOpen(false);
    await uploadFiles(files);
  };

  return (
    <>
      <Button className="gap-2" onClick={() => setOpen(true)}>
        <Upload className="h-4 w-4" />
        Upload
      </Button>
      <UploadDocumentModal
        open={open}
        onOpenChange={setOpen}
        onConfirm={handleUploadDocuments}
      />
    </>
  );
}

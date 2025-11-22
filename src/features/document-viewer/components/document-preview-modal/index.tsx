"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/shared/components/ui/dialog";
import type { DocumentModel } from "~/server/db/schema";
import { detectFileType } from "./utils/file-type.utils";
import { ImagePreview } from "./components/image-preview";
import { PDFPreview } from "./components/pdf-preview";
import { VideoPreview } from "./components/video-preview";
import { AudioPreview } from "./components/audio-preview";
import { TextPreview } from "./components/text-preview";
import { UnsupportedPreview } from "./components/unsupported-preview";
import { useTextContent } from "./hooks/use-text-content";

interface DocumentPreviewModalProps {
  document: DocumentModel | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DocumentPreviewModal({
  document,
  isOpen,
  onOpenChange,
}: DocumentPreviewModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Detect file type - safe to do even if document is null
  const fileTypeInfo = document
    ? detectFileType(document.name, document.mimeType)
    : null;

  // Always call hooks unconditionally
  const {
    textContent,
    isLoading: isTextLoading,
    hasError: hasTextError,
  } = useTextContent(
    fileTypeInfo?.type === "text" && document ? document.blobUrl : null,
    isOpen,
  );

  // Reset loading state when document or modal state changes
  useEffect(() => {
    if (document && isOpen) {
      setIsLoading(true);
      setHasError(false);
    }
  }, [document, isOpen, setIsLoading, setHasError]);

  // Early return AFTER all hooks have been called
  if (!document) return null;

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const previewMap = new Map<string, () => React.ReactNode>([
    [
      "image",
      () => (
        <ImagePreview
          src={document.blobUrl}
          alt={document.name}
          isLoading={isLoading}
          hasError={hasError}
          onLoad={handleLoad}
          onError={handleError}
        />
      ),
    ],
    [
      "pdf",
      () => (
        <PDFPreview
          src={document.blobUrl}
          title={document.name}
          isLoading={isLoading}
          hasError={hasError}
          onLoad={handleLoad}
          onError={handleError}
        />
      ),
    ],
    [
      "video",
      () => (
        <VideoPreview
          src={document.blobUrl}
          isLoading={isLoading}
          hasError={hasError}
          onLoad={handleLoad}
          onError={handleError}
        />
      ),
    ],
    [
      "audio",
      () => (
        <AudioPreview
          src={document.blobUrl}
          fileName={document.name}
          isLoading={isLoading}
          hasError={hasError}
          onLoad={handleLoad}
          onError={handleError}
        />
      ),
    ],
    [
      "text",
      () => (
        <TextPreview
          content={textContent}
          isLoading={isTextLoading}
          hasError={hasTextError}
        />
      ),
    ],
  ]);

  const renderPreview = () => {
    if (!fileTypeInfo) return <UnsupportedPreview />;
    return previewMap.get(fileTypeInfo.type)?.() ?? <UnsupportedPreview />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="inset-0! top-0! left-0! right-0! bottom-0! h-screen! w-screen! max-w-none! translate-x-0! translate-y-0! flex flex-col rounded-none border-0 p-0"
        showCloseButton={true}
      >
        <DialogHeader className="border-b px-6 pt-6 pb-4">
          <DialogTitle className="truncate pr-8 text-left">
            {document.name}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-auto p-6 h-full w-full">{renderPreview()}</div>
      </DialogContent>
    </Dialog>
  );
}

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

  // Reset loading state when document or modal state changes
  useEffect(() => {
    if (document && isOpen) {
      setIsLoading(true);
      setHasError(false);
    }
  }, [document, isOpen, setIsLoading, setHasError]);

  if (!document) return null;

  const fileTypeInfo = detectFileType(document.name, document.mimeType);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const {
    textContent,
    isLoading: isTextLoading,
    hasError: hasTextError,
  } = useTextContent(
    fileTypeInfo.type === "text" ? document.blobUrl : null,
    isOpen,
  );

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
    return previewMap.get(fileTypeInfo.type)?.() ?? <UnsupportedPreview />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-h-[85vh] w-[90vw] max-w-4xl flex-col p-0"
        showCloseButton={true}
      >
        <DialogHeader className="border-b px-6 pt-6 pb-4">
          <DialogTitle className="truncate pr-8 text-left">
            {document.name}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-auto p-6">{renderPreview()}</div>
      </DialogContent>
    </Dialog>
  );
}

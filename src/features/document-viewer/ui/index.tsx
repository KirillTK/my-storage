"use client";
import { useState } from "react";
import { FileText } from "lucide-react";
import type { DocumentModel } from "~/server/db/schema";
import { DocumentActionsMenu } from "../components/document-actions-menu";
import { RenameDocumentPopover } from "../components/rename-document-popover";
import { DocumentPreviewModal } from "../components/document-preview-modal";
import {
  MetadataViewer,
  type MetadataItem,
} from "../components/metadata-viewer";
import { Popover, PopoverAnchor } from "~/shared/components/ui/popover";
import {
  getFileExtension,
  getFileNameWithoutExtension,
  getFileTypeLabel,
} from "~/shared/lib/file.utils";
import { IMAGE_FORMATS } from "~/entities/document/const/image-format.const";
import {
  ICON_FILE_TYPE_MAP,
  COLOR_FILE_TYPE_MAP,
} from "~/entities/document/const/icon-map-by-type.const";
import Image from "next/image";
import { formatDate, formatFileSize } from "~/shared/lib/formatters.utils";

interface DocumentViewerProps {
  document: DocumentModel;
}

export function DocumentViewer({ document }: DocumentViewerProps) {
  const [isRenamePopoverOpen, setIsRenamePopoverOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isMetadataOpen, setIsMetadataOpen] = useState(false);

  const handleDocumentClick = () => {
    setIsPreviewOpen(true);
  };

  const handleDocumentRename = () => {
    setIsRenamePopoverOpen(true);
  };

  const handleMetadataView = () => {
    setIsMetadataOpen(true);
  };

  const metadata: MetadataItem[] = [
    { label: "File Name", value: document.name },
    { label: "File Size", value: formatFileSize(document.fileSize) },
    {
      label: "Document Type",
      value: getFileTypeLabel(document.mimeType, document.name),
    },
    { label: "Created At", value: formatDate(document.createdAt) },
  ];

  const fileExtension = getFileExtension(document.name);
  const fileNameWithoutExtension = getFileNameWithoutExtension(document.name);

  const isImage = IMAGE_FORMATS.includes(fileExtension ?? "");

  // Get icon and color for file type
  const color = COLOR_FILE_TYPE_MAP.get(fileExtension ?? "") ?? {
    bg: "bg-primary/15",
    icon: "text-primary",
  };
  const IconComponent = ICON_FILE_TYPE_MAP.get(fileExtension ?? "") ?? FileText;

  const handleOpenChangePopover = (open: boolean) => {
    if (!open) {
      setIsRenamePopoverOpen(false);
      setIsMetadataOpen(false);
    }
  };

  return (
    <>
      <Popover
        open={isRenamePopoverOpen || isMetadataOpen}
        onOpenChange={handleOpenChangePopover}
        modal={true}
      >
        <div
          key={document.id}
          className="group border-border bg-card hover:border-primary relative cursor-pointer overflow-hidden rounded-lg border transition-all hover:shadow-md"
        >
          <PopoverAnchor asChild>
            <div className="pointer-events-none absolute inset-0" />
          </PopoverAnchor>

          {/* Header with filename and actions */}
          <div className="border-border/50 flex items-center justify-between gap-2 border-b p-3">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <IconComponent className={`h-4 w-4 shrink-0 ${color.icon}`} />
              <h3 className="text-foreground truncate text-sm font-medium">
                {document.name}
              </h3>
            </div>
            <DocumentActionsMenu
              document={document}
              onPreview={() => setIsPreviewOpen(true)}
              onRename={handleDocumentRename}
              onMetadata={handleMetadataView}
            />
          </div>

          {/* Large centered preview area */}
          <div
            onClick={handleDocumentClick}
            className="bg-muted/30 flex min-h-[200px] items-center justify-center p-8"
          >
            {isImage ? (
              <div className="ring-border relative h-32 w-32 overflow-hidden rounded-lg shadow-sm ring-1">
                <Image
                  src={document.blobUrl}
                  alt={document.name}
                  fill
                  className="object-cover"
                  quality={75}
                  loading="lazy"
                />
              </div>
            ) : (
              <div
                className={`flex h-24 w-24 items-center justify-center rounded-2xl ${color.bg}`}
              >
                <IconComponent className={`h-12 w-12 ${color.icon}`} />
              </div>
            )}
          </div>
        </div>

        <RenameDocumentPopover
          documentId={document.id}
          currentName={fileNameWithoutExtension}
          fileExtension={fileExtension ?? ""}
          isOpen={isRenamePopoverOpen}
          onOpenChange={setIsRenamePopoverOpen}
        />

        <MetadataViewer
          metadata={metadata}
          isOpen={isMetadataOpen}
          onOpenChange={setIsMetadataOpen}
        />
      </Popover>
      <DocumentPreviewModal
        document={document}
        isOpen={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
      />
    </>
  );
}

"use client";
import { useState } from "react";
import { FileText } from "lucide-react";
import type { DocumentModel } from "~/server/db/schema";
import { DocumentActionsMenu } from "../components/document-actions-menu";
import { RenameDocumentPopover } from "../components/rename-document-popover";
import { DocumentPreviewModal } from "../components/document-preview-modal";
import { Popover, PopoverAnchor } from "~/shared/components/ui/popover";
import { getFileExtension, getFileNameWithoutExtension } from "~/shared/lib/file.utils";
import { IMAGE_FORMATS } from "~/entities/document/const/image-format.const";
import { ICON_FILE_TYPE_MAP, COLOR_FILE_TYPE_MAP } from "~/entities/document/const/icon-map-by-type.const";
import Image from "next/image";

interface DocumentViewerProps {
  document: DocumentModel;
}

export function DocumentViewer({ document }: DocumentViewerProps) {
  const [isRenamePopoverOpen, setIsRenamePopoverOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleDocumentClick = () => {
    setIsPreviewOpen(true);
  };

  const handleDocumentRename = () => {
    setIsRenamePopoverOpen(true);
  };

  const fileExtension = getFileExtension(document.name);
  const fileNameWithoutExtension = getFileNameWithoutExtension(document.name);

  const isImage = IMAGE_FORMATS.includes(fileExtension ?? "");
  
  // Get icon and color for file type
  const color = COLOR_FILE_TYPE_MAP.get(fileExtension ?? "") ?? {
    bg: "bg-primary/15",
    icon: "text-primary",
  };
  const IconComponent = ICON_FILE_TYPE_MAP.get(fileExtension ?? "") ?? FileText;

  return (
    <>
      <Popover
        open={isRenamePopoverOpen}
        onOpenChange={setIsRenamePopoverOpen}
        modal={true}
      >
        <div
          key={document.id}
          className="group border-border bg-card hover:border-primary relative cursor-pointer rounded-lg border transition-all hover:shadow-md overflow-hidden"
        >
          <PopoverAnchor asChild>
            <div className="pointer-events-none absolute inset-0" />
          </PopoverAnchor>
          
          {/* Header with filename and actions */}
          <div className="flex items-center justify-between gap-2 p-3 border-b border-border/50">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <IconComponent className={`h-4 w-4 shrink-0 ${color.icon}`} />
              <h3 className="text-foreground font-medium text-sm truncate">
                {document.name}
              </h3>
            </div>
            <DocumentActionsMenu
              document={document}
              onPreview={() => setIsPreviewOpen(true)}
              onRename={handleDocumentRename}
            />
          </div>

          {/* Large centered preview area */}
          <div 
            onClick={handleDocumentClick}
            className="flex items-center justify-center p-8 min-h-[200px] bg-muted/30"
          >
            {isImage ? (
              <div className="relative w-32 h-32 rounded-lg overflow-hidden shadow-sm ring-1 ring-border">
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
              <div className={`flex items-center justify-center w-24 h-24 rounded-2xl ${color.bg}`}>
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
      </Popover>
      <DocumentPreviewModal
        document={document}
        isOpen={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
      />
    </>
  );
}

"use client";
import { useState } from "react";
import { File } from "lucide-react";
import type { DocumentModel } from "~/server/db/schema";
import { DocumentActionsMenu } from "../components/document-actions-menu";
import { RenameDocumentPopover } from "../components/rename-document-popover";
import { DocumentPreviewModal } from "../components/document-preview-modal";
import { Popover, PopoverAnchor } from "~/shared/components/ui/popover";
import { formatDate, formatFileSize } from "~/shared/lib/formatters.utils";
import {
  getFileExtension,
  getFileNameWithoutExtension,
} from "~/shared/lib/file.utils";
import Image from "next/image";
import {
  COLOR_FILE_TYPE_MAP,
  ICON_FILE_TYPE_MAP,
} from "~/entities/document/const/icon-map-by-type.const";
import { cn } from "~/shared/lib/utils";
import { FileBadge } from "~/entities/document/components/file-badge/ui";
import { IMAGE_FORMATS } from "~/entities/document/const/image-format.const";
import { ImageBadge } from "~/entities/document/components/image-badge/ui";
import { useDocument } from "../../../entities/document/hooks/use-document";

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

  return (
    <>
      <Popover
        open={isRenamePopoverOpen}
        onOpenChange={setIsRenamePopoverOpen}
        modal={true}
      >
        <div
          key={document.id}
          className="group border-border bg-card hover:border-primary relative cursor-pointer rounded-lg border transition-all hover:shadow-md"
        >
          <PopoverAnchor asChild>
            <div className="pointer-events-none absolute inset-0" />
          </PopoverAnchor>
          <div onClick={handleDocumentClick} className="p-4">
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-2">
                {isImage ? <ImageBadge document={document} /> : null}
                <FileBadge fileType={fileExtension ?? ""} />
              </div>

              <DocumentActionsMenu
                document={document}
                onPreview={() => setIsPreviewOpen(true)}
                onRename={handleDocumentRename}
              />
            </div>
            <h3 className="text-foreground mb-1 font-medium text-balance wrap-break-word">
              {document.name}
            </h3>
            <div className="text-muted-foreground flex items-center justify-between text-xs">
              <span>{formatFileSize(document.fileSize)}</span>
              <span>{formatDate(document.createdAt)}</span>
            </div>
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

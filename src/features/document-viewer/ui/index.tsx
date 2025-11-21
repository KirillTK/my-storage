"use client";
import { useState } from "react";
import { File } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { DocumentModel } from "~/server/db/schema";
import { DocumentActionsMenu } from "../components/document-actions-menu";
import { RenameDocumentPopover } from "../components/rename-document-popover";
import { DocumentPreviewModal } from "../components/document-preview-modal";
import { Popover, PopoverAnchor } from "~/shared/components/ui/popover";
import {
  deleteDocument,
  restoreDocument,
} from "~/server/actions/document.actions";
import { formatDate, formatFileSize } from "~/shared/lib/formatters.utils";
import {
  getFileExtension,
  getFileNameWithoutExtension,
} from "~/shared/lib/file.utils";
import Image from "next/image";
import {
  COLOR_FILE_TYPE_MAP,
  ICON_FILE_TYPE_MAP,
} from "../const/icon-map-by-type.const";
import { cn } from "~/shared/lib/utils";

interface DocumentViewerProps {
  document: DocumentModel;
}

export function DocumentViewer({ document }: DocumentViewerProps) {
  const router = useRouter();
  const [isRenamePopoverOpen, setIsRenamePopoverOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleDocumentClick = () => {
    setIsPreviewOpen(true);
  };

  const handleDocumentRename = () => {
    setIsRenamePopoverOpen(true);
  };

  const handleDocumentDelete = async () => {
    try {
      await deleteDocument(document.id);

      // Show toast with undo action
      toast(`Document "${document.name}" has been deleted`, {
        description: "You can undo this action",
        action: {
          label: "Undo",
          //eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick: async () => {
            try {
              await restoreDocument(document.id);
              router.refresh();
              toast.success("Document restored");
            } catch (error) {
              console.error("Failed to restore document:", error);
              toast.error("Failed to restore document");
            }
          },
        },
      });

      router.refresh();
    } catch (error) {
      console.error("Failed to delete document:", error);
      toast.error("Failed to delete document");
    }
  };

  const fileExtension = getFileExtension(document.name);
  const fileNameWithoutExtension = getFileNameWithoutExtension(document.name);

  // Map file extensions to icons/components
  const getFileIcon = () => {
    const ext = fileExtension?.toLowerCase() ?? "";

    // Image extensions
    const imageExtensions = [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "webp",
      "svg",
      "bmp",
      "ico",
      "tiff",
      "tif",
    ];
    if (imageExtensions.includes(ext)) {
      return (
        <div className="bg-primary/15 border-border relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border">
          <Image
            src={document.blobUrl}
            alt={document.name}
            width={48}
            height={48}
            quality={60}
            loading="lazy"
          />
        </div>
      );
    }

    const IconComponent = ICON_FILE_TYPE_MAP.get(ext) ?? File;
    const colors = COLOR_FILE_TYPE_MAP.get(ext) ?? {
      bg: "bg-primary/15",
      icon: "text-primary",
    };

    return (
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-lg",
          colors.bg,
        )}
      >
        <IconComponent className={`h-6 w-6 ${colors.icon}`} />
      </div>
    );
  };

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
              {getFileIcon()}
              <DocumentActionsMenu
                document={document}
                onPreview={() => setIsPreviewOpen(true)}
                onRename={handleDocumentRename}
                onDelete={handleDocumentDelete}
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

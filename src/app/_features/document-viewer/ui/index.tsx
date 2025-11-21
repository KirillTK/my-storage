'use client';
import { useState } from 'react';
import {
  File,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { DocumentModel } from '~/server/db/schema';
import { DocumentActionsMenu } from '../components/document-actions-menu';
import { RenameDocumentPopover } from '../components/rename-document-popover';
import { Popover, PopoverAnchor } from '@/_shared/components/ui/popover';
import { deleteDocument, downloadDocument, restoreDocument } from '~/server/actions/document.actions';
import { formatDate, formatFileSize } from '@/_shared/lib/formatters.utils';
import { getFileExtension, getFileNameWithoutExtension } from '~/app/_shared/lib/file.utils';
import Image from 'next/image';
import { COLOR_FILE_TYPE_MAP, ICON_FILE_TYPE_MAP } from '../const/icon-map-by-type.const';

interface DocumentViewerProps {
  document: DocumentModel;
}

export function DocumentViewer({ document }: DocumentViewerProps) {
  const router = useRouter();
  const [isRenamePopoverOpen, setIsRenamePopoverOpen] = useState(false);

  const handleDocumentClick = (document: DocumentModel) => {
    console.log(document);
  };

  const handleDocumentRename = () => {
    setIsRenamePopoverOpen(true);
  };

  const handleDocumentDelete = async () => {
    try {
      await deleteDocument(document.id);

      // Show toast with undo action
      toast(`Document "${document.name}" has been deleted`, {
        description: 'You can undo this action',
        action: {
          label: 'Undo',
          //eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick: async () => {
            try {
              await restoreDocument(document.id);
              router.refresh();
              toast.success('Document restored');
            } catch (error) {
              console.error('Failed to restore document:', error);
              toast.error('Failed to restore document');
            }
          },
        },
      });

      router.refresh();
    } catch (error) {
      console.error('Failed to delete document:', error);
      toast.error('Failed to delete document');
    }
  };


  const fileExtension = getFileExtension(document.name);
  const fileNameWithoutExtension = getFileNameWithoutExtension(document.name);

  // Map file extensions to icons/components
  const getFileIcon = () => {
    const ext = fileExtension?.toLowerCase() ?? '';

    // Image extensions
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'tiff', 'tif'];
    if (imageExtensions.includes(ext)) {
      return (
        <div className="relative flex h-12 w-12 items-center justify-center rounded-lg overflow-hidden bg-primary/15 border border-border">
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



    const IconComponent = ICON_FILE_TYPE_MAP.get(ext) || File;
    const colors = COLOR_FILE_TYPE_MAP.get(ext) || { bg: 'bg-primary/15', icon: 'text-primary' };

    return (
      <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${colors.bg}`}>
        <IconComponent className={`h-6 w-6 ${colors.icon}`} />
      </div>
    );
  };

  return (
    <>
      <Popover open={isRenamePopoverOpen} onOpenChange={setIsRenamePopoverOpen} modal={true}>
        <div
          key={document.id}
          className="group relative rounded-lg border border-border bg-card hover:border-primary hover:shadow-md transition-all cursor-pointer"
        >
          <PopoverAnchor asChild>
            <div className="absolute inset-0 pointer-events-none" />
          </PopoverAnchor>
          <div onClick={() => handleDocumentClick(document)} className="p-4">
            <div className="flex items-start justify-between mb-3">
              {getFileIcon()}
              <DocumentActionsMenu
                document={document}
                onRename={handleDocumentRename}
                onDelete={handleDocumentDelete}
              />
            </div>
            <h3 className="font-medium text-foreground text-balance mb-1 break-words">{document.name}</h3>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{formatFileSize(document.fileSize)}</span>
              <span>{formatDate(document.createdAt)}</span>
            </div>
          </div>
        </div>

        <RenameDocumentPopover
          documentId={document.id}
          currentName={fileNameWithoutExtension}
          fileExtension={fileExtension ?? ''}
          isOpen={isRenamePopoverOpen}
          onOpenChange={setIsRenamePopoverOpen}
        />
      </Popover>
    </>
  );
}
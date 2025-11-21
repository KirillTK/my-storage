'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '~/shared/components/ui/dropdown-menu';
import { Button } from '~/shared/components/ui/button';
import { Download, Edit2, Eye, MoreVertical, Trash2 } from 'lucide-react';
import { downloadFileWithProgress, formatBytes } from '~/shared/lib/file.utils';
import type { DocumentModel } from '~/server/db/schema';

interface DocumentActionsMenuProps {
  document: DocumentModel;
  onPreview: () => void;
  onRename: () => void;
  onDelete: () => void;
}

export function DocumentActionsMenu({
  document,
  onPreview,
  onRename,
  onDelete,
}: DocumentActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    onPreview();
  };

  const handleRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    // Use setTimeout to ensure dropdown closes before popover opens
    setTimeout(() => {
      onRename();
    }, 150);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    onDelete();
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);

    const toastId = toast.loading('Preparing download...', {
      description: document.name,
    });

    try {
      const apiUrl = `/api/download?id=${document.id}`;

      await downloadFileWithProgress(
        apiUrl,
        document.name,
        (progress) => {
          // Update toast with progress
          toast.loading(
            <div className="w-full">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Downloading...</span>
                <span className="text-xs text-muted-foreground">
                  {Math.round(progress.percentage)}%
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {document.name}
              </p>
            </div>,
            {
              id: toastId,
              description: `${formatBytes(progress.loaded)} / ${formatBytes(progress.total)}`,
            }
          );
        }
      );

      // Success toast
      toast.success('Download complete', {
        id: toastId,
        description: document.name,
        duration: 2000,
      });
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Download failed', {
        id: toastId,
        description: error instanceof Error ? error.message : 'Please try again',
      });
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handlePreview}>
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleRename}>
          <Edit2 className="mr-2 h-4 w-4" />
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

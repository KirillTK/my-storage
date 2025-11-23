"use client";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "~/shared/components/ui/dropdown-menu";
import { Button } from "~/shared/components/ui/button";
import { Download, Edit2, Eye, Info, MoreVertical, Trash2 } from "lucide-react";
import type { DocumentModel } from "~/server/db/schema";
import { useDocument } from "../../../../entities/document/hooks/use-document";

interface DocumentActionsMenuProps {
  document: DocumentModel;
  onPreview: () => void;
  onRename: () => void;
  onMetadata: () => void;
}

export function DocumentActionsMenu({
  document,
  onPreview,
  onRename,
  onMetadata,
}: DocumentActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    handleDownload: downloadDocument,
    handleDelete: deleteDocumentHandler,
  } = useDocument(document);

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

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    await deleteDocumentHandler();
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    await downloadDocument();
  };

  const handleMetadata = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    setTimeout(() => {
      onMetadata();
    }, 150);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="icon" className="h-8 w-8">
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
        <DropdownMenuItem onClick={handleMetadata}>
          <Info className="mr-2 h-4 w-4" />
          View Metadata
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

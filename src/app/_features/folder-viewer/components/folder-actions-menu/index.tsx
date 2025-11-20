'use client';
import { useState } from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/_shared/components/ui/dropdown-menu';
import { Button } from '@/_shared/components/ui/button';
import { Edit2, MoreVertical, Trash2 } from 'lucide-react';

interface FolderActionsMenuProps {
  onRename: () => void;
  onDelete: () => void;
}

export function FolderActionsMenu({
  onRename,
  onDelete,
}: FolderActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

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


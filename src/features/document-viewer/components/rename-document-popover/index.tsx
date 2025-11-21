'use client';
import { useState, useEffect, useRef } from 'react';
import { PopoverContent } from '~/shared/components/ui/popover';
import { Input } from '~/shared/components/ui/input';
import { Button } from '~/shared/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { renameDocument } from '~/server/actions/document.actions';

interface RenameDocumentPopoverProps {
  documentId: string;
  currentName: string;
  fileExtension: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RenameDocumentPopover({
  documentId,
  currentName,
  fileExtension,
  isOpen,
  onOpenChange,
}: RenameDocumentPopoverProps) {
  const router = useRouter();
  const [newDocumentName, setNewDocumentName] = useState(currentName);
  const [isRenaming, setIsRenaming] = useState(false);
  const justOpenedRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      setNewDocumentName(currentName);
      justOpenedRef.current = true;
      // Reset the flag after a short delay to prevent immediate closing
      const timer = setTimeout(() => {
        justOpenedRef.current = false;
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, currentName]);



  const handleSave = async () => {
    if (!newDocumentName.trim() || newDocumentName === currentName) {
      onOpenChange(false);
      return;
    }

    setIsRenaming(true);
    try {
      if (!fileExtension) return;

      await renameDocument(documentId, `${newDocumentName.trim()}.${fileExtension}`);
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error('Failed to rename document:', error);
    } finally {
      setIsRenaming(false);
    }
  };

  const handleCancel = () => {
    setNewDocumentName(currentName);
    onOpenChange(false);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    try {
      if (e.key === 'Enter' && !isRenaming) {
        await handleSave();
      }
      if (e.key === 'Escape') {
        handleCancel();
      }
    } catch (error) {
      console.error('Failed to rename document:', error);
    } finally {
      setIsRenaming(false);
    }
  };

  if (!isOpen) return null;

  return (
    <PopoverContent
      className="w-80"
      onClick={(e) => e.stopPropagation()}
      align="start"
      side="bottom"
      sideOffset={8}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Rename Document</h4>
          <Input
            value={newDocumentName}
            onChange={(e) => setNewDocumentName(e.target.value)}
            placeholder="Document name"
            onKeyDown={handleKeyDown}
            disabled={isRenaming}
            autoFocus
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={isRenaming}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isRenaming || !newDocumentName.trim() || newDocumentName === currentName}
          >
            {isRenaming ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save'
            )}
          </Button>
        </div>
      </div>
    </PopoverContent>
  );
}

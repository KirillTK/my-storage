"use client";
import { useState, useEffect, useRef } from "react";
import { PopoverContent } from "~/shared/components/ui/popover";
import { Input } from "~/shared/components/ui/input";
import { Button } from "~/shared/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { renameFolder } from "~/server/actions/folder.actions";

interface RenameFolderPopoverProps {
  folderId: string;
  currentName: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RenameFolderPopover({
  folderId,
  currentName,
  isOpen,
  onOpenChange,
}: RenameFolderPopoverProps) {
  const router = useRouter();
  const [newFolderName, setNewFolderName] = useState(currentName);
  const [isRenaming, setIsRenaming] = useState(false);
  const justOpenedRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setNewFolderName(currentName);
      justOpenedRef.current = true;
      // Reset the flag after a short delay to prevent immediate closing
      const timer = setTimeout(() => {
        justOpenedRef.current = false;
      }, 200);

      // Focus the input after a brief delay to ensure popover is fully rendered
      const focusTimer = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);

      return () => {
        clearTimeout(timer);
        clearTimeout(focusTimer);
      };
    }
  }, [isOpen, currentName]);

  const handleSave = async () => {
    if (!newFolderName.trim() || newFolderName === currentName) {
      onOpenChange(false);
      return;
    }

    setIsRenaming(true);
    try {
      await renameFolder(folderId, newFolderName.trim());
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to rename folder:", error);
    } finally {
      setIsRenaming(false);
    }
  };

  const handleCancel = () => {
    setNewFolderName(currentName);
    onOpenChange(false);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    try {
      if (e.key === "Enter" && !isRenaming) {
        await handleSave();
      }
      if (e.key === "Escape") {
        handleCancel();
      }
    } catch (error) {
      console.error("Failed to rename folder:", error);
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
          <h4 className="text-sm font-medium">Rename Folder</h4>
          <Input
            ref={inputRef}
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Folder name"
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
            disabled={
              isRenaming ||
              !newFolderName.trim() ||
              newFolderName === currentName
            }
          >
            {isRenaming ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </div>
    </PopoverContent>
  );
}

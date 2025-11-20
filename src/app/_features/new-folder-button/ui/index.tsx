'use client';
import { Plus } from 'lucide-react';
import { Button } from '~/app/_shared/components/ui/button';
import { CreateFolderDialog } from '../components/new-folder-modal';
import { useState } from 'react';
import { createFolder } from '~/server/actions/folder.actions';

export function NewFolderButton() {
  const [open, setOpen] = useState(false);

  const handleNewFolder = async (name: string) => {
    try {
      await createFolder(name, null);
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  }

  const handleOpenChange = () => {
    setOpen(true);
  }

  return (
    <>
      <Button variant="outline" className="gap-2 bg-transparent" onClick={handleOpenChange}>
        <Plus className="h-4 w-4" />
        New Folder
      </Button>
      <CreateFolderDialog open={open} onOpenChange={setOpen} onConfirm={handleNewFolder} />
    </>
  )
}
import { DragDropZone } from '@/_shared/components/ui/drag-drop-zone';
import { StorageGrid } from '@/_widgets/storage-grid/ui';
import { FolderBreadcrumbs } from '@/_features/folder-breadcrumbs/ui';
import { extractLastUuid } from '~/app/_shared/lib/uuid.utils';
import { getStorageData } from '~/server/actions/dashboard.actions';
import { getFolderPath } from '~/server/actions/folder.actions';

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const folderId = extractLastUuid(slug ?? []);

  const { folders, documents } = await getStorageData(folderId);
  const folderPath = await getFolderPath(folderId);

  console.log(folders, documents);

  const handleFileDrop = async (file: File) => {
    'use server';
    console.log(file);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <DragDropZone onFileDrop={handleFileDrop}>
        <div className="flex-1 overflow-auto">
          <FolderBreadcrumbs folderPath={folderPath} />
          <div className="mt-4">
            <StorageGrid folders={folders} documents={documents} />
          </div>
        </div>
      </DragDropZone>
    </div>
  )
}


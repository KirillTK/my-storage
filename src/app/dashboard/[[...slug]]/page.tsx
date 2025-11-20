import { DragDropZone } from '@/_shared/components/ui/drag-drop-zone';
import { StorageGrid } from '@/_widgets/storage-grid/ui';
import { extractLastUuid } from '~/app/_shared/lib/uuid.utils';
import { getDashboardData, getFolderData } from '~/server/actions/dashboard.actions';

export default async function DashboardPage({
  params,
}: {
  params: { slug?: string[] };
}) {
  const folderId = extractLastUuid(params.slug || []);

  const { folders, documents } = folderId
    ? await getFolderData(folderId)
    : await getDashboardData();

  const handleFileDrop = async (file: File) => {
    'use server';
    console.log(file);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <DragDropZone onFileDrop={handleFileDrop}>
        <div className="flex-1 overflow-auto">
          <StorageGrid folders={folders} documents={documents} />
        </div>
      </DragDropZone>
    </div>
  )
}


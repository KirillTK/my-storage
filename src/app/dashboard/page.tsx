import { DragDropZone } from '@/_shared/components/ui/drag-drop-zone';
import { StorageGrid } from '@/_widgets/storage-grid/ui';
import { getDashboardData } from '~/server/actions/dashboard.actions';

export default async function DashboardPage() {
  const { items } = await getDashboardData();

  console.log(items);

  const handleFileDrop = async (file: File) => {
    'use server';
    console.log(file);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <DragDropZone onFileDrop={handleFileDrop}>
        <div className="flex-1 overflow-auto">
          <StorageGrid />
        </div>
      </DragDropZone>
    </div>
  )
}
import { StorageGrid } from "~/widgets/storage-grid/ui";
import { FolderBreadcrumbs } from "~/features/folder-breadcrumbs/ui";
import { extractLastUuid } from "~/shared/lib/uuid.utils";
import { getStorageData } from "~/server/actions/dashboard.actions";
import { getFolderPath } from "~/server/actions/folder.actions";
import { DragDropZone } from "~/shared/components/ui/drag-drop-zone";
import { DashboardFilters } from "~/features/dashboard-filters/ui";
import { auth } from '~/server/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ docType?: string; lastModified?: string }>;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const { slug } = await params;
  const { docType, lastModified } = await searchParams;

  const folderId = extractLastUuid(slug ?? []);

  // Convert comma-separated strings to arrays
  const docTypeArray = docType?.split(",").filter(Boolean);
  const lastModifiedArray = lastModified?.split(",").filter(Boolean);

  const { folders, documents } = await getStorageData(folderId, {
    docType: docTypeArray,
    lastModified: lastModifiedArray,
  });
  const folderPath = await getFolderPath(folderId);

  return (
    <div className="flex min-h-screen flex-col gap-4">
      <FolderBreadcrumbs folderPath={folderPath} />
      <DashboardFilters />
      <DragDropZone folderId={folderId}>
        <div className="flex-1 overflow-auto">
          <StorageGrid folders={folders} documents={documents} />
        </div>
      </DragDropZone>
    </div>
  );
}

import { auth } from "../auth";
import type { FolderWithChildrenAndDocumentsModel } from "../db/schema";
import type { Filter } from "../types/filter.type";
import { getDocumentsByFolderId } from "./document.actions";
import { getFoldersByParentFolderId } from "./folder.actions";

export const getStorageData = async (
  folderId?: string | null,
  filter?: Partial<Filter>,
) => {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  let folders: FolderWithChildrenAndDocumentsModel[] = [];

  if (!filter?.docType) {
    folders = await getFoldersByParentFolderId(folderId ?? null, filter);
  }

  const documents = await getDocumentsByFolderId(folderId ?? null, filter);

  return {
    folders,
    documents,
  };
};

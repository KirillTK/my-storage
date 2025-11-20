import { auth } from "../auth";
import { getDocumentsByFolderId } from "./document.actions";
import { getFoldersByParentFolderId } from "./folder.actions";

export const getStorageData = async (folderId?: string | null) => {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const folders = await getFoldersByParentFolderId(folderId ?? null);
  const documents = await getDocumentsByFolderId(folderId ?? null);

  return {
    folders,
    documents,
  };
};

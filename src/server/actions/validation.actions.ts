'use server';
import { auth } from "../auth";
import { getDocumentNamesByFolderId } from "./document.actions";

export const validateUniqueFileNames = async (
  fileNames: string[],
  folderId: string | null,
) => {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const existingDocuments = await getDocumentNamesByFolderId(folderId);

  const isUnique = fileNames.every(
    (fileName) =>
      !existingDocuments.some(
        (document) => document.name.toLowerCase() === fileName.toLowerCase(),
      ),
  );

  return isUnique;
};

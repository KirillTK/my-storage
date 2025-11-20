import { eq, asc, and, isNull } from "drizzle-orm";
import { auth } from "../auth";
import { db } from "../db";
import { folders, documents } from "../db/schema";

export const getDashboardData = async () => {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Fetch all folders owned by the user, sorted by creation date
  const userFolders = await db
    .select()
    .from(folders)
    .where(
      and(eq(folders.ownerId, session.user.id), isNull(folders.parentFolderId)),
    )
    .orderBy(asc(folders.createdAt));

  // Fetch all documents uploaded by the user, sorted by creation date
  const userDocuments = await db
    .select()
    .from(documents)
    .where(
      and(
        eq(documents.uploadedById, session.user.id),
        isNull(documents.folderId),
      ),
    )
    .orderBy(asc(documents.createdAt));

  return {
    folders: userFolders,
    documents: userDocuments,
  };
};

export const getFolderData = async (folderId: string) => {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Verify the folder exists and user has access to it
  const folder = await db
    .select()
    .from(folders)
    .where(and(eq(folders.id, folderId), eq(folders.ownerId, session.user.id)))
    .limit(1);

  if (folder.length === 0) {
    throw new Error("Folder not found or access denied");
  }

  // Fetch all child folders within this folder, sorted by creation date
  const childFolders = await db
    .select()
    .from(folders)
    .where(
      and(
        eq(folders.parentFolderId, folderId),
        eq(folders.ownerId, session.user.id),
      ),
    )
    .orderBy(asc(folders.createdAt));

  // Fetch all documents within this folder, sorted by creation date
  const folderDocuments = await db
    .select()
    .from(documents)
    .where(
      and(
        eq(documents.folderId, folderId),
        eq(documents.uploadedById, session.user.id),
      ),
    )
    .orderBy(asc(documents.createdAt));

  return {
    folders: childFolders,
    documents: folderDocuments,
  };
};

import { eq, asc } from 'drizzle-orm';
import { auth } from "../auth";
import { db } from '../db';
import { folders, documents } from '../db/schema';

export const getDashboardData = async () => {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Fetch all folders owned by the user, sorted by creation date
  const userFolders = await db
    .select()
    .from(folders)
    .where(eq(folders.ownerId, session.user.id))
    .orderBy(asc(folders.createdAt));

  // Fetch all documents uploaded by the user, sorted by creation date
  const userDocuments = await db
    .select()
    .from(documents)
    .where(eq(documents.uploadedById, session.user.id))
    .orderBy(asc(documents.createdAt));

  // Combine: folders first, then documents
  return {
    folders: userFolders,
    documents: userDocuments,
    items: [
      ...userFolders.map(folder => ({ type: 'folder' as const, ...folder })),
      ...userDocuments.map(document => ({ type: 'document' as const, ...document })),
    ],
  };
};

"use server";
import { eq, isNull, and } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { auth } from "../auth";
import { db } from "../db";
import { folders } from "../db/schema";

export const createFolder = async (
  name: string,
  parentFolderId: string | null,
) => {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const newFolder = await db.insert(folders).values({
    name,
    parentFolderId,
    ownerId: session.user.id,
  });

  return newFolder;
};

export const renameFolder = async (folderId: string, name: string) => {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await db.update(folders).set({ name }).where(eq(folders.id, folderId));
};

export const deleteFolder = async (folderId: string) => {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Soft delete: set deletedAt timestamp
  await db
    .update(folders)
    .set({ deletedAt: sql`NOW()` })
    .where(eq(folders.id, folderId));
};

export const restoreFolder = async (folderId: string) => {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Restore: set deletedAt to null
  await db
    .update(folders)
    .set({ deletedAt: null })
    .where(eq(folders.id, folderId));
};

export const getFoldersByParentFolderId = async (
  parentFolderId: string | null,
) => {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return db.query.folders.findMany({
    where: and(
      eq(folders.ownerId, session.user.id),
      parentFolderId
        ? eq(folders.parentFolderId, parentFolderId)
        : isNull(folders.parentFolderId),
      isNull(folders.deletedAt), // Only return non-deleted folders
    ),
    with: {
      children: true,
      documents: true,
      parent: true,
    },
    orderBy: (folders, { asc }) => [asc(folders.createdAt)],
  });
};

export const getFolderPath = async (folderId: string | null) => {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  if (!folderId) {
    return [];
  }

  const path: Array<{ id: string; name: string }> = [];
  let currentFolderId: string | null = folderId;

  while (currentFolderId) {
    const folder: { id: string; name: string; parentFolderId: string | null } | undefined = await db.query.folders.findFirst({
      where: and(
        eq(folders.id, currentFolderId),
        eq(folders.ownerId, session.user.id),
        isNull(folders.deletedAt),
      ),
      columns: {
        id: true,
        name: true,
        parentFolderId: true,
      },
    });

    if (!folder) {
      break;
    }

    path.unshift({ id: folder.id, name: folder.name });
    currentFolderId = folder.parentFolderId;
  }

  return path;
};

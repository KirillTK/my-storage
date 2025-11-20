"use server";
import { eq, isNull, and } from "drizzle-orm";
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

  await db.delete(folders).where(eq(folders.id, folderId));
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
    ),
    with: {
      children: true,
      documents: true,
      parent: true,
    },
    orderBy: (folders, { asc }) => [asc(folders.createdAt)],
  });
};

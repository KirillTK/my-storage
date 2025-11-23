"use server";
import { eq, isNull, and, gte } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { auth } from "../auth";
import { db } from "../db";
import { folders } from "../db/schema";
import type { Filter } from "../types/filter.type";

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

function getDateForPeriod(period: string): Date {
  const now = new Date();
  switch (period) {
    case "today": {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return today;
    }
    case "last7days": {
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(now.getDate() - 7);
      return sevenDaysAgo;
    }
    case "last30days": {
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(now.getDate() - 30);
      return thirtyDaysAgo;
    }
    case "thisyear": {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      return startOfYear;
    }
    default:
      return now;
  }
}

export const getFoldersByParentFolderId = async (
  parentFolderId: string | null,
  filter?: Partial<Filter>,
) => {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const conditions = [
    eq(folders.ownerId, session.user.id),
    parentFolderId
      ? eq(folders.parentFolderId, parentFolderId)
      : isNull(folders.parentFolderId),
    isNull(folders.deletedAt), // Only return non-deleted folders
  ];

  // Handle multiple time periods with OR logic (take the earliest date)
  if (filter?.lastModified) {
    const periods = Array.isArray(filter.lastModified)
      ? filter.lastModified
      : [filter.lastModified];
    if (periods.length > 0) {
      // Get all dates and find the earliest one for OR logic
      const dates = periods.map((period) => getDateForPeriod(period));
      const earliestDate = new Date(Math.min(...dates.map((d) => d.getTime())));
      conditions.push(gte(folders.createdAt, earliestDate));
    }
  }

  return db.query.folders.findMany({
    where: and(...conditions),
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
    const folder:
      | { id: string; name: string; parentFolderId: string | null }
      | undefined = await db.query.folders.findFirst({
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

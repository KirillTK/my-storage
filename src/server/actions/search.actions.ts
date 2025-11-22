"use server";

import { and, eq, isNull, ilike, or } from "drizzle-orm";
import { auth } from "../auth";
import { db } from "../db";
import { documents } from "../db/schema/documents";
import { folders } from "../db/schema/folders";
import type { DocumentModel } from "../db/schema/documents";
import type { FolderModel } from "../db/schema/folders";

export interface SearchResults {
  folders: FolderModel[];
  files: Array<DocumentModel & { type: string; size: number }>;
}

export const searchStorage = async (query: string): Promise<SearchResults> => {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  if (!query || query.trim().length === 0) {
    return {
      folders: [],
      files: [],
    };
  }

  const searchQuery = `%${query.trim()}%`;

  // Search folders
  const folderResults = await db.query.folders.findMany({
    where: and(
      eq(folders.ownerId, session.user.id),
      isNull(folders.deletedAt),
      ilike(folders.name, searchQuery),
    ),
    limit: 10,
  });

  // Search documents
  const documentResults = await db
    .select()
    .from(documents)
    .where(
      and(
        eq(documents.uploadedById, session.user.id),
        isNull(documents.deletedAt),
        ilike(documents.name, searchQuery),
      ),
    )
    .limit(10);

  // Map documents to include type and size
  const files = documentResults.map((doc) => ({
    ...doc,
    type: getFileType(doc.mimeType),
    size: doc.fileSize,
  }));

  return {
    folders: folderResults,
    files,
  };
};

function getFileType(mimeType: string): string {
  if (mimeType.includes("pdf")) return "pdf";
  if (mimeType.includes("excel") || mimeType.includes("spreadsheet"))
    return "excel";
  if (mimeType.includes("word") || mimeType.includes("document")) return "word";
  if (mimeType.includes("image")) return "image";
  if (mimeType.includes("video")) return "video";
  if (mimeType.includes("audio")) return "audio";
  return "file";
}

"use server";
import { put, type PutBlobResult } from "@vercel/blob";
import { eq, isNull, and, asc, sql, ilike, gte, or } from "drizzle-orm";
import { auth } from "../auth";
import { db } from "../db";
import { documents } from "../db/schema";
import type { Filter } from "../types/filter.type";

export type UploadProgress = {
  percentage: number;
  loaded: number;
  total: number;
};

export async function uploadDocumentToBlob(
  file: File,
  userId: string,
  onProgress?: (progress: UploadProgress) => void,
): Promise<PutBlobResult> {
  const timestamp = Date.now();
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const blobPathname = `documents/${userId}/${timestamp}-${sanitizedFileName}`;

  const blob = await put(blobPathname, file, {
    access: "public",
    addRandomSuffix: false,
    onUploadProgress: (progress) => {
      if (onProgress) {
        onProgress({
          percentage: progress.percentage,
          loaded: progress.loaded,
          total: progress.total,
        });
      }
    },
  });

  return blob;
}

export async function createDocumentFromBlob(
  blob: PutBlobResult,
  fileName: string,
  fileSize: number,
  mimeType: string,
  folderId: string | null,
) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Save metadata to database
  const [newDocument] = await db
    .insert(documents)
    .values({
      name: fileName,
      folderId: folderId ?? null,
      uploadedById: userId,
      blobUrl: blob.url,
      blobPathname: blob.pathname,
      fileSize: fileSize,
      mimeType: mimeType,
      version: 1,
      previousVersionId: null,
    })
    .returning();

  return newDocument;
}

export const restoreDocument = async (documentId: string) => {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return await db
    .update(documents)
    .set({ deletedAt: null })
    .where(eq(documents.id, documentId));
};

export const deleteDocument = async (documentId: string) => {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Get document to verify ownership and get blob URL
  const [document] = await db
    .select()
    .from(documents)
    .where(eq(documents.id, documentId));

  if (!document) {
    throw new Error("Document not found");
  }

  if (document.uploadedById !== session.user.id) {
    throw new Error("Unauthorized to delete this document");
  }

  // Delete from blob storage
  return await db
    .update(documents)
    .set({ deletedAt: sql`NOW()` })
    .where(eq(documents.id, documentId));
};

export const renameDocument = async (documentId: string, name: string) => {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await db.update(documents).set({ name }).where(eq(documents.id, documentId));
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

export const getDocumentsByFolderId = async (
  folderId: string | null,
  filter?: Partial<Filter>,
) => {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const conditions = [
    eq(documents.uploadedById, session.user.id),
    folderId ? eq(documents.folderId, folderId) : isNull(documents.folderId),
    isNull(documents.deletedAt), // Only return non-deleted documents
  ];

  // Handle multiple document types with OR logic
  if (filter?.docType) {
    const docTypes = Array.isArray(filter.docType)
      ? filter.docType
      : [filter.docType];
    if (docTypes.length > 0) {
      const docTypeConditions = docTypes.map((type) =>
        ilike(documents.mimeType, `%${type}%`),
      );
      conditions.push(or(...docTypeConditions)!);
    }
  }

  // Handle multiple time periods with OR logic (take the earliest date)
  if (filter?.lastModified) {
    const periods = Array.isArray(filter.lastModified)
      ? filter.lastModified
      : [filter.lastModified];
    if (periods.length > 0) {
      // Get all dates and find the earliest one for OR logic
      const dates = periods.map((period) => getDateForPeriod(period));
      const earliestDate = new Date(Math.min(...dates.map((d) => d.getTime())));
      conditions.push(gte(documents.createdAt, earliestDate));
    }
  }

  return await db
    .select()
    .from(documents)
    .where(and(...conditions))
    .orderBy(asc(documents.createdAt));
};

export const getDocumentNamesByFolderId = async (folderId: string | null) => {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return await db
    .select({ name: documents.name })
    .from(documents)
    .where(
      and(
        eq(documents.uploadedById, session.user.id),
        folderId
          ? eq(documents.folderId, folderId)
          : isNull(documents.folderId),
      ),
    );
};

"use server";
import { put, type PutBlobResult, getDownloadUrl } from "@vercel/blob";
import { eq, isNull, and, asc, sql } from "drizzle-orm";
import { auth } from "../auth";
import { db } from "../db";
import { documents } from "../db/schema";

async function putDocumentInBucket(
  file: File,
  userId: string,
): Promise<PutBlobResult> {
  const timestamp = Date.now();
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const blobPathname = `documents/${userId}/${timestamp}-${sanitizedFileName}`;
  const blob = await put(blobPathname, file, {
    access: "public",
    addRandomSuffix: false,
    onUploadProgress: (progress) => {
      console.log(progress, 'PROGRESS');
    },
  });
  return blob;
}

export const createDocument = async (file: File, folderId: string | null) => {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const blob = await putDocumentInBucket(file, session.user.id);

  // Save metadata to database
  const [newDocument] = await db
    .insert(documents)
    .values({
      name: file.name,
      folderId: folderId ?? null,
      uploadedById: session.user.id,
      blobUrl: blob.url,
      blobPathname: blob.pathname,
      fileSize: file.size,
      mimeType: file.type,
      version: 1,
      previousVersionId: null,
    })
    .returning();

  return newDocument;
};

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

export const getDocumentsByFolderId = async (folderId: string | null) => {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return await db
    .select()
    .from(documents)
    .where(
      and(
        eq(documents.uploadedById, session.user.id),
        folderId
          ? eq(documents.folderId, folderId)
          : isNull(documents.folderId),
        isNull(documents.deletedAt), // Only return non-deleted documents
      ),
    )
    .orderBy(asc(documents.createdAt));
};

export const downloadDocument = async (documentId: string) => {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const [document] = await db
    .select()
    .from(documents)
    .where(eq(documents.id, documentId));

  if (!document) {
    throw new Error("Document not found");
  }


  console.log(await getDownloadUrl(document.blobUrl));

  return await getDownloadUrl(document.blobUrl);
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
        folderId ? eq(documents.folderId, folderId) : isNull(documents.folderId),
      ),
    );
};

"use server";

import { and, eq, isNotNull } from "drizzle-orm";
import { del } from "@vercel/blob";
import { db } from "../db";
import { documents } from "../db/schema";

/**
 * Cleanup soft-deleted documents (where deletedAt is not null)
 * This includes deleting from both database and Vercel Blob storage
 */
export async function cleanupSoftDeletedDocuments() {
  try {
    console.log("[Cleanup] Starting cleanup of soft-deleted documents...");

    // Find all documents where deletedAt is NOT null (soft-deleted documents)
    const documentsToDelete = await db
      .select()
      .from(documents)
      .where(isNotNull(documents.deletedAt));

    console.log(`[Cleanup] Found ${documentsToDelete.length} soft-deleted documents`);

    if (documentsToDelete.length === 0) {
      return {
        success: true,
        deletedCount: 0,
        message: "No soft-deleted documents to clean up",
      };
    }

    let successCount = 0;
    let errorCount = 0;
    const errors: Array<{ documentId: string; error: string }> = [];

    // Delete each document from storage and database
    for (const document of documentsToDelete) {
      try {
        // Delete from Vercel Blob storage
        if (document.blobUrl) {
          try {
            await del(document.blobUrl);
            console.log(`[Cleanup] Deleted blob: ${document.blobUrl}`);
          } catch (blobError) {
            console.error(`[Cleanup] Error deleting blob for document ${document.id}:`, blobError);
            // Continue with database deletion even if blob deletion fails
          }
        }

        // Permanently delete from database (hard delete)
        await db
          .delete(documents)
          .where(
            and(
              eq(documents.id, document.id),
              isNotNull(documents.deletedAt)
            )
          );

        successCount++;
        console.log(`[Cleanup] Successfully permanently deleted soft-deleted document: ${document.id} (${document.name})`);
      } catch (error) {
        errorCount++;
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        errors.push({ documentId: document.id, error: errorMessage });
        console.error(`[Cleanup] Error deleting document ${document.id}:`, error);
      }
    }

    console.log(`[Cleanup] Cleanup completed. Success: ${successCount}, Errors: ${errorCount}`);

    return {
      success: errorCount === 0,
      deletedCount: successCount,
      errorCount,
      errors: errors.length > 0 ? errors : undefined,
      message: `Cleanup completed. Deleted ${successCount} documents${errorCount > 0 ? ` (${errorCount} errors)` : ""}`,
    };
  } catch (error) {
    console.error("[Cleanup] Fatal error during cleanup:", error);
    return {
      success: false,
      deletedCount: 0,
      errorCount: 0,
      message: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

import { integer, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { createTable } from "./base";
import { folders } from "./folders";
import { users } from "./users";
import type { InferSelectModel } from "drizzle-orm";

// Documents table
export const documents = createTable("documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  folderId: uuid("folder_id").references(() => folders.id, {
    onDelete: "cascade",
  }), // null means root level
  uploadedById: text("uploaded_by_id")
    .references(() => users.id)
    .notNull(),

  // Vercel Blob metadata
  blobUrl: text("blob_url").notNull(), // URL from Vercel Blob
  blobPathname: text("blob_pathname").notNull(), // e.g., "documents/{documentId}/{fileName}"
  fileSize: integer("file_size").notNull(),
  mimeType: text("mime_type").notNull(),

  // Versioning
  version: integer("version").default(1).notNull(),
  previousVersionId: uuid("previous_version_id"),

  // Soft delete
  deletedAt: timestamp("deleted_at"), // NULL = not deleted, timestamp = soft deleted

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type DocumentModel = InferSelectModel<typeof documents>;

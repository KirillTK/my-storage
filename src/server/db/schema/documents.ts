import { pgTable, text, timestamp, uuid, integer } from 'drizzle-orm/pg-core';

import { folders } from './folders';
import { users } from './users';

// Documents table
export const documents = pgTable('documents', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  folderId: uuid('folder_id').references(() => folders.id, { onDelete: 'cascade' }).notNull(),
  uploadedById: text('uploaded_by_id').references(() => users.id).notNull(),
  
  // Vercel Blob metadata
  blobUrl: text('blob_url').notNull(), // URL from Vercel Blob
  blobPathname: text('blob_pathname').notNull(), // e.g., "documents/{documentId}/{fileName}"
  fileSize: integer('file_size').notNull(),
  mimeType: text('mime_type').notNull(),
  
  // Versioning
  version: integer('version').default(1).notNull(),
  previousVersionId: uuid('previous_version_id'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});



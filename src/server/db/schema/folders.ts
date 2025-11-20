import { text, timestamp, uuid } from "drizzle-orm/pg-core";

import { createTable } from "./base";
import { users } from "./users";
import type { InferSelectModel } from "drizzle-orm";
import type { DocumentModel } from "./documents";

// Folders table
export const folders = createTable(
  "folders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    parentFolderId: uuid("parent_folder_id"), // NULL = root level
    ownerId: text("owner_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (folders) => ({
    uniqueNameWithinParent: {
      columns: [folders.name, folders.parentFolderId],
      unique: true,
    },
  }),
);

export type FolderModel = InferSelectModel<typeof folders>;

export type FolderWithChildrenAndDocumentsModel = InferSelectModel<
  typeof folders
> & {
  children: FolderModel[];
  documents: DocumentModel[];
};

import { text, timestamp, uuid } from "drizzle-orm/pg-core";

import { createTable } from "./base";
import { documents } from "./documents";
import { users } from "./users";
import { permissionEnum } from "./enums";

// Folder and Document permissions (combined)
export const documentPermissions = createTable("document_permissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  documentId: uuid("document_id")
    .references(() => documents.id, { onDelete: "cascade" })
    .notNull(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  permission: permissionEnum("permission").notNull(), // view, download, comment, edit, delete
  grantedAt: timestamp("granted_at").defaultNow().notNull(),
});

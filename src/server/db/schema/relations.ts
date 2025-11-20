import { relations } from "drizzle-orm";

import { accounts } from "./accounts";
import { sessions } from "./sessions";
import { users } from "./users";
import { folders } from "./folders";
import { documents } from "./documents";
import { documentPermissions } from "./document-permissions";

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

// Folders relations
export const foldersRelations = relations(folders, ({ one, many }) => ({
  parent: one(folders, {
    fields: [folders.parentFolderId],
    references: [folders.id],
    relationName: "parentFolder", // Add explicit relation name
  }),
  children: many(folders, {
    relationName: "parentFolder", // Specify it's the inverse of parentFolder
  }),
  documents: many(documents),
  owner: one(users, {
    fields: [folders.ownerId],
    references: [users.id],
  }),
}));

// Documents relations
export const documentsRelations = relations(documents, ({ one, many }) => ({
  folder: one(folders, {
    fields: [documents.folderId],
    references: [folders.id],
  }),
  uploadedBy: one(users, {
    fields: [documents.uploadedById],
    references: [users.id],
  }),
  permissions: many(documentPermissions),
  previousVersion: one(documents, {
    fields: [documents.previousVersionId],
    references: [documents.id],
  }),
  versions: many(documents),
}));

// Document permissions relations
export const documentPermissionsRelations = relations(documentPermissions, ({ one }) => ({
  document: one(documents, {
    fields: [documentPermissions.documentId],
    references: [documents.id],
  }),
  user: one(users, {
    fields: [documentPermissions.userId],
    references: [users.id],
  }),
}));


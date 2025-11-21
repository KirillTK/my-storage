import { pgEnum } from "drizzle-orm/pg-core";

// Enums
export const roleEnum = pgEnum("role", ["admin", "editor", "viewer"]);

export const permissionEnum = pgEnum("permission", [
  "view",
  "download",
  "comment",
  "edit",
  "delete",
]);

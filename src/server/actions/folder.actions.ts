'use server';
import { auth } from "../auth";
import { db } from "../db";
import { folders } from "../db/schema";

export const createFolder = async (name: string, parentFolderId: string | null) => {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const newFolder = await db.insert(folders).values({
    name,
    parentFolderId,
    ownerId: session.user.id,
  });

  console.log(newFolder);

  return newFolder;
};

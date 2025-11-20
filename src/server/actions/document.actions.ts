import { auth } from "../auth";
import { db } from "../db";
import { documents } from "../db/schema";

export const createDocument = async (file: File, folderId: string | null) => {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const newDocument = await db.insert(documents).values({
    name: file.name,
    folderId,
    uploadedById: session.user.id,
    blobUrl: "",
    blobPathname: "",
    fileSize: file.size,
    mimeType: file.type,
    version: 1,
    previousVersionId: null,
  });
};

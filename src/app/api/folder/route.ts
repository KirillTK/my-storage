import { NextResponse } from "next/server";
import {
  getFolderMetadata,
  getFoldersByParentFolderId,
} from "~/server/actions/folder.actions";
import { auth } from "~/server/auth";

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const folderId = searchParams.get("folderId");

  const folders = await getFolderMetadata(folderId || null);

  return NextResponse.json(folders);
}

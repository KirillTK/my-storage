import { type NextRequest, NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { documents } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const documentId = searchParams.get("id");

  if (!documentId) {
    return NextResponse.json(
      { error: "Document ID required" },
      { status: 400 },
    );
  }

  const [document] = await db
    .select()
    .from(documents)
    .where(eq(documents.id, documentId));

  if (!document || document.uploadedById !== session.user.id) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  // Fetch from Vercel Blob
  const blobResponse = await fetch(document.blobUrl);

  if (!blobResponse.ok) {
    return NextResponse.json(
      { error: "Failed to fetch blob" },
      { status: 500 },
    );
  }

  // Stream the response
  const stream = new ReadableStream({
    async start(controller) {
      const reader = blobResponse.body?.getReader();
      if (!reader) {
        controller.close();
        return;
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          controller.close();
          break;
        }
        controller.enqueue(value);
      }
    },
  });

  // Encode filename for Content-Disposition header
  const encodedFilename = encodeURIComponent(document.name);

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "application/octet-stream", // Force download instead of opening
      "Content-Disposition": `attachment; filename="${encodedFilename}"; filename*=UTF-8''${encodedFilename}`,
      "Content-Length": blobResponse.headers.get("content-length") ?? "",
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff", // Prevent MIME type sniffing
    },
  });
}

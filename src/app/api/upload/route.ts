import { NextRequest, NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { auth } from "~/server/auth";
import { createDocumentFromBlob } from "~/server/actions/document.actions";
import { MAX_FILE_SIZE, MAX_FILE_SIZE_MB } from "~/shared/lib/constants";
import { revalidatePath } from "next/cache";

interface ClientPayload {
  folderId?: string | null;
  fileName?: string;
  fileSize?: number;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to upload files." },
        { status: 401 },
      );
    }

    const body = (await request.json()) as HandleUploadBody;

    try {
      const jsonResponse = await handleUpload({
        body,
        request,
        onBeforeGenerateToken: async (pathname, clientPayload) => {
          // Parse client payload to get folderId and file info
          let payload: ClientPayload = {};

          if (clientPayload) {
            try {
              payload = JSON.parse(clientPayload) as ClientPayload;
            } catch {
              payload = {};
            }
          }

          // Validate file size
          if (payload.fileSize && payload.fileSize > MAX_FILE_SIZE) {
            throw new Error(
              `File size exceeds the maximum allowed size of ${MAX_FILE_SIZE_MB}MB`,
            );
          }

          // Construct the callback URL dynamically from the request
          const url = new URL(request.url);
          const callbackUrl = `${url.protocol}//${url.host}/api/upload`;

          // Validate and authorize the upload
          return {
            allowedContentTypes: [
              "image/*",
              "video/*",
              "audio/*",
              "application/pdf",
              "text/*",
              "application/*",
            ],
            addRandomSuffix: true, // Add random suffix to prevent collisions
            tokenPayload: JSON.stringify({
              userId: session.user.id,
              folderId: payload.folderId ?? null,
              fileName: payload.fileName ?? "",
              fileSize: payload.fileSize ?? 0,
            }),
            callbackUrl,
          };
        },
      });

      return NextResponse.json(jsonResponse);
    } catch (error) {
      console.error("Upload error:", error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Upload failed" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during upload." },
      { status: 500 },
    );
  }
}

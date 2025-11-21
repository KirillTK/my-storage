import { NextResponse } from "next/server";
import {
  uploadDocumentToBlob,
  createDocumentFromBlob,
  type UploadProgress,
} from "~/server/actions/document.actions";
import { auth } from "~/server/auth";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to upload files." },
        { status: 401 },
      );
    }

    // Get the form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folderId = formData.get("folderId") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided. Please select a file to upload." },
        { status: 400 },
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      return NextResponse.json(
        { error: `File size (${sizeMB}MB) exceeds the maximum limit of 5MB.` },
        { status: 400 },
      );
    }

    // Validate file name
    if (!file.name || file.name.trim().length === 0) {
      return NextResponse.json(
        { error: "Invalid file name. Please rename the file and try again." },
        { status: 400 },
      );
    }

    // Create a ReadableStream to send progress updates
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        try {
          // Upload to blob storage with progress tracking
          const blob = await uploadDocumentToBlob(
            file,
            session.user.id,
            (progress: UploadProgress) => {
              // Send progress update to client
              const progressData = JSON.stringify({
                type: "progress",
                ...progress,
              });
              controller.enqueue(encoder.encode(`data: ${progressData}\n\n`));
            },
          );

          // Send completion message
          const completeData = JSON.stringify({
            type: "complete",
            message: "Upload completed, creating document...",
          });
          controller.enqueue(encoder.encode(`data: ${completeData}\n\n`));

          // Create document only after upload completes
          const newDocument = await createDocumentFromBlob(
            blob,
            file.name,
            file.size,
            file.type,
            folderId,
            session.user.id,
          );

          // Send final success message
          const successData = JSON.stringify({
            type: "success",
            document: newDocument,
            message: "File uploaded successfully.",
          });
          controller.enqueue(encoder.encode(`data: ${successData}\n\n`));
          controller.close();
        } catch (error) {
          console.error("Upload error:", error);

          let errorMessage = "An unexpected error occurred during upload. Please try again.";

          if (error instanceof Error) {
            // Check for blob storage errors
            if (error.message.includes("blob")) {
              errorMessage = "Failed to upload file to storage. Please try again.";
            }
            // Check for database errors
            else if (
              error.message.includes("database") ||
              error.message.includes("insert")
            ) {
              errorMessage = "Failed to save file metadata. Please try again.";
            } else {
              errorMessage = error.message;
            }
          }

          const errorData = JSON.stringify({
            type: "error",
            error: errorMessage,
          });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Upload error:", error);

    return NextResponse.json(
      {
        error: "An unexpected error occurred during upload. Please try again.",
      },
      { status: 500 },
    );
  }
}

// Configure maximum upload size for Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};

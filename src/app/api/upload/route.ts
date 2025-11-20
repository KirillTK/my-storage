import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { createDocument } from "~/server/actions/document.actions";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { documents } from "~/server/db/schema";

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

    const newDocument = await createDocument(file, folderId);

    return NextResponse.json({
      success: true,
      document: newDocument,
      message: "File uploaded successfully.",
    });
  } catch (error) {
    console.error("Upload error:", error);

    // Handle specific error types
    if (error instanceof Error) {
      // Check for blob storage errors
      if (error.message.includes("blob")) {
        return NextResponse.json(
          { error: "Failed to upload file to storage. Please try again." },
          { status: 500 },
        );
      }

      // Check for database errors
      if (
        error.message.includes("database") ||
        error.message.includes("insert")
      ) {
        return NextResponse.json(
          { error: "Failed to save file metadata. Please try again." },
          { status: 500 },
        );
      }
    }

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

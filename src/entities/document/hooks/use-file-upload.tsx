"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { upload } from "@vercel/blob/client";
import { formatBytes } from "../../../shared/lib/formatters.utils";
import { createDocumentFromBlob } from "~/server/actions/document.actions";

interface UseFileUploadOptions {
  folderId?: string | null;
  onUploadComplete?: () => void;
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const { folderId, onUploadComplete } = options;
  const router = useRouter();

  const uploadSingleFile = async (file: File): Promise<boolean> => {
    const abortController = new AbortController();
    let isCancelled = false;
    const toastId = toast.loading("Preparing upload...", {
      description: file.name,
    });

    try {
      // Create a promise that resolves to null when aborted
      const abortPromise = new Promise<null>((resolve) => {
        abortController.signal.addEventListener("abort", () => {
          isCancelled = true;
          console.log(`Upload cancelled for: ${file.name}`);
          resolve(null);
        });
      });

      // Race between upload and abort
      const uploadPromise = upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
        clientPayload: JSON.stringify({
          folderId,
          fileName: file.name,
          fileSize: file.size,
        }),
        onUploadProgress: (progress) => {
          if (isCancelled) return;

          const percentage = (progress.loaded / progress.total) * 100;

          toast.loading(
            <div className="w-full min-w-[240px]">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-sm font-medium">Uploading...</span>
                <span className="text-muted-foreground shrink-0 text-xs">
                  {Math.round(percentage)}%
                </span>
              </div>
              <div className="bg-secondary h-2 w-full overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full transition-all duration-300 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-muted-foreground mt-1 max-w-[225px] truncate text-xs">
                {file.name}
              </p>
            </div>,
            {
              id: toastId,
              description: `${formatBytes(progress.loaded)} / ${formatBytes(progress.total)}`,
              action: {
                label: "Cancel",
                onClick: () => {
                  abortController.abort();
                },
              },
            },
          );
        },
      });

      const newBlob = await Promise.race([uploadPromise, abortPromise]);

      // Check if upload was cancelled
      if (newBlob === null || isCancelled) {
        toast.info("Upload cancelled", {
          id: toastId,
          description: file.name,
          duration: 2000,
        });
        return false;
      }

      await createDocumentFromBlob(
        newBlob,
        file.name,
        file.size,
        file.type,
        folderId ?? null,
      );

      console.log(`Upload completed for: ${file.name}`);
      toast.success("Upload complete", {
        id: toastId,
        description: file.name,
        duration: 2000,
        action: null,
      });

      router.refresh();
      return true;
    } catch (error) {
      console.error(`Upload error for ${file.name}:`, error);

      toast.error("Upload failed", {
        id: toastId,
        description:
          error instanceof Error ? error.message : "Failed to upload file",
      });
      return false;
    }
  };

  const uploadFiles = async (files: File[]): Promise<void> => {
    const uploadPromises = files.map((file) => uploadSingleFile(file));
    const results = await Promise.allSettled(uploadPromises);

    const hasSuccessfulUpload = results.some(
      (result) => result.status === "fulfilled" && result.value === true,
    );

    if (hasSuccessfulUpload) {
      router.refresh();
      onUploadComplete?.();
    }
  };

  return {
    uploadFiles,
    uploadSingleFile,
  };
}

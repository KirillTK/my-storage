"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { downloadFileWithProgress, formatBytes } from "~/shared/lib/file.utils";
import {
  deleteDocument,
  restoreDocument,
} from "~/server/actions/document.actions";
import type { DocumentModel } from "~/server/db/schema";

export function useDocument(document: DocumentModel) {
  const router = useRouter();

  const handleDownload = async () => {
    const abortController = new AbortController();
    let wasCancelled = false;

    const toastId = toast.loading("Preparing download...", {
      description: document.name,
    });

    try {
      const apiUrl = `/api/download?id=${document.id}`;

      // Listen for abort to track cancellation
      abortController.signal.addEventListener("abort", () => {
        wasCancelled = true;
      });

      await downloadFileWithProgress(
        apiUrl,
        document.name,
        (progress) => {
          // Update toast with progress
          toast.loading(
            <div className="w-full min-w-[240px]">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-sm font-medium">Downloading...</span>
                <span className="text-muted-foreground shrink-0 text-xs">
                  {Math.round(progress.percentage)}%
                </span>
              </div>
              <div className="bg-secondary h-2 w-full overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full transition-all duration-300 ease-out"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
              <p className="text-muted-foreground mt-1 truncate text-xs">
                {document.name}
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
        abortController.signal,
      );

      // Check if cancelled after completion
      if (wasCancelled) {
        toast.info("Download cancelled", {
          id: toastId,
          description: document.name,
          duration: 2000,
        });
        return;
      }

      // Success toast
      toast.success("Download complete", {
        id: toastId,
        description: document.name,
        duration: 2000,
      });
    } catch (error) {
      console.error(`Download error for ${document.name}:`, error);

      // Check if it was cancelled
      if (wasCancelled) {
        toast.info("Download cancelled", {
          id: toastId,
          description: document.name,
          duration: 2000,
        });
        return;
      }

      toast.error("Download failed", {
        id: toastId,
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDocument(document.id);

      // Show toast with undo action
      toast(`Document "${document.name}" has been deleted`, {
        description: "You can undo this action",
        action: {
          label: "Undo",
          //eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick: async () => {
            try {
              await restoreDocument(document.id);
              router.refresh();
              toast.success("Document restored");
            } catch (error) {
              console.error("Failed to restore document:", error);
              toast.error("Failed to restore document");
            }
          },
        },
      });

      router.refresh();
    } catch (error) {
      console.error("Failed to delete document:", error);
      toast.error("Failed to delete document");
    }
  };

  return {
    handleDownload,
    handleDelete,
  };
}

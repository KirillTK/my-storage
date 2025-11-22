export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

export const getFileExtension = (fileName: string) => {
  return fileName.split(".").pop();
};

export const getFileNameWithoutExtension = (fileName: string) => {
  return fileName.split(".").slice(0, -1).join(".");
};

export function getFileTypeLabel(mimeType: string, filename: string): string {
  const extension = getFileExtension(filename);

  const typeMap: [string | RegExp, string][] = [
    ["pdf", "PDF"],
    [/(excel|spreadsheet)/i, "EXCEL"],
    [/(word|document)/i, "WORD"],
    ["image", "IMAGE"],
    ["video", "VIDEO"],
    ["audio", "AUDIO"],
    [/(zip|archive)/i, "ARCHIVE"],
  ];

  for (const [pattern, label] of typeMap) {
    if (typeof pattern === "string" && mimeType.includes(pattern)) {
      return label;
    }
    if (pattern instanceof RegExp && pattern.test(mimeType)) {
      return label;
    }
  }

  return extension ? extension.toUpperCase() : "FILE";
}

export async function downloadFileWithProgress(
  url: string,
  filename: string,
  onProgress?: (progress: {
    loaded: number;
    total: number;
    percentage: number;
  }) => void,
) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to download file");
  }

  const contentLength = response.headers.get("content-length");
  const total = contentLength ? parseInt(contentLength, 10) : 0;
  const reader = response.body?.getReader();
  const chunks: Uint8Array[] = [];
  let loaded = 0;

  if (!reader) {
    throw new Error("No response body");
  }

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    chunks.push(value);
    loaded += value.length;

    if (onProgress && total > 0) {
      onProgress({
        loaded,
        total,
        percentage: (loaded / total) * 100,
      });
    }
  }

  // Create blob and download
  const blob = new Blob(chunks as BlobPart[]);
  const blobUrl = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(blobUrl);
}

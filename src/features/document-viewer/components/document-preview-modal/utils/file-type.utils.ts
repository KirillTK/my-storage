import { getFileExtension } from "~/shared/lib/file.utils";

export type FileType =
  | "image"
  | "pdf"
  | "video"
  | "audio"
  | "text"
  | "unsupported";

const IMAGE_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "svg",
  "bmp",
  "ico",
  "tiff",
  "tif",
];
const VIDEO_EXTENSIONS = ["mp4", "avi", "mov", "wmv", "flv", "webm", "mkv"];
const AUDIO_EXTENSIONS = ["mp3", "wav", "flac", "aac", "ogg", "m4a"];
const TEXT_EXTENSIONS = [
  "txt",
  "md",
  "json",
  "xml",
  "yaml",
  "yml",
  "js",
  "ts",
  "jsx",
  "tsx",
  "css",
  "html",
];

export interface FileTypeInfo {
  type: FileType;
  extension: string;
  mimeType: string;
}

export function detectFileType(
  fileName: string,
  mimeType: string,
): FileTypeInfo {
  const extension = getFileExtension(fileName)?.toLowerCase() ?? "";
  const normalizedMimeType = mimeType.toLowerCase();

  // Check by MIME type first, then fall back to extension
  if (
    normalizedMimeType.startsWith("image/") ||
    IMAGE_EXTENSIONS.includes(extension)
  ) {
    return { type: "image", extension, mimeType: normalizedMimeType };
  }

  if (normalizedMimeType === "application/pdf" || extension === "pdf") {
    return { type: "pdf", extension, mimeType: normalizedMimeType };
  }

  if (
    normalizedMimeType.startsWith("video/") ||
    VIDEO_EXTENSIONS.includes(extension)
  ) {
    return { type: "video", extension, mimeType: normalizedMimeType };
  }

  if (
    normalizedMimeType.startsWith("audio/") ||
    AUDIO_EXTENSIONS.includes(extension)
  ) {
    return { type: "audio", extension, mimeType: normalizedMimeType };
  }

  if (
    normalizedMimeType.startsWith("text/") ||
    TEXT_EXTENSIONS.includes(extension)
  ) {
    return { type: "text", extension, mimeType: normalizedMimeType };
  }

  return { type: "unsupported", extension, mimeType: normalizedMimeType };
}

import { FileImage, File } from "lucide-react";
import {
  ICON_FILE_TYPE_MAP,
  COLOR_FILE_TYPE_MAP,
} from "~/entities/document/const/icon-map-by-type.const";
import { IMAGE_FORMATS } from "~/entities/document/const/image-format.const";
import { getFileExtension } from '~/shared/lib/file.utils';

export function getFileIcon(filename: string, className: string = "h-5 w-5") {
  const extension = getFileExtension(filename) ?? "";

  // Check if it's an image
  if (IMAGE_FORMATS.includes(extension)) {
    return <FileImage className={className} />;
  }

  // Get icon from map or default to File icon
  const IconComponent = ICON_FILE_TYPE_MAP.get(extension) || File;
  return <IconComponent className={className} />;
}

export function getFileColors(filename: string): {
  bg: string;
  icon: string;
} {
  const extension = getFileExtension(filename) ?? "";

  // Check if it's an image
  if (IMAGE_FORMATS.includes(extension)) {
    return { bg: "bg-purple-500/15", icon: "text-purple-600" };
  }

  // Get colors from map or default
  return (
    COLOR_FILE_TYPE_MAP.get(extension) || {
      bg: "bg-gray-500/15",
      icon: "text-gray-600",
    }
  );
}


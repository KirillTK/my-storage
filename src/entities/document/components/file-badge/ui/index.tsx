import { FileText } from 'lucide-react';
import React from 'react';
import { COLOR_FILE_TYPE_MAP, ICON_FILE_TYPE_MAP } from '~/entities/document/const/icon-map-by-type.const';

interface FileBadgeProps {
  fileType: string;
}


export function FileBadge({ fileType }: FileBadgeProps) {
  const color = COLOR_FILE_TYPE_MAP.get(fileType) ?? { bg: "bg-primary/15", icon: "text-primary" };
  const IconComponent = ICON_FILE_TYPE_MAP.get(fileType) ?? FileText;


  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border backdrop-blur-sm ${color.bg}`}>
      <IconComponent className={`h-5 w-5 ${color.icon}`} />
      <span className="text-base font-semibold">{fileType}</span>
    </div>
  );
};

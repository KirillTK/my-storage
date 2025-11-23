"use client";
import { X } from "lucide-react";
import { PopoverContent } from "~/shared/components/ui/popover";
import { Button } from "~/shared/components/ui/button";

export interface MetadataItem {
  label: string;
  value: string | number | null | undefined;
}

interface MetadataViewerProps {
  metadata: MetadataItem[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MetadataViewer({
  metadata,
  isOpen,
  onOpenChange,
}: MetadataViewerProps) {
  if (!isOpen) return null;

  return (
    <PopoverContent
      className="w-96"
      onClick={(e) => e.stopPropagation()}
      align="start"
      side="bottom"
      sideOffset={8}
    >
      <div className="space-y-4">
        {/* Header with close button */}
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-foreground text-sm font-semibold">
            File Metadata
          </h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Metadata list */}
        <div className="space-y-3">
          {metadata.map((item, index) => (
            <div key={index} className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                {item.label}
              </dt>
              <dd className="text-foreground text-sm wrap-break-word">
                {item.value ?? "—"}
              </dd>
            </div>
          ))}
        </div>
      </div>
    </PopoverContent>
  );
}

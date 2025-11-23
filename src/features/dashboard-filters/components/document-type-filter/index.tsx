"use client";

import { Button } from "~/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "~/shared/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { FileBadge } from "~/entities/document/components/file-badge/ui";
import { DOCUMENT_TYPES } from "../../constants/filter-options.const";

interface DocumentTypeFilterProps {
  selectedTypes: string[];
  onToggle: (value: string) => void;
}

export function DocumentTypeFilter({
  selectedTypes,
  onToggle,
}: DocumentTypeFilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          Document Type
          {selectedTypes.length > 0 && (
            <span className="bg-primary text-primary-foreground ml-1 rounded-full px-2 py-0.5 text-xs">
              {selectedTypes.length}
            </span>
          )}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Filter by document type</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {DOCUMENT_TYPES.map((type) => (
          <DropdownMenuCheckboxItem
            key={type.value}
            checked={selectedTypes.includes(type.value)}
            onCheckedChange={() => onToggle(type.value)}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <FileBadge fileType={type.badgeType} />
              <span className="text-sm font-medium">{type.label}</span>
            </div>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

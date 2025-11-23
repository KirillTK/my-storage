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
import { TIME_PERIODS } from "../../constants/filter-options.const";

interface ModifiedDateFilterProps {
  selectedPeriods: string[];
  onToggle: (value: string) => void;
}

export function ModifiedDateFilter({
  selectedPeriods,
  onToggle,
}: ModifiedDateFilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          Modified
          {selectedPeriods.length > 0 && (
            <span className="bg-primary text-primary-foreground ml-1 rounded-full px-2 py-0.5 text-xs">
              {selectedPeriods.length}
            </span>
          )}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuLabel>Filter by date modified</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {TIME_PERIODS.map((period) => (
          <DropdownMenuCheckboxItem
            key={period.value}
            checked={selectedPeriods.includes(period.value)}
            onCheckedChange={() => onToggle(period.value)}
            className="cursor-pointer"
          >
            {period.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

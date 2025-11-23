"use client";

import { Button } from "~/shared/components/ui/button";

interface ClearFiltersButtonProps {
  onClear: () => void;
}

export function ClearFiltersButton({ onClear }: ClearFiltersButtonProps) {
  return (
    <Button variant="ghost" size="sm" onClick={onClear}>
      Clear filters
    </Button>
  );
}

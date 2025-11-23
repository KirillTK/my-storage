"use client";

import { DocumentTypeFilter } from "../components/document-type-filter";
import { ModifiedDateFilter } from "../components/modified-date-filter";
import { ClearFiltersButton } from "../components/clear-filters-button";
import { useFilterParams } from "../hooks/use-filter-params";

export function DashboardFilters() {
  const {
    selectedDocTypes,
    selectedPeriods,
    toggleDocType,
    togglePeriod,
    clearAllFilters,
    hasActiveFilters,
  } = useFilterParams();

  return (
    <div className="flex items-center gap-2">
      <DocumentTypeFilter
        selectedTypes={selectedDocTypes}
        onToggle={toggleDocType}
      />
      <ModifiedDateFilter
        selectedPeriods={selectedPeriods}
        onToggle={togglePeriod}
      />
      {hasActiveFilters && <ClearFiltersButton onClear={clearAllFilters} />}
    </div>
  );
}

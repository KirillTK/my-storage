"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

export function useFilterParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedDocTypes =
    searchParams.get("docType")?.split(",").filter(Boolean) ?? [];
  const selectedPeriods =
    searchParams.get("lastModified")?.split(",").filter(Boolean) ?? [];

  const updateFilter = useCallback(
    (key: string, values: string[]) => {
      const params = new URLSearchParams(searchParams.toString());

      if (values.length > 0) {
        params.set(key, values.join(","));
      } else {
        params.delete(key);
      }

      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const toggleDocType = useCallback(
    (value: string) => {
      const newTypes = selectedDocTypes.includes(value)
        ? selectedDocTypes.filter((t) => t !== value)
        : [...selectedDocTypes, value];
      updateFilter("docType", newTypes);
    },
    [selectedDocTypes, updateFilter],
  );

  const togglePeriod = useCallback(
    (value: string) => {
      const newPeriods = selectedPeriods.includes(value)
        ? selectedPeriods.filter((p) => p !== value)
        : [...selectedPeriods, value];
      updateFilter("lastModified", newPeriods);
    },
    [selectedPeriods, updateFilter],
  );

  const clearAllFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("docType");
    params.delete("lastModified");
    router.push(`${pathname}?${params.toString()}`);
  }, [pathname, router, searchParams]);

  const hasActiveFilters =
    selectedDocTypes.length > 0 || selectedPeriods.length > 0;

  return {
    selectedDocTypes,
    selectedPeriods,
    toggleDocType,
    togglePeriod,
    clearAllFilters,
    hasActiveFilters,
  };
}

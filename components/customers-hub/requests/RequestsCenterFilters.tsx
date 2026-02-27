"use client";

import { Card, CardContent } from "@/components/ui/card";
import { RequestsCenterFiltersBar } from "./RequestsCenterFiltersBar";
import { AdvancedFiltersPanel } from "./AdvancedFiltersPanel";
import type { RequestsCenterFiltersBarProps } from "./RequestsCenterFiltersBar";
import type { AdvancedFiltersPanelProps } from "./AdvancedFiltersPanel";

export interface RequestsCenterFiltersProps
  extends RequestsCenterFiltersBarProps,
    AdvancedFiltersPanelProps {
  showAdvancedFilters: boolean;
}

export function RequestsCenterFilters({
  showAdvancedFilters,
  searchQuery,
  setSearchQuery,
  applySearch,
  hasActiveFilters,
  clearFilters,
  setShowAdvancedFilters,
  activeFiltersCount,
  viewMode,
  setViewMode,
  ...advancedProps
}: RequestsCenterFiltersProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <RequestsCenterFiltersBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            applySearch={applySearch}
            hasActiveFilters={hasActiveFilters}
            clearFilters={clearFilters}
            showAdvancedFilters={showAdvancedFilters}
            setShowAdvancedFilters={setShowAdvancedFilters}
            activeFiltersCount={activeFiltersCount}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
          {showAdvancedFilters && (
            <AdvancedFiltersPanel {...advancedProps} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

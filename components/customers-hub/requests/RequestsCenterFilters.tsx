"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RequestsCenterFiltersBar } from "./RequestsCenterFiltersBar";
import type { RequestsCenterFiltersBarProps } from "./RequestsCenterFiltersBar";
import type { AdvancedFiltersPanelProps } from "./AdvancedFiltersPanel";

export interface RequestsCenterFiltersProps
  extends RequestsCenterFiltersBarProps,
    AdvancedFiltersPanelProps {
  showAdvancedFilters: boolean;
}

export function RequestsCenterFilters({
  showAdvancedFilters,
  setShowAdvancedFilters,
  searchQuery,
  setSearchQuery,
  applySearch,
  hasActiveFilters,
  clearFilters,
  viewMode,
  setViewMode,
  selectedSources,
  setSelectedSources,
  selectedPriorities,
  setSelectedPriorities,
  selectedAssignees,
  setSelectedAssignees,
  uniqueAssignees,
  selectedAppointmentTypes,
  setSelectedAppointmentTypes,
  appointmentTypes,
  dueDateFilter,
  setDueDateFilter,
  selectedCities,
  setSelectedCities,
  selectedStates,
  setSelectedStates,
  budgetMin,
  budgetMax,
  setBudgetMin,
  setBudgetMax,
  selectedPropertyTypes,
  setSelectedPropertyTypes,
  uniqueCities,
  tempBudgetMin,
  tempBudgetMax,
  setTempBudgetMin,
  setTempBudgetMax,
  isBudgetDialogOpen,
  setIsBudgetDialogOpen,
}: RequestsCenterFiltersProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4" dir="rtl">
          <RequestsCenterFiltersBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            applySearch={applySearch}
            hasActiveFilters={hasActiveFilters}
            clearFilters={clearFilters}
            showAdvancedFilters={showAdvancedFilters}
            setShowAdvancedFilters={setShowAdvancedFilters}
            viewMode={viewMode}
            setViewMode={setViewMode}
            inlineFilters={{
              selectedSources,
              setSelectedSources,
              requestDateFrom: (filterHooks as any)?.requestDateFrom ?? undefined,
              setRequestDateFrom: (filterHooks as any)?.setRequestDateFrom ?? (() => {}),
              requestDateTo: (filterHooks as any)?.requestDateTo ?? undefined,
              setRequestDateTo: (filterHooks as any)?.setRequestDateTo ?? (() => {}),
              selectedAssignees,
              setSelectedAssignees,
              uniqueAssignees,
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SavedFiltersPanel, SavedFilter } from "../SavedFiltersPanel";
import { FilterControls } from "./FilterControls";
import { ActiveFiltersBar } from "./ActiveFiltersBar";
import { AdvancedFiltersPanel } from "./AdvancedFiltersPanel";
import type { CustomerSource, CustomerActionType, Priority } from "@/types/unified-customer";

interface ActionsFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedSources: CustomerSource[];
  onSourcesChange: (sources: CustomerSource[]) => void;
  selectedPriorities: Priority[];
  onPrioritiesChange: (priorities: Priority[]) => void;
  selectedTypes: CustomerActionType[];
  onTypesChange: (types: CustomerActionType[]) => void;
  selectedAssignees: string[];
  onAssigneesChange: (assignees: string[]) => void;
  dueDateFilter: 'all' | 'overdue' | 'today' | 'week' | 'no_date';
  onDueDateFilterChange: (filter: 'all' | 'overdue' | 'today' | 'week' | 'no_date') => void;
  hasNotesFilter: boolean | null;
  onHasNotesFilterChange: (filter: boolean | null) => void;
  showAdvancedFilters: boolean;
  onToggleAdvancedFilters: () => void;
  uniqueAssignees: Array<{ id: string; name: string }>;
  onApplySavedFilter: (filter: SavedFilter) => void;
  onClearFilters: () => void;
}

export function ActionsFilters({
  searchQuery,
  onSearchChange,
  selectedSources,
  onSourcesChange,
  selectedPriorities,
  onPrioritiesChange,
  selectedTypes,
  onTypesChange,
  selectedAssignees,
  onAssigneesChange,
  dueDateFilter,
  onDueDateFilterChange,
  hasNotesFilter,
  onHasNotesFilterChange,
  showAdvancedFilters,
  onToggleAdvancedFilters,
  uniqueAssignees,
  onApplySavedFilter,
  onClearFilters,
}: ActionsFiltersProps) {
  const hasActiveFilters =
    searchQuery || 
    selectedSources.length > 0 || 
    selectedPriorities.length > 0 || 
    selectedTypes.length > 0 ||
    selectedAssignees.length > 0 ||
    dueDateFilter !== 'all' ||
    hasNotesFilter !== null;
  
  const activeFilterCount = [
    searchQuery ? 1 : 0,
    selectedSources.length,
    selectedPriorities.length,
    selectedTypes.length,
    selectedAssignees.length,
    dueDateFilter !== 'all' ? 1 : 0,
    hasNotesFilter !== null ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          {/* Search and Filters */}
          <FilterControls
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            selectedSources={selectedSources}
            onSourcesChange={onSourcesChange}
            selectedPriorities={selectedPriorities}
            onPrioritiesChange={onPrioritiesChange}
            selectedTypes={selectedTypes}
            onTypesChange={onTypesChange}
            selectedAssignees={selectedAssignees}
            onAssigneesChange={onAssigneesChange}
            dueDateFilter={dueDateFilter}
            onDueDateFilterChange={onDueDateFilterChange}
            hasNotesFilter={hasNotesFilter}
            showAdvancedFilters={showAdvancedFilters}
            onToggleAdvancedFilters={onToggleAdvancedFilters}
            uniqueAssignees={uniqueAssignees}
          />

          {/* Advanced Filters Panel */}
          {showAdvancedFilters && (
            <AdvancedFiltersPanel
              hasNotesFilter={hasNotesFilter}
              onHasNotesFilterChange={onHasNotesFilterChange}
              onDueDateFilterChange={onDueDateFilterChange}
              onPrioritiesChange={onPrioritiesChange}
              onAssigneesChange={onAssigneesChange}
            />
          )}

          {/* Saved Filters */}
          <div className="flex items-center justify-between">
            <SavedFiltersPanel
              currentFilters={{
                sources: selectedSources,
                priorities: selectedPriorities,
                types: selectedTypes,
                searchQuery,
                assignees: selectedAssignees,
                dueDateFilter,
                hasNotesFilter,
              }}
              onApplyFilter={onApplySavedFilter}
            />
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <ActiveFiltersBar
              searchQuery={searchQuery}
              onSearchChange={onSearchChange}
              selectedSources={selectedSources}
              onSourcesChange={onSourcesChange}
              selectedPriorities={selectedPriorities}
              onPrioritiesChange={onPrioritiesChange}
              selectedTypes={selectedTypes}
              onTypesChange={onTypesChange}
              selectedAssignees={selectedAssignees}
              onAssigneesChange={onAssigneesChange}
              dueDateFilter={dueDateFilter}
              onDueDateFilterChange={onDueDateFilterChange}
              hasNotesFilter={hasNotesFilter}
              onHasNotesFilterChange={onHasNotesFilterChange}
              uniqueAssignees={uniqueAssignees}
              activeFilterCount={activeFilterCount}
              onClearFilters={onClearFilters}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogHeader,
  CustomDialogTitle,
  CustomDialogFooter,
  CustomDialogClose,
} from "@/components/customComponents/CustomDialog";
import { RequestsCenterFiltersBar } from "./RequestsCenterFiltersBar";
import { AdvancedFiltersDialogContent } from "./AdvancedFiltersDialogContent";
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
  activeFiltersCount,
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
            inlineFilters={{
              selectedSources,
              setSelectedSources,
              selectedPriorities,
              setSelectedPriorities,
              selectedAssignees,
              setSelectedAssignees,
              uniqueAssignees,
            }}
          />
          <CustomDialog
            open={showAdvancedFilters}
            onOpenChange={setShowAdvancedFilters}
            maxWidth="max-w-2xl"
          >
            <CustomDialogContent>
              <CustomDialogClose onClose={() => setShowAdvancedFilters(false)} />
              <CustomDialogHeader>
                <CustomDialogTitle>تصفية متقدمة</CustomDialogTitle>
              </CustomDialogHeader>
              <div className="px-4 sm:px-6 py-4 overflow-y-auto">
                <AdvancedFiltersDialogContent
                  selectedSources={selectedSources}
                  setSelectedSources={setSelectedSources}
                  selectedPriorities={selectedPriorities}
                  setSelectedPriorities={setSelectedPriorities}
                  selectedAssignees={selectedAssignees}
                  setSelectedAssignees={setSelectedAssignees}
                  uniqueAssignees={uniqueAssignees}
                  selectedAppointmentTypes={selectedAppointmentTypes}
                  setSelectedAppointmentTypes={setSelectedAppointmentTypes}
                  appointmentTypes={appointmentTypes}
                  dueDateFilter={dueDateFilter}
                  setDueDateFilter={setDueDateFilter}
                  selectedCities={selectedCities}
                  setSelectedCities={setSelectedCities}
                  selectedStates={selectedStates}
                  setSelectedStates={setSelectedStates}
                  budgetMin={budgetMin}
                  budgetMax={budgetMax}
                  setBudgetMin={setBudgetMin}
                  setBudgetMax={setBudgetMax}
                  selectedPropertyTypes={selectedPropertyTypes}
                  setSelectedPropertyTypes={setSelectedPropertyTypes}
                  uniqueCities={uniqueCities}
                  tempBudgetMin={tempBudgetMin}
                  tempBudgetMax={tempBudgetMax}
                  setTempBudgetMin={setTempBudgetMin}
                  setTempBudgetMax={setTempBudgetMax}
                  isBudgetDialogOpen={isBudgetDialogOpen}
                  setIsBudgetDialogOpen={setIsBudgetDialogOpen}
                />
              </div>
              <CustomDialogFooter>
                <Button onClick={() => setShowAdvancedFilters(false)}>تم</Button>
              </CustomDialogFooter>
            </CustomDialogContent>
          </CustomDialog>
        </div>
      </CardContent>
    </Card>
  );
}

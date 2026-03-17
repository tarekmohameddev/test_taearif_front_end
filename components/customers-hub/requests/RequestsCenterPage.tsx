"use client";

import React from "react";
import { BulkActionsToolbar } from "../actions/BulkActionsToolbar";
import { QuickViewPanel } from "../actions/QuickViewPanel";
import { useRequestsCenterPage } from "./hooks/useRequestsCenterPage";
import { RequestsCenterHeader } from "./RequestsCenterHeader";
import { RequestsCenterStats } from "./RequestsCenterStats";
import { StageDistributionCard } from "./StageDistributionCard";
import { RequestsCenterFilters } from "./RequestsCenterFilters";
import { RequestsCenterTabs } from "./RequestsCenterTabs";
import { RequestsCenterPagination } from "./RequestsCenterPagination";
import { RequestsCenterBulkDialogs } from "./RequestsCenterBulkDialogs";
import { RequestsCenterLoading, RequestsCenterError } from "./RequestsCenterEmptyStates";
import { PropertyRequestPriorityDialog } from "./detail/PropertyRequestPriorityDialog";
import { AdvancedFiltersDialogContent } from "./AdvancedFiltersDialogContent";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { RequestsCenterPageProps } from "./types";

export function RequestsCenterPage(props?: RequestsCenterPageProps) {
  const ctx = useRequestsCenterPage(props);
  const {
    apiLoading,
    apiError,
    actions,
    stats,
    apiStages,
    selectedActionIds,
    currentTabActions,
    isAllSelected,
    clearFilters,
    hasActiveFilters,
    newFilters,
  } = ctx;

  const [filterSearch, setFilterSearch] = React.useState("");

  if (apiLoading && actions.length === 0) return <RequestsCenterLoading />;
  if (apiError && actions.length === 0) return <RequestsCenterError error={apiError} />;

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
        <RequestsCenterHeader />
        <RequestsCenterStats stats={stats} />
        <StageDistributionCard
          apiStages={apiStages}
          apiLoading={apiLoading}
          onStageClick={ctx.handleStageDistributionClick}
          isStageSelected={ctx.isStageSelected}
        />
        <RequestsCenterFilters
          searchQuery={ctx.searchQuery}
          setSearchQuery={ctx.setSearchQuery}
          applySearch={ctx.applySearch}
          hasActiveFilters={hasActiveFilters}
          clearFilters={clearFilters}
          showAdvancedFilters={ctx.showAdvancedFilters}
          setShowAdvancedFilters={ctx.setShowAdvancedFilters}
          viewMode={ctx.viewMode}
          setViewMode={ctx.setViewMode}
          sourceOptions={ctx.sourceOptions}
          selectedSources={ctx.selectedSources}
          setSelectedSources={ctx.setSelectedSources}
          selectedPriorities={ctx.selectedPriorities}
          setSelectedPriorities={ctx.setSelectedPriorities}
          selectedAppointmentTypes={ctx.selectedAppointmentTypes}
          setSelectedAppointmentTypes={ctx.setSelectedAppointmentTypes}
          appointmentTypes={ctx.appointmentTypes}
          selectedAssignees={ctx.selectedAssignees}
          setSelectedAssignees={ctx.setSelectedAssignees}
          dueDateFilter={ctx.dueDateFilter}
          setDueDateFilter={ctx.setDueDateFilter}
          requestDateFrom={ctx.requestDateFrom}
          setRequestDateFrom={ctx.setRequestDateFrom}
          requestDateTo={ctx.requestDateTo}
          setRequestDateTo={ctx.setRequestDateTo}
          selectedCities={ctx.selectedCities}
          setSelectedCities={ctx.setSelectedCities}
          selectedStates={ctx.selectedStates}
          setSelectedStates={ctx.setSelectedStates}
          budgetMin={ctx.budgetMin}
          budgetMax={ctx.budgetMax}
          setBudgetMin={ctx.setBudgetMin}
          setBudgetMax={ctx.setBudgetMax}
          selectedPropertyTypes={ctx.selectedPropertyTypes}
          setSelectedPropertyTypes={ctx.setSelectedPropertyTypes}
          uniqueAssignees={ctx.uniqueAssignees}
          uniqueCities={ctx.uniqueCities}
          tempBudgetMin={ctx.tempBudgetMin}
          tempBudgetMax={ctx.tempBudgetMax}
          setTempBudgetMin={ctx.setTempBudgetMin}
          setTempBudgetMax={ctx.setTempBudgetMax}
          isBudgetDialogOpen={ctx.isBudgetDialogOpen}
          setIsBudgetDialogOpen={ctx.setIsBudgetDialogOpen}
        />
        <RequestsCenterTabs
          activeTab={ctx.activeTab}
          setActiveTab={ctx.setActiveTab}
          stats={stats}
          viewMode={ctx.viewMode}
          inboxRequests={ctx.inboxRequests}
          followupRequests={ctx.followupRequests}
          filteredActions={ctx.filteredActions}
          completedActions={ctx.completedActions}
          getCustomerForCard={ctx.getCustomerForCard}
          selectedActionIds={selectedActionIds}
          onSelect={ctx.handleSelectAction}
          onComplete={ctx.handleComplete}
          onDismiss={ctx.handleDismiss}
          onSnooze={ctx.handleSnooze}
          onAddNote={ctx.handleAddNote}
          onQuickView={ctx.handleQuickView}
          onCompleteForTable={ctx.handleCompleteForTable}
          onDismissForTable={ctx.handleDismissForTable}
          onSnoozeForTable={ctx.handleSnoozeForTable}
          onAddNoteForTable={ctx.handleAddNoteForTable}
          onRestore={ctx.handleRestore}
          onPriorityClick={ctx.handleOpenSinglePriorityDialog}
          stagesForCards={ctx.stagesForCards}
          completingActionIds={ctx.completingActionIds}
          onStageChangeSuccess={ctx.onStageChangeSuccess}
        />
        {props?.onFetchRequests &&
          props?.pagination &&
          props.pagination.totalPages > 1 && (
            <RequestsCenterPagination
              pagination={props.pagination}
              newFilters={newFilters}
              onFetchRequests={props.onFetchRequests}
            />
          )}
        <BulkActionsToolbar
          selectedCount={selectedActionIds.size}
          totalCount={currentTabActions.length}
          onSelectAll={ctx.handleSelectAll}
          onDeselectAll={ctx.handleDeselectAll}
          onCompleteAll={ctx.handleOpenCompleteDialog}
          onDismissAll={ctx.handleOpenDismissDialog}
          onSnoozeAll={ctx.handleOpenSnoozeDialog}
          onAssignAll={ctx.handleOpenAssignDialog}
          onChangePriority={ctx.handleOpenPriorityDialog}
          isAllSelected={isAllSelected}
        />
        <QuickViewPanel
          isOpen={ctx.showQuickView}
          onClose={() => {
            ctx.setShowQuickView(false);
            ctx.setQuickViewAction(null);
            ctx.setQuickViewCustomer(null);
          }}
          customer={ctx.quickViewCustomer}
          action={ctx.quickViewAction}
        />
        <RequestsCenterBulkDialogs
          selectedActionIds={selectedActionIds}
          completeDialogOpen={ctx.completeDialogOpen}
          setCompleteDialogOpen={ctx.setCompleteDialogOpen}
          dismissDialogOpen={ctx.dismissDialogOpen}
          setDismissDialogOpen={ctx.setDismissDialogOpen}
          snoozeDialogOpen={ctx.snoozeDialogOpen}
          setSnoozeDialogOpen={ctx.setSnoozeDialogOpen}
          snoozeUntil={ctx.snoozeUntil}
          setSnoozeUntil={ctx.setSnoozeUntil}
          assignDialogOpen={ctx.assignDialogOpen}
          setAssignDialogOpen={ctx.setAssignDialogOpen}
          assignEmployee={ctx.assignEmployee}
          setAssignEmployee={ctx.setAssignEmployee}
          priorityDialogOpen={ctx.priorityDialogOpen}
          setPriorityDialogOpen={ctx.setPriorityDialogOpen}
          selectedPriority={ctx.selectedPriority}
          setSelectedPriority={ctx.setSelectedPriority}
          onBulkComplete={ctx.handleBulkComplete}
          onBulkDismiss={ctx.handleBulkDismiss}
          onBulkSnooze={ctx.handleBulkSnooze}
          onBulkAssign={ctx.handleBulkAssign}
          onBulkChangePriority={ctx.handleBulkChangePriority}
        />
        {ctx.singlePriorityAction && (
          <PropertyRequestPriorityDialog
            open={!!ctx.singlePriorityAction}
            onOpenChange={(open) => {
              if (!open) ctx.handleCloseSinglePriorityDialog();
            }}
            action={ctx.singlePriorityAction}
            selectedPriority={ctx.singlePrioritySelectedPriority}
            onSelectedPriorityChange={ctx.setSinglePrioritySelectedPriority}
            savingPriority={ctx.singlePrioritySaving}
            onSave={ctx.handleSaveSinglePriority}
            onClose={ctx.handleCloseSinglePriorityDialog}
          />
        )}
      </div>

      {/* Sidebar الفلاتر المتقدمة كـ Sheet من اليسار (مثل التعيينات) */}
      <Sheet open={ctx.showAdvancedFilters} onOpenChange={ctx.setShowAdvancedFilters}>
        <SheetContent side="left" className="w-[420px] sm:max-w-[420px] p-0" dir="rtl">
          <div className="flex flex-col h-full">
            <SheetHeader className="p-4 border-b">
              <SheetTitle className="flex items-center justify-between">
                <span>التصفية المتقدمة</span>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-red-600 hover:text-red-700"
                    onClick={clearFilters}
                  >
                    مسح الكل
                  </Button>
                )}
              </SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto p-4 space-y-3">
                <Input
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e.target.value)}
                  placeholder="ابحث عن فلتر..."
                  className="h-8 rounded-xl text-xs"
                />
                <AdvancedFiltersDialogContent
                  sourceOptions={ctx.sourceOptions}
                  selectedSources={ctx.selectedSources}
                  setSelectedSources={ctx.setSelectedSources}
                  selectedPriorities={ctx.selectedPriorities}
                  setSelectedPriorities={ctx.setSelectedPriorities}
                  selectedAssignees={ctx.selectedAssignees}
                  setSelectedAssignees={ctx.setSelectedAssignees}
                  uniqueAssignees={ctx.uniqueAssignees}
                  selectedAppointmentTypes={ctx.selectedAppointmentTypes}
                  setSelectedAppointmentTypes={ctx.setSelectedAppointmentTypes}
                  appointmentTypes={ctx.appointmentTypes}
                  dueDateFilter={ctx.dueDateFilter}
                  setDueDateFilter={ctx.setDueDateFilter}
                  requestDateFrom={ctx.requestDateFrom}
                  setRequestDateFrom={ctx.setRequestDateFrom}
                  requestDateTo={ctx.requestDateTo}
                  setRequestDateTo={ctx.setRequestDateTo}
                  selectedCities={ctx.selectedCities}
                  setSelectedCities={ctx.setSelectedCities}
                  selectedStates={ctx.selectedStates}
                  setSelectedStates={ctx.setSelectedStates}
                  budgetMin={ctx.budgetMin}
                  budgetMax={ctx.budgetMax}
                  setBudgetMin={ctx.setBudgetMin}
                  setBudgetMax={ctx.setBudgetMax}
                  selectedPropertyTypes={ctx.selectedPropertyTypes}
                  setSelectedPropertyTypes={ctx.setSelectedPropertyTypes}
                  uniqueCities={ctx.uniqueCities}
                  districtsByCity={ctx.districtsByCity ?? []}
                  districtsLoading={ctx.districtsLoading ?? false}
                  regionOptions={ctx.apiRegionNames ?? []}
                  tempBudgetMin={ctx.tempBudgetMin}
                  tempBudgetMax={ctx.tempBudgetMax}
                  setTempBudgetMin={ctx.setTempBudgetMin}
                  setTempBudgetMax={ctx.setTempBudgetMax}
                  isBudgetDialogOpen={ctx.isBudgetDialogOpen}
                  setIsBudgetDialogOpen={ctx.setIsBudgetDialogOpen}
                  filterSearch={filterSearch}
                  setFilterSearch={setFilterSearch}
                />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

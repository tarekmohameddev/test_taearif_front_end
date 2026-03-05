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
    activeFiltersCount,
    newFilters,
  } = ctx;

  if (apiLoading && actions.length === 0) return <RequestsCenterLoading />;
  if (apiError && actions.length === 0) return <RequestsCenterError error={apiError} />;

  return (
    <div className="min-h-screen" dir="rtl">
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
          activeFiltersCount={activeFiltersCount}
          viewMode={ctx.viewMode}
          setViewMode={ctx.setViewMode}
          selectedSources={ctx.selectedSources}
          setSelectedSources={ctx.setSelectedSources}
          selectedPriorities={ctx.selectedPriorities}
          setSelectedPriorities={ctx.setSelectedPriorities}
          selectedTypes={ctx.selectedTypes}
          setSelectedTypes={ctx.setSelectedTypes}
          selectedAssignees={ctx.selectedAssignees}
          setSelectedAssignees={ctx.setSelectedAssignees}
          dueDateFilter={ctx.dueDateFilter}
          setDueDateFilter={ctx.setDueDateFilter}
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
          stagesForCards={ctx.stagesForCards}
          completingActionIds={ctx.completingActionIds}
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
      </div>
    </div>
  );
}

"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import { BulkActionsToolbar } from "./BulkActionsToolbar";
import { QuickViewPanel } from "./QuickViewPanel";
import { ActionsHeader } from "./components/ActionsHeader";
import { ActionsStats } from "./components/ActionsStats";
import { ActionsFilters } from "./components/ActionsFilters";
import { ActionsTabs } from "./components/ActionsTabs";
import { KeyboardShortcutsModal } from "./components/KeyboardShortcutsModal";
import { useActionsData } from "./hooks/useActionsData";
import { useActionsHandlers } from "./hooks/useActionsHandlers";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import type { CustomerActionType, CustomerSource, Priority } from "@/types/unified-customer";
import type { SavedFilter } from "./SavedFiltersPanel";

export function ActionsPage() {
  const { 
    undoStack,
    undoLastAction,
  } = useUnifiedCustomersStore();
  
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("incoming");
  const [selectedSources, setSelectedSources] = useState<CustomerSource[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<Priority[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<CustomerActionType[]>([]);
  
  // Additional Filters
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [dueDateFilter, setDueDateFilter] = useState<'all' | 'overdue' | 'today' | 'week' | 'no_date'>('all');
  const [hasNotesFilter, setHasNotesFilter] = useState<boolean | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Bulk Selection State
  const [selectedActionIds, setSelectedActionIds] = useState<Set<string>>(new Set());
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  
  // New Feature States
  const [isCompactView, setIsCompactView] = useState(false);
  const [showDueDateGroups, setShowDueDateGroups] = useState(false);

  // Get all data using custom hook
  const {
    allActions,
    uniqueAssignees,
    filteredActions,
    incomingActions,
    followUpActions,
    aiRecommendedActions,
    overdueActions,
    todayActions,
    completedActions,
    dueDateGroupedActions,
    stats,
  } = useActionsData(
    searchQuery,
    selectedSources,
    selectedPriorities,
    selectedTypes,
    selectedAssignees,
    dueDateFilter,
    hasNotesFilter
  );

  // Get actions for current tab
  const getCurrentTabActions = useCallback(() => {
    switch (activeTab) {
      case "incoming":
        return incomingActions;
      case "followup":
        return followUpActions;
      case "ai":
        return aiRecommendedActions;
      default:
        return filteredActions;
    }
  }, [activeTab, incomingActions, followUpActions, aiRecommendedActions, filteredActions]);

  // Get handlers using custom hook
  const {
    handleComplete,
    handleDismiss,
    handleSnooze,
    handleBulkComplete,
    handleBulkDismiss,
    handleBulkSnooze,
    handleBulkAssign,
    handleBulkChangePriority,
    handleQuickView,
    handleAddNote,
    handleRestoreAction,
    handleExportCSV,
    quickViewAction,
    quickViewCustomer,
    showQuickView,
    setShowQuickView,
  } = useActionsHandlers(
    selectedActionIds,
    setSelectedActionIds,
    filteredActions,
    completedActions,
    getCurrentTabActions
  );

  // Selection handlers
  const handleSelectAction = useCallback((actionId: string, selected: boolean) => {
    setSelectedActionIds((prev) => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(actionId);
      } else {
        newSet.delete(actionId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    const currentActions = getCurrentTabActions();
    setSelectedActionIds(new Set(currentActions.map((a) => a.id)));
  }, [getCurrentTabActions]);

  const handleDeselectAll = useCallback(() => {
    setSelectedActionIds(new Set());
  }, []);

  // Check if all current tab actions are selected
  const isAllSelected = useMemo(() => {
    const currentActions = getCurrentTabActions();
    if (currentActions.length === 0) return false;
    return currentActions.every((a) => selectedActionIds.has(a.id));
  }, [getCurrentTabActions, selectedActionIds]);

  // Handle undo
  const handleUndo = useCallback(() => {
    undoLastAction();
  }, [undoLastAction]);

  // Keyboard shortcuts
  useKeyboardShortcuts(
    handleSelectAll,
    handleDeselectAll,
    handleBulkComplete,
    handleBulkDismiss,
    handleUndo,
    selectedActionIds,
    undoStack,
    setShowKeyboardShortcuts
  );

  // Clear selection when tab changes
  useEffect(() => {
    setSelectedActionIds(new Set());
  }, [activeTab]);

  // Apply saved filter
  const handleApplySavedFilter = useCallback((filter: SavedFilter) => {
    setSelectedSources(filter.sources);
    setSelectedPriorities(filter.priorities);
    setSelectedTypes(filter.types);
    setSearchQuery(filter.searchQuery);
    setSelectedAssignees(filter.assignees || []);
    setDueDateFilter(filter.dueDateFilter || 'all');
    setHasNotesFilter(filter.hasNotesFilter ?? null);
  }, []);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedSources([]);
    setSelectedPriorities([]);
    setSelectedTypes([]);
    setSelectedAssignees([]);
    setDueDateFilter('all');
    setHasNotesFilter(null);
  };

  const hasActiveFilters =
    searchQuery || 
    selectedSources.length > 0 || 
    selectedPriorities.length > 0 || 
    selectedTypes.length > 0 ||
    selectedAssignees.length > 0 ||
    dueDateFilter !== 'all' ||
    hasNotesFilter !== null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
        {/* Header */}
        <ActionsHeader
          undoStackLength={undoStack.length}
          onUndo={handleUndo}
          isCompactView={isCompactView}
          onToggleCompactView={() => setIsCompactView(!isCompactView)}
          showDueDateGroups={showDueDateGroups}
          onToggleDueDateGroups={() => setShowDueDateGroups(!showDueDateGroups)}
          onToggleKeyboardShortcuts={() => setShowKeyboardShortcuts((prev) => !prev)}
          onExportCSV={handleExportCSV}
        />

        {/* Progress Card */}
        <ActionsStats
          stats={stats}
          incomingActionsCount={incomingActions.length}
        />

        {/* Filters & Controls */}
        <ActionsFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedSources={selectedSources}
          onSourcesChange={setSelectedSources}
          selectedPriorities={selectedPriorities}
          onPrioritiesChange={setSelectedPriorities}
          selectedTypes={selectedTypes}
          onTypesChange={setSelectedTypes}
          selectedAssignees={selectedAssignees}
          onAssigneesChange={setSelectedAssignees}
          dueDateFilter={dueDateFilter}
          onDueDateFilterChange={setDueDateFilter}
          hasNotesFilter={hasNotesFilter}
          onHasNotesFilterChange={setHasNotesFilter}
          showAdvancedFilters={showAdvancedFilters}
          onToggleAdvancedFilters={() => setShowAdvancedFilters(!showAdvancedFilters)}
          uniqueAssignees={uniqueAssignees}
          onApplySavedFilter={handleApplySavedFilter}
          onClearFilters={clearFilters}
        />

        {/* Main Content Tabs */}
        <ActionsTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          incomingActions={incomingActions}
          followUpActions={followUpActions}
          aiRecommendedActions={aiRecommendedActions}
          filteredActions={filteredActions}
          completedActions={completedActions}
          showDueDateGroups={showDueDateGroups}
          dueDateGroupedActions={dueDateGroupedActions}
          isCompactView={isCompactView}
          selectedActionIds={selectedActionIds}
          isAllSelected={isAllSelected}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          onSelectAction={handleSelectAction}
          onComplete={handleComplete}
          onDismiss={handleDismiss}
          onSnooze={handleSnooze}
          onAddNote={handleAddNote}
          onQuickView={handleQuickView}
          onRestoreAction={handleRestoreAction}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />

        {/* Bulk Actions Toolbar */}
        <BulkActionsToolbar
          selectedCount={selectedActionIds.size}
          totalCount={getCurrentTabActions().length}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          onCompleteAll={handleBulkComplete}
          onDismissAll={handleBulkDismiss}
          onSnoozeAll={handleBulkSnooze}
          onAssignAll={handleBulkAssign}
          onChangePriority={handleBulkChangePriority}
          isAllSelected={isAllSelected}
        />

        {/* Keyboard Shortcuts Modal */}
        <KeyboardShortcutsModal
          isOpen={showKeyboardShortcuts}
          onClose={() => setShowKeyboardShortcuts(false)}
        />

        {/* Quick View Panel */}
        <QuickViewPanel
          isOpen={showQuickView}
          onClose={() => setShowQuickView(false)}
          customer={quickViewCustomer}
          action={quickViewAction}
        />
      </div>
    </div>
  );
}

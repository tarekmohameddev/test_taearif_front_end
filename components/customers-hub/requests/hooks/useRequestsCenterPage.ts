import React, { useState, useEffect, useRef } from "react";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import { useCustomersHubStagesStore } from "@/context/store/customers-hub-stages";
import useAuthStore from "@/context/AuthContext";
import { useCustomersHubFiltersState } from "./useCustomersHubFiltersState";
import { useRequestsCenterData } from "./useRequestsCenterData";
import { useRequestsCenterHandlers } from "./useRequestsCenterHandlers";
import type { RequestsCenterPageProps } from "../types";
import type { CustomerAction, Priority } from "@/types/unified-customer";
import type { RequestsListFilters } from "@/lib/services/customers-hub-requests-api";

export function useRequestsCenterPage(props?: RequestsCenterPageProps) {
  const store = useUnifiedCustomersStore();
  const {
    actions: storeActions,
    customers,
    completeAction: storeCompleteAction,
    dismissAction: storeDismissAction,
    snoozeAction: storeSnoozeAction,
    completeMultipleActions: storeCompleteMultipleActions,
    dismissMultipleActions: storeDismissMultipleActions,
    snoozeMultipleActions: storeSnoozeMultipleActions,
    assignMultipleActions: storeAssignMultipleActions,
    updateMultipleActionsPriority,
    getCustomerById,
    getCompletedActions,
    addActionNote,
    restoreAction,
  } = store;

  const { stages: storeStages, fetchStages } = useCustomersHubStagesStore();
  const { userData, IsLoading: authLoading } = useAuthStore();

  React.useEffect(() => {
    if (authLoading || !userData?.token) return;
    fetchStages(true);
  }, [authLoading, userData?.token, fetchStages]);

  const actions = props?.actions ?? storeActions;
  const apiStats = props?.stats;
  const apiStages = props?.stages;
  const apiLoading = props?.loading ?? false;
  const apiError = props?.error;

  React.useEffect(() => {
    console.log("🔍 RequestsCenterPage - apiStages:", apiStages);
    console.log("🔍 RequestsCenterPage - apiStages length:", apiStages?.length);
  }, [apiStages]);

  const stagesForCards =
    storeStages && storeStages.length > 0 ? storeStages : undefined;

  const completeAction = props?.onCompleteAction
    ? async (actionId: string) => {
        try {
          await props.onCompleteAction!(actionId);
        } catch (err) {
          console.error("Error completing action:", err);
        }
      }
    : storeCompleteAction;

  const dismissAction = props?.onDismissAction
    ? async (actionId: string) => {
        try {
          await props.onDismissAction!(actionId);
        } catch (err) {
          console.error("Error dismissing action:", err);
        }
      }
    : storeDismissAction;

  const snoozeAction = props?.onSnoozeAction
    ? async (actionId: string, until: string) => {
        try {
          await props.onSnoozeAction!(actionId, until);
        } catch (err) {
          console.error("Error snoozing action:", err);
        }
      }
    : storeSnoozeAction;

  const completeMultipleActions = props?.onCompleteMultipleActions
    ? async (actionIds: string[]) => {
        try {
          await props.onCompleteMultipleActions!(actionIds);
        } catch (err) {
          console.error("Error completing multiple actions:", err);
        }
      }
    : storeCompleteMultipleActions;

  const dismissMultipleActions = props?.onDismissMultipleActions
    ? async (actionIds: string[]) => {
        try {
          await props.onDismissMultipleActions!(actionIds);
        } catch (err) {
          console.error("Error dismissing multiple actions:", err);
        }
      }
    : storeDismissMultipleActions;

  const snoozeMultipleActions = props?.onSnoozeMultipleActions
    ? async (actionIds: string[], until: string) => {
        try {
          await props.onSnoozeMultipleActions!(actionIds, until);
        } catch (err) {
          console.error("Error snoozing multiple actions:", err);
        }
      }
    : storeSnoozeMultipleActions;

  const assignMultipleActions = props?.onAssignMultipleActions
    ? async (
        actionIds: string[],
        employeeId: string,
        employeeName: string
      ) => {
        try {
          const empId =
            typeof employeeId === "string" ? parseInt(employeeId) : employeeId;
          await props.onAssignMultipleActions!(actionIds, empId);
        } catch (err) {
          console.error("Error assigning multiple actions:", err);
        }
      }
    : storeAssignMultipleActions;

  const changeMultipleActionsPriority = props?.onChangeMultipleActionsPriority
    ? async (actionIds: string[], priority: Priority) => {
        try {
          await props.onChangeMultipleActionsPriority!(actionIds, priority);
        } catch (err) {
          console.error(
            "Error changing priority for multiple actions:",
            err
          );
        }
      }
    : updateMultipleActionsPriority;

  const filterHooks = useCustomersHubFiltersState();
  const {
    searchQuery,
    setSearchQuery,
    appliedSearchQuery,
    activeTab,
    setActiveTab,
    selectedSources,
    setSelectedSources,
    selectedObjectTypes,
    setSelectedPriorities,
    setSelectedAppointmentTypes,
    setSelectedAssignees,
    setDueDateFilter,
    setSelectedCities,
    setSelectedStates,
    selectedStageIds,
    setSelectedStageIds,
    setBudgetMin,
    setBudgetMax,
    setSelectedPropertyTypes,
    applySearch,
    newFilters,
  } = filterHooks;

  const [selectedActionIds, setSelectedActionIds] = useState<Set<string>>(
    new Set()
  );
  const [viewMode, setViewMode] = useState<"compact" | "grid" | "table">(
    "compact"
  );
  const [quickViewAction, setQuickViewAction] =
    useState<CustomerAction | null>(null);
  const [quickViewCustomer, setQuickViewCustomer] = useState<any>(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const [completingActionIds, setCompletingActionIds] = useState<Set<string>>(
    new Set()
  );
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [dismissDialogOpen, setDismissDialogOpen] = useState(false);
  const [snoozeDialogOpen, setSnoozeDialogOpen] = useState(false);
  const [snoozeUntil, setSnoozeUntil] = useState<string>("");
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [assignEmployee, setAssignEmployee] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [priorityDialogOpen, setPriorityDialogOpen] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<Priority | null>(
    null
  );
  const [tempBudgetMin, setTempBudgetMin] = useState<string>("");
  const [tempBudgetMax, setTempBudgetMax] = useState<string>("");
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const prevFiltersRef = useRef<string>("");

  useEffect(() => {
    if (!props?.onFetchRequests) return;
    const currentFiltersString = JSON.stringify(newFilters);
    if (prevFiltersRef.current !== currentFiltersString) {
      prevFiltersRef.current = currentFiltersString;
      const fetchWithFilters = async () => {
        try {
          console.log(
            "🔄 Filters changed, fetching requests with filters:",
            newFilters
          );
          const requestParams = newFilters as RequestsListFilters;
          console.log(
            "📤 Sending API request with flat params:",
            JSON.stringify(requestParams, null, 2)
          );
          await props.onFetchRequests!(requestParams);
        } catch (err) {
          console.error("Error fetching requests with filters:", err);
        }
      };
      fetchWithFilters();
    }
  }, [props?.onFetchRequests, newFilters]);

  const useAPIFiltering = !!props?.onFetchRequests;

  const data = useRequestsCenterData({
    actions,
    customers,
    useAPIFiltering,
    activeTab,
    apiStats,
    appliedSearchQuery,
    selectedSources,
    selectedPriorities: filterHooks.selectedPriorities,
    selectedAssignees: filterHooks.selectedAssignees,
    dueDateFilter: filterHooks.dueDateFilter,
    selectedCities: filterHooks.selectedCities,
    selectedStates: filterHooks.selectedStates,
    budgetMin: filterHooks.budgetMin,
    budgetMax: filterHooks.budgetMax,
    selectedPropertyTypes: filterHooks.selectedPropertyTypes,
    getCustomerById,
    getCompletedActions,
  });

  const isAllSelected =
    data.currentTabActions.length > 0 &&
    data.currentTabActions.every((a) => selectedActionIds.has(a.id));

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedSources([]);
    setSelectedPriorities([]);
    setSelectedAppointmentTypes([]);
    setSelectedAssignees([]);
    setDueDateFilter("all");
    setSelectedCities([]);
    setSelectedStates([]);
    setSelectedStageIds([]);
    setBudgetMin("");
    setBudgetMax("");
    setSelectedPropertyTypes([]);
  };

  const handleStageDistributionClick = (stageId: string) => {
    const stage = storeStages?.find((s) => s.stage_id === stageId);
    if (!stage) return;
    const numericId = stage.id;
    if (selectedStageIds.includes(numericId)) {
      setSelectedStageIds([]);
    } else {
      setSelectedStageIds([numericId]);
    }
  };

  const isStageSelected = (stageId: string) => {
    const stage = storeStages?.find((s) => s.stage_id === stageId);
    return stage ? selectedStageIds.includes(stage.id) : false;
  };

  const hasActiveFilters =
    appliedSearchQuery ||
    selectedSources.length > 0 ||
    selectedObjectTypes.length > 0 ||
    filterHooks.selectedPriorities.length > 0 ||
    filterHooks.selectedAppointmentTypes.length > 0 ||
    filterHooks.selectedAssignees.length > 0 ||
    filterHooks.dueDateFilter !== "all" ||
    filterHooks.selectedCities.length > 0 ||
    filterHooks.selectedStates.length > 0 ||
    filterHooks.selectedStageIds.length > 0 ||
    filterHooks.budgetMin !== "" ||
    filterHooks.budgetMax !== "" ||
    filterHooks.selectedPropertyTypes.length > 0;

  const activeFiltersCount =
    (appliedSearchQuery ? 1 : 0) +
    (selectedSources.length > 0 ? 1 : 0) +
    (selectedObjectTypes.length > 0 ? 1 : 0) +
    (filterHooks.selectedPriorities.length > 0 ? 1 : 0) +
    (filterHooks.selectedAppointmentTypes.length > 0 ? 1 : 0) +
    (filterHooks.selectedAssignees.length > 0 ? 1 : 0) +
    (filterHooks.dueDateFilter !== "all" ? 1 : 0) +
    (filterHooks.selectedCities.length > 0 ? 1 : 0) +
    (filterHooks.selectedStates.length > 0 ? 1 : 0) +
    (filterHooks.selectedStageIds.length > 0 ? 1 : 0) +
    (filterHooks.budgetMin !== "" || filterHooks.budgetMax !== "" ? 1 : 0) +
    (filterHooks.selectedPropertyTypes.length > 0 ? 1 : 0);

  const handlers = useRequestsCenterHandlers({
    completeAction,
    dismissAction,
    snoozeAction,
    completeMultipleActions,
    dismissMultipleActions,
    snoozeMultipleActions,
    assignMultipleActions,
    changeMultipleActionsPriority,
    addActionNote,
    restoreAction,
    getCustomerById: data.getCustomerForCard,
    selectedActionIds,
    currentTabActions: data.currentTabActions,
    filteredActions: data.filteredActions,
    completedActions: data.completedActions,
    setSelectedActionIds,
    setCompletingActionIds,
    setCompleteDialogOpen,
    setDismissDialogOpen,
    setSnoozeDialogOpen,
    setSnoozeUntil,
    setAssignDialogOpen,
    setAssignEmployee,
    setPriorityDialogOpen,
    setSelectedPriority,
    setQuickViewAction,
    setQuickViewCustomer,
    setShowQuickView,
    completingActionIds,
    clearFilters,
  });

  const appointmentTypes = props?.filterOptions?.data?.appointmentTypes;

  return {
    ...filterHooks,
    ...data,
    ...handlers,
    props,
    appointmentTypes,
    apiStages,
    apiLoading,
    apiError,
    actions,
    selectedActionIds,
    viewMode,
    setViewMode,
    showQuickView,
    setShowQuickView,
    quickViewAction,
    quickViewCustomer,
    setQuickViewAction,
    setQuickViewCustomer,
    completingActionIds,
    completeDialogOpen,
    setCompleteDialogOpen,
    dismissDialogOpen,
    setDismissDialogOpen,
    snoozeDialogOpen,
    setSnoozeDialogOpen,
    snoozeUntil,
    setSnoozeUntil,
    assignDialogOpen,
    setAssignDialogOpen,
    assignEmployee,
    setAssignEmployee,
    priorityDialogOpen,
    setPriorityDialogOpen,
    selectedPriority,
    setSelectedPriority,
    tempBudgetMin,
    setTempBudgetMin,
    tempBudgetMax,
    setTempBudgetMax,
    isBudgetDialogOpen,
    setIsBudgetDialogOpen,
    showAdvancedFilters,
    setShowAdvancedFilters,
    stagesForCards,
    isAllSelected,
    hasActiveFilters,
    activeFiltersCount,
    newFilters,
    selectedStageIds,
    handleStageDistributionClick,
    isStageSelected,
  };
}

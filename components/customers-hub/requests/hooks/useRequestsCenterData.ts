import { useMemo, useCallback } from "react";
import type { CustomerAction, UnifiedCustomer } from "@/types/unified-customer";
import {
  getOverdueActions,
  getActionsDueToday,
  sortActionsByPriority,
} from "@/lib/utils/action-helpers";
import { REQUEST_TYPES, FOLLOWUP_TYPES } from "../constants";

export interface UseRequestsCenterDataParams {
  actions: CustomerAction[];
  customers: UnifiedCustomer[];
  useAPIFiltering: boolean;
  activeTab: "inbox" | "followups" | "all" | "completed";
  apiStats: any;
  appliedSearchQuery: string;
  selectedSources: string[];
  selectedPriorities: string[];
  selectedAssignees: string[];
  dueDateFilter: string;
  selectedCities: string[];
  selectedStates: string[];
  budgetMin: string;
  budgetMax: string;
  selectedPropertyTypes: string[];
  getCustomerById: (id: string) => UnifiedCustomer | undefined;
  getCompletedActions: () => CustomerAction[];
  /** خريطة اسم المدينة -> اسم المنطقة (من API). إن لم تُمرَّر يُستخدم كائن فارغ. */
  cityToRegion?: Record<string, string>;
}

export function useRequestsCenterData({
  actions,
  customers,
  useAPIFiltering,
  activeTab,
  apiStats,
  appliedSearchQuery,
  selectedSources,
  selectedPriorities,
  selectedAssignees,
  dueDateFilter,
  selectedCities,
  selectedStates,
  budgetMin,
  budgetMax,
  selectedPropertyTypes,
  getCustomerById,
  getCompletedActions,
  cityToRegion = {},
}: UseRequestsCenterDataParams) {
  const allPendingActions = useMemo(
    () => {
      if (useAPIFiltering) {
        return sortActionsByPriority(
          actions.filter(
            (a) => a.status === "pending" || a.status === "in_progress"
          )
        );
      }
      return sortActionsByPriority(
        actions.filter(
          (a) => a.status === "pending" || a.status === "in_progress"
        )
      );
    },
    [actions, useAPIFiltering]
  );

  const completedActions = useMemo(() => {
    if (useAPIFiltering) {
      return actions.filter(
        (a) => a.status === "completed" || a.status === "dismissed"
      );
    }
    return getCompletedActions();
  }, [actions, useAPIFiltering, getCompletedActions]);

  const customerByIdMap = useMemo(() => {
    const map = new Map<string, UnifiedCustomer>();
    customers.forEach((c) => map.set(c.id, c));
    return map;
  }, [customers]);

  const getCustomerForCard = useCallback(
    (id: string) => customerByIdMap.get(id),
    [customerByIdMap]
  );

  const uniqueAssignees = useMemo(() => {
    const assignees = new Map<string, string>();
    allPendingActions.forEach((a) => {
      if (a.assignedTo && a.assignedToName)
        assignees.set(a.assignedTo, a.assignedToName);
    });
    return Array.from(assignees.entries()).map(([id, name]) => ({ id, name }));
  }, [allPendingActions]);

  const uniqueCities = useMemo(() => {
    const cities = new Set<string>();
    customers.forEach((c) => {
      if (c.city?.trim()) cities.add(c.city.trim());
    });
    return Array.from(cities).sort((a, b) => a.localeCompare(b, "ar"));
  }, [customers]);

  const filteredActions = useMemo(() => {
    if (useAPIFiltering) return allPendingActions;
    let filtered = allPendingActions;
    if (appliedSearchQuery) {
      const q = appliedSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.customerName.toLowerCase().includes(q) ||
          a.title.toLowerCase().includes(q) ||
          a.description?.toLowerCase().includes(q)
      );
    }
    if (selectedSources.length > 0)
      filtered = filtered.filter((a) => selectedSources.includes(a.source));
    if (selectedPriorities.length > 0)
      filtered = filtered.filter((a) => selectedPriorities.includes(a.priority));
    if (selectedAssignees.length > 0)
      filtered = filtered.filter(
        (a) => a.assignedTo && selectedAssignees.includes(a.assignedTo)
      );
    if (dueDateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const weekEnd = new Date(today);
      weekEnd.setDate(weekEnd.getDate() + 7);
      filtered = filtered.filter((a) => {
        if (dueDateFilter === "no_date") return !a.dueDate;
        if (!a.dueDate) return false;
        const due = new Date(a.dueDate);
        switch (dueDateFilter) {
          case "overdue":
            return due < now;
          case "today":
            return due >= today && due < tomorrow;
          case "week":
            return due >= today && due < weekEnd;
          default:
            return true;
        }
      });
    }
    if (
      selectedCities.length > 0 ||
      selectedStates.length > 0 ||
      budgetMin !== "" ||
      budgetMax !== "" ||
      selectedPropertyTypes.length > 0
    ) {
      const filterMin = budgetMin ? Number(budgetMin) : undefined;
      const filterMax = budgetMax ? Number(budgetMax) : undefined;
      filtered = filtered.filter((a) => {
        const customer = getCustomerById(a.customerId);
        if (!customer) return false;
        if (
          selectedCities.length > 0 &&
          (!customer.city || !selectedCities.includes(customer.city))
        )
          return false;
        if (selectedStates.length > 0) {
          const compositeKeys = selectedStates.filter((k) => /^\d+-\d+$/.test(k));
          if (compositeKeys.length > 0) {
            const actionKey =
              a.city_id != null && a.districts_id != null
                ? `${a.city_id}-${a.districts_id}`
                : null;
            if (!actionKey || !compositeKeys.includes(actionKey)) return false;
          } else {
            const customerRegion = customer.city
              ? cityToRegion[customer.city]
              : undefined;
            if (!customerRegion || !selectedStates.includes(customerRegion))
              return false;
          }
        }
        if (filterMin !== undefined || filterMax !== undefined) {
          const cMin = customer.preferences?.budgetMin;
          const cMax = customer.preferences?.budgetMax;
          if (
            filterMin !== undefined &&
            cMax !== undefined &&
            cMax < filterMin
          )
            return false;
          if (
            filterMax !== undefined &&
            cMin !== undefined &&
            cMin > filterMax
          )
            return false;
        }
        if (selectedPropertyTypes.length > 0) {
          const types = customer.preferences?.propertyType ?? [];
          if (!types.some((t) => selectedPropertyTypes.includes(t)))
            return false;
        }
        return true;
      });
    }
    return filtered;
  }, [
    allPendingActions,
    useAPIFiltering,
    appliedSearchQuery,
    selectedSources,
    selectedPriorities,
    selectedAssignees,
    dueDateFilter,
    selectedCities,
    selectedStates,
    budgetMin,
    budgetMax,
    selectedPropertyTypes,
    getCustomerById,
    cityToRegion,
  ]);

  const inboxRequests = useMemo(
    () => {
      if (useAPIFiltering && activeTab === "inbox") return filteredActions;
      return filteredActions.filter((a) => REQUEST_TYPES.includes(a.type));
    },
    [filteredActions, useAPIFiltering, activeTab]
  );

  const followupRequests = useMemo(
    () => {
      if (useAPIFiltering && activeTab === "followups") return filteredActions;
      return filteredActions.filter((a) => FOLLOWUP_TYPES.includes(a.type));
    },
    [filteredActions, useAPIFiltering, activeTab]
  );

  const overdueActions = useMemo(
    () => getOverdueActions(filteredActions),
    [filteredActions]
  );
  const todayActions = useMemo(
    () => getActionsDueToday(filteredActions),
    [filteredActions]
  );

  const getCurrentTabActions = useCallback((): CustomerAction[] => {
    switch (activeTab) {
      case "inbox":
        return inboxRequests;
      case "followups":
        return followupRequests;
      case "all":
        return filteredActions;
      case "completed":
        return completedActions;
      default:
        return filteredActions;
    }
  }, [
    activeTab,
    inboxRequests,
    followupRequests,
    filteredActions,
    completedActions,
  ]);

  const currentTabActions = getCurrentTabActions();

  const stats = useMemo(
    () => {
      if (apiStats) {
        return {
          pending: apiStats.pending ?? 0,
          inbox: apiStats.inbox ?? 0,
          followups: apiStats.followups ?? 0,
          overdue: apiStats.overdue ?? 0,
          today: apiStats.today ?? 0,
          completed: apiStats.completed ?? 0,
          total: apiStats.total ?? 0,
        };
      }
      return {
        pending: allPendingActions.length,
        inbox: inboxRequests.length,
        followups: followupRequests.length,
        overdue: overdueActions.length,
        today: todayActions.length,
        completed: completedActions.length,
        total: allPendingActions.length,
      };
    },
    [
      apiStats,
      allPendingActions.length,
      inboxRequests.length,
      followupRequests.length,
      overdueActions.length,
      todayActions.length,
      completedActions.length,
    ]
  );

  return {
    allPendingActions,
    completedActions,
    customerByIdMap,
    getCustomerForCard,
    uniqueAssignees,
    uniqueCities,
    filteredActions,
    inboxRequests,
    followupRequests,
    overdueActions,
    todayActions,
    getCurrentTabActions,
    currentTabActions,
    stats,
  };
}

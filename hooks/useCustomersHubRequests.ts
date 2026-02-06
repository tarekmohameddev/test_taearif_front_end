import { useState, useEffect, useCallback } from "react";
import useAuthStore from "@/context/AuthContext";
import {
  getRequestsList,
  getFilterOptions,
  completeAction as apiCompleteAction,
  dismissAction as apiDismissAction,
  snoozeAction as apiSnoozeAction,
  assignAction as apiAssignAction,
  type RequestsListParams,
  type FilterOptionsResponse,
} from "@/lib/services/customers-hub-requests-api";
import type { CustomerAction } from "@/types/unified-customer";

export function useCustomersHubRequests() {
  const { userData, IsLoading: authLoading } = useAuthStore();
  const [actions, setActions] = useState<CustomerAction[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptionsResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
  });

  // Fetch requests list
  const fetchRequests = useCallback(
    async (params: RequestsListParams) => {
      if (authLoading || !userData?.token) {
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await getRequestsList(params);
        
        if (response.status === "success") {
          // Transform actions to ensure assignedTo is string format
          const transformedActions = response.data.actions.map((action: any) => ({
            ...action,
            assignedTo: action.assignedTo?.id?.toString() || action.assignedTo?.toString() || action.assignedTo,
            assignedToName: action.assignedTo?.name || action.assignedToName,
            customerId: action.customerId?.toString() || action.customerId,
          }));
          
          setActions(transformedActions);
          if (response.data.stats) {
            setStats(response.data.stats);
          }
          if (response.data.pagination) {
            setPagination(response.data.pagination);
          }
        } else {
          setError(response.message || "Failed to load requests");
        }
      } catch (err: any) {
        console.error("Error fetching requests:", err);
        setError(
          err.response?.data?.message || "An error occurred while loading requests"
        );
      } finally {
        setLoading(false);
      }
    },
    [userData?.token, authLoading]
  );

  // Fetch filter options
  const fetchFilterOptions = useCallback(async () => {
    if (authLoading || !userData?.token) {
      return;
    }

    try {
      const response = await getFilterOptions();
      if (response.status === "success") {
        setFilterOptions(response.data);
      }
    } catch (err: any) {
      console.error("Error fetching filter options:", err);
    }
  }, [userData?.token, authLoading]);

  // Complete action
  const completeAction = useCallback(
    async (actionId: string, notes?: string) => {
      if (authLoading || !userData?.token) {
        return false;
      }

      try {
        await apiCompleteAction(actionId, notes);
        // Update local state
        setActions((prev) =>
          prev.map((action) =>
            action.id === actionId
              ? { ...action, status: "completed" as const, completedAt: new Date().toISOString() }
              : action
          )
        );
        return true;
      } catch (err: any) {
        console.error("Error completing action:", err);
        throw err;
      }
    },
    [userData?.token, authLoading]
  );

  // Dismiss action
  const dismissAction = useCallback(
    async (actionId: string, reason?: string) => {
      if (authLoading || !userData?.token) {
        return false;
      }

      try {
        await apiDismissAction(actionId, reason);
        // Update local state
        setActions((prev) =>
          prev.map((action) =>
            action.id === actionId
              ? { ...action, status: "dismissed" as const }
              : action
          )
        );
        return true;
      } catch (err: any) {
        console.error("Error dismissing action:", err);
        throw err;
      }
    },
    [userData?.token, authLoading]
  );

  // Snooze action
  const snoozeAction = useCallback(
    async (actionId: string, snoozeUntil: string, reason?: string) => {
      if (authLoading || !userData?.token) {
        return false;
      }

      try {
        await apiSnoozeAction(actionId, snoozeUntil, reason);
        // Update local state
        setActions((prev) =>
          prev.map((action) =>
            action.id === actionId
              ? { ...action, snoozedUntil: snoozeUntil, status: "snoozed" as const }
              : action
          )
        );
        return true;
      } catch (err: any) {
        console.error("Error snoozing action:", err);
        throw err;
      }
    },
    [userData?.token, authLoading]
  );

  // Assign action
  const assignAction = useCallback(
    async (actionId: string, employeeId: number) => {
      if (authLoading || !userData?.token) {
        return false;
      }

      try {
        const response = await apiAssignAction(actionId, employeeId);
        // Update local state
        setActions((prev) =>
          prev.map((action) =>
            action.id === actionId
              ? {
                  ...action,
                  assignedTo: employeeId.toString(),
                  assignedToName: response.data?.newAssignee?.name || "",
                }
              : action
          )
        );
        return true;
      } catch (err: any) {
        console.error("Error assigning action:", err);
        throw err;
      }
    },
    [userData?.token, authLoading]
  );

  // Bulk operations
  const completeMultipleActions = useCallback(
    async (actionIds: string[], notes?: string) => {
      if (authLoading || !userData?.token) {
        return false;
      }

      const promises = actionIds.map((id) => apiCompleteAction(id, notes));
      try {
        await Promise.all(promises);
        setActions((prev) =>
          prev.map((action) =>
            actionIds.includes(action.id)
              ? { ...action, status: "completed" as const, completedAt: new Date().toISOString() }
              : action
          )
        );
        return true;
      } catch (err: any) {
        console.error("Error completing multiple actions:", err);
        throw err;
      }
    },
    [userData?.token, authLoading]
  );

  const dismissMultipleActions = useCallback(
    async (actionIds: string[], reason?: string) => {
      if (authLoading || !userData?.token) {
        return false;
      }

      const promises = actionIds.map((id) => apiDismissAction(id, reason));
      try {
        await Promise.all(promises);
        setActions((prev) =>
          prev.map((action) =>
            actionIds.includes(action.id)
              ? { ...action, status: "dismissed" as const }
              : action
          )
        );
        return true;
      } catch (err: any) {
        console.error("Error dismissing multiple actions:", err);
        throw err;
      }
    },
    [userData?.token, authLoading]
  );

  const snoozeMultipleActions = useCallback(
    async (actionIds: string[], snoozeUntil: string, reason?: string) => {
      if (authLoading || !userData?.token) {
        return false;
      }

      const promises = actionIds.map((id) => apiSnoozeAction(id, snoozeUntil, reason));
      try {
        await Promise.all(promises);
        setActions((prev) =>
          prev.map((action) =>
            actionIds.includes(action.id)
              ? { ...action, snoozedUntil: snoozeUntil, status: "snoozed" as const }
              : action
          )
        );
        return true;
      } catch (err: any) {
        console.error("Error snoozing multiple actions:", err);
        throw err;
      }
    },
    [userData?.token, authLoading]
  );

  const assignMultipleActions = useCallback(
    async (actionIds: string[], employeeId: number) => {
      if (authLoading || !userData?.token) {
        return false;
      }

      const promises = actionIds.map((id) => apiAssignAction(id, employeeId));
      try {
        await Promise.all(promises);
        setActions((prev) =>
          prev.map((action) =>
            actionIds.includes(action.id)
              ? {
                  ...action,
                  assignedTo: employeeId.toString(),
                  assignedToName: action.assignedToName || "",
                }
              : action
          )
        );
        return true;
      } catch (err: any) {
        console.error("Error assigning multiple actions:", err);
        throw err;
      }
    },
    [userData?.token, authLoading]
  );

  return {
    actions,
    stats,
    filterOptions,
    loading,
    error,
    pagination,
    fetchRequests,
    fetchFilterOptions,
    completeAction,
    dismissAction,
    snoozeAction,
    assignAction,
    completeMultipleActions,
    dismissMultipleActions,
    snoozeMultipleActions,
    assignMultipleActions,
    setActions,
  };
}

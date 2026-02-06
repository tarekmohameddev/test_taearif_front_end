import { useState, useEffect, useCallback } from "react";
import useAuthStore from "@/context/AuthContext";
import {
  getActionDetail,
  getActionStats,
  completeAction as apiCompleteAction,
  dismissAction as apiDismissAction,
  snoozeAction as apiSnoozeAction,
  assignAction as apiAssignAction,
} from "@/lib/services/customers-hub-requests-api";
import type { CustomerAction } from "@/types/unified-customer";

export function useRequestDetail(requestId: string) {
  const { userData, IsLoading: authLoading } = useAuthStore();
  const [action, setAction] = useState<CustomerAction | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch action detail
  const fetchActionDetail = useCallback(async () => {
    if (authLoading || !userData?.token || !requestId) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getActionDetail(requestId);
      
      if (response.status === "success") {
        // Transform action to ensure assignedTo is string format
        const transformedAction: any = {
          ...response.data.action,
          assignedTo: response.data.action.assignedTo?.id?.toString() || 
                      response.data.action.assignedTo?.toString() || 
                      response.data.action.assignedTo,
          assignedToName: response.data.action.assignedTo?.name || 
                         response.data.action.assignedToName,
          customerId: response.data.action.customerId?.toString() || 
                     response.data.action.customerId,
        };
        
        setAction(transformedAction);
      } else {
        setError(response.message || "Failed to load action details");
      }
    } catch (err: any) {
      console.error("Error fetching action detail:", err);
      setError(
        err.response?.data?.message || "An error occurred while loading action details"
      );
    } finally {
      setLoading(false);
    }
  }, [userData?.token, authLoading, requestId]);

  // Fetch action stats
  const fetchActionStats = useCallback(async () => {
    if (authLoading || !userData?.token || !requestId) {
      return;
    }

    try {
      const response = await getActionStats(requestId);
      if (response.status === "success") {
        setStats(response.data.stats);
      }
    } catch (err: any) {
      console.error("Error fetching action stats:", err);
      // Don't set error for stats, it's optional
    }
  }, [userData?.token, authLoading, requestId]);

  // Complete action
  const completeAction = useCallback(
    async (notes?: string) => {
      if (authLoading || !userData?.token || !requestId) {
        return false;
      }

      try {
        await apiCompleteAction(requestId, notes);
        // Refresh action detail
        await fetchActionDetail();
        return true;
      } catch (err: any) {
        console.error("Error completing action:", err);
        throw err;
      }
    },
    [userData?.token, authLoading, requestId, fetchActionDetail]
  );

  // Dismiss action
  const dismissAction = useCallback(
    async (reason?: string) => {
      if (authLoading || !userData?.token || !requestId) {
        return false;
      }

      try {
        await apiDismissAction(requestId, reason);
        // Refresh action detail
        await fetchActionDetail();
        return true;
      } catch (err: any) {
        console.error("Error dismissing action:", err);
        throw err;
      }
    },
    [userData?.token, authLoading, requestId, fetchActionDetail]
  );

  // Snooze action
  const snoozeAction = useCallback(
    async (snoozeUntil: string, reason?: string) => {
      if (authLoading || !userData?.token || !requestId) {
        return false;
      }

      try {
        await apiSnoozeAction(requestId, snoozeUntil, reason);
        // Refresh action detail
        await fetchActionDetail();
        return true;
      } catch (err: any) {
        console.error("Error snoozing action:", err);
        throw err;
      }
    },
    [userData?.token, authLoading, requestId, fetchActionDetail]
  );

  // Assign action
  const assignAction = useCallback(
    async (employeeId: number) => {
      if (authLoading || !userData?.token || !requestId) {
        return false;
      }

      try {
        const response = await apiAssignAction(requestId, employeeId);
        // Refresh action detail
        await fetchActionDetail();
        return true;
      } catch (err: any) {
        console.error("Error assigning action:", err);
        throw err;
      }
    },
    [userData?.token, authLoading, requestId, fetchActionDetail]
  );

  // Initial fetch
  useEffect(() => {
    if (authLoading || !userData?.token || !requestId) {
      return;
    }

    const loadData = async () => {
      await Promise.all([
        fetchActionDetail(),
        fetchActionStats(),
      ]);
    };

    loadData();
  }, [userData?.token, authLoading, requestId, fetchActionDetail, fetchActionStats]);

  return {
    action,
    stats,
    loading,
    error,
    refetch: fetchActionDetail,
    completeAction,
    dismissAction,
    snoozeAction,
    assignAction,
  };
}

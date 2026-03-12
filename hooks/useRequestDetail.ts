import { useState, useEffect, useCallback, useRef } from "react";
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
import toast from "react-hot-toast";

export function useRequestDetail(requestId: string) {
  const { userData, IsLoading: authLoading } = useAuthStore();
  const [action, setAction] = useState<CustomerAction | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadingDetailRef = useRef(false);
  const loadingStatsRef = useRef(false);
  const lastFetchedDetailAt = useRef<{ id: string; at: number }>({ id: "", at: 0 });
  const DETAIL_DEBOUNCE_MS = 2000;

  // Fetch action detail
  const fetchActionDetail = useCallback(async () => {
    if (authLoading || !userData?.token || !requestId) {
      return;
    }
    if (loadingDetailRef.current) return;
    const now = Date.now();
    if (
      lastFetchedDetailAt.current.id === requestId &&
      now - lastFetchedDetailAt.current.at < DETAIL_DEBOUNCE_MS
    ) {
      return;
    }

    loadingDetailRef.current = true;
    try {
      setLoading(true);
      setError(null);
      const response = await getActionDetail(requestId);
      lastFetchedDetailAt.current = { id: requestId, at: Date.now() };
      
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
      loadingDetailRef.current = false;
      setLoading(false);
    }
  }, [userData?.token, authLoading, requestId]);

  // Fetch action stats
  const fetchActionStats = useCallback(async () => {
    if (authLoading || !userData?.token || !requestId) {
      return;
    }
    if (loadingStatsRef.current) return;

    loadingStatsRef.current = true;
    try {
      const response = await getActionStats(requestId);
      if (response.status === "success") {
        setStats(response.data.stats);
      }
    } catch (err: any) {
      console.error("Error fetching action stats:", err);
      // Don't set error for stats, it's optional
    } finally {
      loadingStatsRef.current = false;
    }
  }, [userData?.token, authLoading, requestId]);

  // Complete action
  const completeAction = useCallback(
    async (notes?: string) => {
      if (authLoading || !userData?.token || !requestId) {
        return false;
      }

      const toastId = toast.loading("جاري إتمام الطلب...");
      try {
        await apiCompleteAction(requestId, notes);
        toast.success("تم إتمام الطلب بنجاح", { id: toastId });
        // Refresh action detail
        await fetchActionDetail();
        return true;
      } catch (err: any) {
        console.error("Error completing action:", err);
        toast.error(
          err.response?.data?.message || "حدث خطأ أثناء إتمام الطلب",
          { id: toastId }
        );
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

      const toastId = toast.loading("جاري رفض الطلب...");
      try {
        await apiDismissAction(requestId, reason);
        toast.success("تم رفض الطلب بنجاح", { id: toastId });
        // Refresh action detail
        await fetchActionDetail();
        return true;
      } catch (err: any) {
        console.error("Error dismissing action:", err);
        toast.error(
          err.response?.data?.message || "حدث خطأ أثناء رفض الطلب",
          { id: toastId }
        );
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

      const toastId = toast.loading("جاري تأجيل الطلب...");
      try {
        await apiSnoozeAction(requestId, snoozeUntil, reason);
        toast.success("تم تأجيل الطلب بنجاح", { id: toastId });
        // Refresh action detail
        await fetchActionDetail();
        return true;
      } catch (err: any) {
        console.error("Error snoozing action:", err);
        toast.error(
          err.response?.data?.message || "حدث خطأ أثناء تأجيل الطلب",
          { id: toastId }
        );
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

      const toastId = toast.loading("جاري تعيين الطلب...");
      try {
        const response = await apiAssignAction(requestId, employeeId);
        toast.success("تم تعيين الطلب بنجاح", { id: toastId });
        // Refresh action detail
        await fetchActionDetail();
        return true;
      } catch (err: any) {
        console.error("Error assigning action:", err);
        toast.error(
          err.response?.data?.message || "حدث خطأ أثناء تعيين الطلب",
          { id: toastId }
        );
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

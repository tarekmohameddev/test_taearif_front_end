import { useState, useEffect, useCallback, useRef } from "react";
import useAuthStore from "@/context/AuthContext";
import {
  getRequestsList,
  getFilterOptions,
  completeAction as apiCompleteAction,
  dismissAction as apiDismissAction,
  snoozeAction as apiSnoozeAction,
  assignAction as apiAssignAction,
  bulkCompleteActions,
  bulkDismissActions,
  bulkSnoozeActions,
  bulkAssignActions,
  bulkChangePriority,
  type RequestsListParams,
  type FilterOptionsResponse,
  type StageDistribution,
} from "@/lib/services/customers-hub-requests-api";
import type { CustomerAction, Priority } from "@/types/unified-customer";
import { toast } from "sonner";
import type { RequestsListFilters } from "@/lib/services/customers-hub-requests-api";

export function useCustomersHubRequests() {
  const { userData, IsLoading: authLoading } = useAuthStore();
  const [actions, setActions] = useState<CustomerAction[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [stages, setStages] = useState<StageDistribution[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptionsResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
  });
  const loadingRequestsRef = useRef(false);
  const loadingFilterOptionsRef = useRef(false);
  const lastFetchedFilterOptionsAt = useRef(0);
  const FILTER_OPTIONS_DEBOUNCE_MS = 2000;

  // Fetch requests list. When options.silent is true (e.g. filter change), do not set loading state so the page does not show full-page loading.
  const fetchRequests = useCallback(
    async (
      params: RequestsListFilters | RequestsListParams,
      options?: { silent?: boolean }
    ) => {
      if (authLoading || !userData?.token) {
        return;
      }
      if (loadingRequestsRef.current) {
        return;
      }

      const silent = options?.silent === true;
      loadingRequestsRef.current = true;
      try {
        if (!silent) {
          setLoading(true);
          setError(null);
        }
        const response = await getRequestsList(params);
        
        if (response.status === "success") {
          // Transform actions to ensure assignedTo and source are string format
          const transformedActions = response.data.actions.map((action: any) => ({
            ...action,
            assignedTo: action.assignedTo?.id?.toString() || action.assignedTo?.toString() || action.assignedTo,
            assignedToName: action.assignedTo?.name || action.assignedToName,
            customerId: action.customerId !== null && action.customerId !== undefined
              ? (typeof action.customerId === 'number' ? action.customerId : parseInt(action.customerId) || action.customerId)
              : null,
            // Handle source: if it's an object, extract the id or name, otherwise use as-is
            source: typeof action.source === 'object' && action.source !== null
              ? (action.source.id || action.source.name || action.source)
              : (action.source || ''),
            // Pass new fields from API response
            objectType: action.objectType || undefined,
            propertyCategory: action.propertyCategory || null,
            propertyType: action.propertyType || null,
            city: action.city || null,
            state: action.state || null,
            budgetMin: action.budgetMin !== undefined && action.budgetMin !== null ? Number(action.budgetMin) : null,
            budgetMax: action.budgetMax !== undefined && action.budgetMax !== null ? Number(action.budgetMax) : null,
            // Pass sourceId, sourceTable, stage_id, and stage from API response
            sourceId: action.sourceId !== undefined && action.sourceId !== null 
              ? (typeof action.sourceId === 'string' ? parseInt(action.sourceId) || action.sourceId : action.sourceId)
              : undefined,
            sourceTable: action.sourceTable || undefined,
            stage_id: action.stage_id || undefined,
            stage: action.stage || undefined,
          }));
          
          setActions(transformedActions);
          // تحديث stats دائماً من API response (إجباري)
          if (response.data.stats) {
            setStats(response.data.stats);
          } else {
            // إذا لم تأت stats من API، احتفظ بالقيمة الحالية (لا تقم بالحساب المحلي)
            // هذا يضمن أن stats تأتي فقط من API
          }
          // تحديث stages من API response
          if (response.data.stages) {
            console.log("📊 Setting stages from API response:", response.data.stages);
            setStages(response.data.stages);
          } else {
            console.log("⚠️ No stages in API response");
            setStages([]);
          }
          // Handle pagination - support both new format (total/limit/offset/hasMore) and legacy format
          if (response.data.pagination) {
            const paginationData = response.data.pagination;
            // Check if it's new format (has total, limit, offset, hasMore)
            if (paginationData.total !== undefined || paginationData.limit !== undefined) {
              // New format: convert to legacy format for internal state
              const limit = paginationData.limit || 50;
              const total = paginationData.total || 0;
              const offset = paginationData.offset || 0;
              const currentPage = Math.floor(offset / limit) + 1;
              const totalPages = Math.ceil(total / limit) || 1;
              setPagination({
                currentPage,
                totalPages,
                totalItems: total,
                itemsPerPage: limit,
              });
            } else if (paginationData.currentPage !== undefined) {
              // Legacy format: use as-is
              setPagination(paginationData);
            }
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
        loadingRequestsRef.current = false;
        if (!silent) setLoading(false);
      }
    },
    [userData?.token, authLoading]
  );

  // Fetch filter options
  const fetchFilterOptions = useCallback(async () => {
    if (authLoading || !userData?.token) {
      return;
    }
    if (loadingFilterOptionsRef.current) {
      return;
    }
    const now = Date.now();
    if (now - lastFetchedFilterOptionsAt.current < FILTER_OPTIONS_DEBOUNCE_MS) {
      return;
    }

    loadingFilterOptionsRef.current = true;
    try {
      const response = await getFilterOptions();
      lastFetchedFilterOptionsAt.current = Date.now();
      if (response.status === "success") {
        setFilterOptions(response.data);
      }
    } catch (err: any) {
      console.error("Error fetching filter options:", err);
    } finally {
      loadingFilterOptionsRef.current = false;
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

  // Helper function to get current user ID
  const getCurrentUserId = useCallback((): number => {
    // محاولة الحصول على user ID من userData
    // جرب عدة مسارات محتملة للـ id
    const userId = 
      userData?.id || 
      (userData as any)?.user?.id || 
      (userData as any)?.tenant_id || 
      0;
    
    // تحويل إلى number إذا كان string
    const numId = typeof userId === 'string' ? parseInt(userId, 10) : userId;
    
    // التحقق من أن الرقم صحيح
    if (isNaN(numId) || numId <= 0) {
      console.warn('⚠️ User ID not found in userData. Using 0. User data:', userData);
      return 0;
    }
    
    return numId;
  }, [userData]);

  // Bulk operations - Using unified bulk endpoint
  const completeMultipleActions = useCallback(
    async (actionIds: string[], notes?: string) => {
      if (authLoading || !userData?.token) {
        return false;
      }

      if (actionIds.length === 0) {
        return true;
      }

      try {
        const userId = getCurrentUserId();
        const response = await bulkCompleteActions(actionIds, userId, notes);
        
        // Handle success or partial success
        if (response.status === 'success' || response.status === 'partial_success') {
          // Update only successfully completed actions
          setActions((prev) =>
            prev.map((action) =>
              response.data.actionIds.includes(action.id)
                ? { 
                    ...action, 
                    status: "completed" as const, 
                    completedAt: response.data.completedAt || new Date().toISOString() 
                  }
                : action
            )
          );

          // Show success message
          if (response.status === 'partial_success') {
            toast.success(
              `تم إكمال ${response.data.successCount} من ${actionIds.length} إجراء`,
              {
                description: response.data.failedCount > 0 
                  ? `فشل ${response.data.failedCount} إجراء` 
                  : undefined,
              }
            );
          } else {
            toast.success(`تم إكمال ${response.data.successCount} إجراء بنجاح`);
          }

          return true;
        } else {
          throw new Error(response.message || 'فشل إكمال الإجراءات');
        }
      } catch (err: any) {
        console.error("Error completing multiple actions:", err);
        toast.error(err.response?.data?.message || "حدث خطأ أثناء إكمال الإجراءات");
        throw err;
      }
    },
    [userData?.token, authLoading, getCurrentUserId]
  );

  const dismissMultipleActions = useCallback(
    async (actionIds: string[], reason?: string) => {
      if (authLoading || !userData?.token) {
        return false;
      }

      if (actionIds.length === 0) {
        return true;
      }

      try {
        const userId = getCurrentUserId();
        const response = await bulkDismissActions(actionIds, userId, reason);
        
        // Handle success or partial success
        if (response.status === 'success' || response.status === 'partial_success') {
          // Update only successfully dismissed actions
          setActions((prev) =>
            prev.map((action) =>
              response.data.actionIds.includes(action.id)
                ? { ...action, status: "dismissed" as const }
                : action
            )
          );

          // Show success message
          if (response.status === 'partial_success') {
            toast.success(
              `تم رفض ${response.data.successCount} من ${actionIds.length} إجراء`,
              {
                description: response.data.failedCount > 0 
                  ? `فشل ${response.data.failedCount} إجراء` 
                  : undefined,
              }
            );
          } else {
            toast.success(`تم رفض ${response.data.successCount} إجراء بنجاح`);
          }

          return true;
        } else {
          throw new Error(response.message || 'فشل رفض الإجراءات');
        }
      } catch (err: any) {
        console.error("Error dismissing multiple actions:", err);
        toast.error(err.response?.data?.message || "حدث خطأ أثناء رفض الإجراءات");
        throw err;
      }
    },
    [userData?.token, authLoading, getCurrentUserId]
  );

  const snoozeMultipleActions = useCallback(
    async (actionIds: string[], snoozeUntil: string, reason?: string) => {
      if (authLoading || !userData?.token) {
        return false;
      }

      if (actionIds.length === 0) {
        return true;
      }

      try {
        const userId = getCurrentUserId();
        const response = await bulkSnoozeActions(actionIds, snoozeUntil, userId, reason);
        
        // Handle success or partial success
        if (response.status === 'success' || response.status === 'partial_success') {
          // Update only successfully snoozed actions
          setActions((prev) =>
            prev.map((action) =>
              response.data.actionIds.includes(action.id)
                ? { ...action, snoozedUntil: snoozeUntil, status: "snoozed" as const }
                : action
            )
          );

          // Show success message
          if (response.status === 'partial_success') {
            toast.success(
              `تم تأجيل ${response.data.successCount} من ${actionIds.length} إجراء`,
              {
                description: response.data.failedCount > 0 
                  ? `فشل ${response.data.failedCount} إجراء` 
                  : undefined,
              }
            );
          } else {
            toast.success(`تم تأجيل ${response.data.successCount} إجراء بنجاح`);
          }

          return true;
        } else {
          throw new Error(response.message || 'فشل تأجيل الإجراءات');
        }
      } catch (err: any) {
        console.error("Error snoozing multiple actions:", err);
        toast.error(err.response?.data?.message || "حدث خطأ أثناء تأجيل الإجراءات");
        throw err;
      }
    },
    [userData?.token, authLoading, getCurrentUserId]
  );

  const assignMultipleActions = useCallback(
    async (actionIds: string[], employeeId: number) => {
      if (authLoading || !userData?.token) {
        return false;
      }

      if (actionIds.length === 0) {
        return true;
      }

      try {
        const userId = getCurrentUserId();
        const response = await bulkAssignActions(actionIds, employeeId, userId);
        
        // Handle success or partial success
        if (response.status === 'success' || response.status === 'partial_success') {
          // Update only successfully assigned actions
          // Note: We might need to fetch employee name from response or filter options
          setActions((prev) =>
            prev.map((action) =>
              response.data.actionIds.includes(action.id)
                ? {
                    ...action,
                    assignedTo: employeeId.toString(),
                    assignedToName: action.assignedToName || "",
                  }
                : action
            )
          );

          // Show success message
          if (response.status === 'partial_success') {
            toast.success(
              `تم تعيين ${response.data.successCount} من ${actionIds.length} إجراء`,
              {
                description: response.data.failedCount > 0 
                  ? `فشل ${response.data.failedCount} إجراء` 
                  : undefined,
              }
            );
          } else {
            toast.success(`تم تعيين ${response.data.successCount} إجراء بنجاح`);
          }

          return true;
        } else {
          throw new Error(response.message || 'فشل تعيين الإجراءات');
        }
      } catch (err: any) {
        console.error("Error assigning multiple actions:", err);
        toast.error(err.response?.data?.message || "حدث خطأ أثناء تعيين الإجراءات");
        throw err;
      }
    },
    [userData?.token, authLoading, getCurrentUserId]
  );

  /** Update local actions and stage distribution after a request's stage is changed (e.g. from card). No loading, no refetch. */
  const applyStageChangeLocally = useCallback(
    (actionId: string, fromStageId: string, toStageId: string) => {
      setActions((prev) =>
        prev.map((a) =>
          a.id === actionId ? { ...a, stage_id: toStageId } : a
        )
      );
      setStages((prev) => {
        if (!prev || prev.length === 0) return prev;
        const fromStage = prev.find((s) => s.stage_id === fromStageId);
        const toStage = prev.find((s) => s.stage_id === toStageId);
        if (!fromStage || !toStage) return prev;
        const total = prev.reduce((sum, s) => sum + (s.requestCount ?? 0), 0);
        if (total <= 0) return prev;
        return prev.map((s) => {
          let newCount = s.requestCount ?? 0;
          if (s.stage_id === fromStageId) newCount = Math.max(0, newCount - 1);
          if (s.stage_id === toStageId) newCount = newCount + 1;
          return {
            ...s,
            requestCount: newCount,
            percentage: (newCount / total) * 100,
          };
        });
      });
    },
    []
  );

  // Add bulk change priority function
  const changeMultipleActionsPriority = useCallback(
    async (actionIds: string[], priority: Priority) => {
      if (authLoading || !userData?.token) {
        return false;
      }

      if (actionIds.length === 0) {
        return true;
      }

      try {
        const userId = getCurrentUserId();
        const response = await bulkChangePriority(actionIds, priority, userId);
        
        // Handle success or partial success
        if (response.status === 'success' || response.status === 'partial_success') {
          // Update only successfully changed actions
          setActions((prev) =>
            prev.map((action) =>
              response.data.actionIds.includes(action.id)
                ? { ...action, priority }
                : action
            )
          );

          // Show success message
          if (response.status === 'partial_success') {
            toast.success(
              `تم تغيير أولوية ${response.data.successCount} من ${actionIds.length} إجراء`,
              {
                description: response.data.failedCount > 0 
                  ? `فشل ${response.data.failedCount} إجراء` 
                  : undefined,
              }
            );
          } else {
            toast.success(`تم تغيير أولوية ${response.data.successCount} إجراء بنجاح`);
          }

          return true;
        } else {
          throw new Error(response.message || 'فشل تغيير أولوية الإجراءات');
        }
      } catch (err: any) {
        console.error("Error changing priority for multiple actions:", err);
        toast.error(err.response?.data?.message || "حدث خطأ أثناء تغيير أولوية الإجراءات");
        throw err;
      }
    },
    [userData?.token, authLoading, getCurrentUserId]
  );

  return {
    actions,
    stats,
    stages,
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
    changeMultipleActionsPriority,
    setActions,
    applyStageChangeLocally,
  };
}

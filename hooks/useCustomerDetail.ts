import { useState, useEffect, useCallback } from "react";
import useAuthStore from "@/context/AuthContext";
import { selectUserData, selectIsLoading } from "@/context/auth/selectors";
import {
  getCustomerDetail,
  updateCustomer as apiUpdateCustomer,
  addTaskToCustomer,
  updateTask as apiUpdateTask,
  deleteTask as apiDeleteTask,
  updateCustomerPreferences,
  getCustomerHistory,
  type UpdateCustomerParams,
  type AddTaskParams,
  type UpdateTaskParams,
  type UpdatePreferencesParams,
  type PropertyRequest,
} from "@/lib/services/customers-hub-detail-api";
import {
  assignPropertyToCustomer,
  getCustomerAssignedProperties,
  type AssignPropertyParams,
  type AssignedProperty,
} from "@/lib/services/customer-assigned-properties-api";
import type { UnifiedCustomer } from "@/types/unified-customer";

export function useCustomerDetail(customerId: string) {
  const userData = useAuthStore(selectUserData);
  const authLoading = useAuthStore(selectIsLoading);
  const [customer, setCustomer] = useState<UnifiedCustomer | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [interestedProperties, setInterestedProperties] = useState<any[]>([]);
  const [assignedProperties, setAssignedProperties] = useState<AssignedProperty[]>([]);
  const [propertyRequests, setPropertyRequests] = useState<PropertyRequest[]>([]);
  const [preferences, setPreferences] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch assigned properties from separate endpoint
  const fetchAssignedProperties = useCallback(
    async () => {
      if (authLoading || !userData?.token || !customerId) {
        return;
      }

      try {
        setLoadingProperties(true);
        const response = await getCustomerAssignedProperties(customerId);
        
        if (response.status === "success" && response.data) {
          setAssignedProperties(response.data.properties || []);
        }
      } catch (err: any) {
        console.error("Error fetching assigned properties:", err);
        // Don't set error state, just log it
      } finally {
        setLoadingProperties(false);
      }
    },
    [userData?.token, authLoading, customerId]
  );

  // Fetch customer detail
  const fetchCustomerDetail = useCallback(
    async (includeTasks: boolean = true, includeProperties: boolean = false, includePreferences: boolean = true) => {
      if (authLoading || !userData?.token || !customerId) {
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await getCustomerDetail(customerId, includeTasks, includeProperties, includePreferences);
        
        if (response.status === "success") {
          // Transform customer data to match UnifiedCustomer type
          const transformedCustomer: any = {
            ...response.data.customer,
            id: response.data.customer.id?.toString() || response.data.customer.id,
            assignedEmployeeId: response.data.customer.assignedTo?.id?.toString() || 
                               response.data.customer.assignedTo?.toString(),
            assignedEmployee: response.data.customer.assignedTo ? {
              id: response.data.customer.assignedTo.id?.toString() || response.data.customer.assignedTo.toString(),
              name: response.data.customer.assignedTo.name || "",
              email: response.data.customer.assignedTo.email,
              phone: response.data.customer.assignedTo.phone,
            } : undefined,
            stage: response.data.customer.stage?.name || response.data.customer.stage || "new_lead",
            priority: response.data.customer.priority?.name?.toLowerCase() || response.data.customer.priority || "medium",
            preferences: response.data.preferences || response.data.customer.preferences || {},
            stageHistory: response.data.customer.stageHistory || [],
            properties: [], // Don't use properties from customer detail endpoint
            interactions: response.data.customer.interactions || [],
            appointments: response.data.customer.appointments || [],
            reminders: response.data.customer.reminders || [],
            documents: response.data.customer.documents || [],
            tags: response.data.customer.tags || [],
            aiInsights: response.data.customer.aiInsights || {},
            leadScore: response.data.customer.leadScore || 0,
            source: response.data.customer.source || "manual",
            createdAt: response.data.customer.createdAt || new Date().toISOString(),
            updatedAt: response.data.customer.updatedAt || new Date().toISOString(),
          };
          
          setCustomer(transformedCustomer);
          if (response.data.stats) {
            setStats(response.data.stats);
          }
          if (response.data.tasks) {
            setTasks(response.data.tasks);
          }
          if (response.data.propertyRequests) {
            setPropertyRequests(response.data.propertyRequests);
          }
          if (response.data.preferences) {
            setPreferences(response.data.preferences);
          }
        } else {
          setError(response.message || "Failed to load customer details");
        }
      } catch (err: any) {
        console.error("Error fetching customer detail:", err);
        setError(
          err.response?.data?.message || "An error occurred while loading customer details"
        );
      } finally {
        setLoading(false);
      }
    },
    [userData?.token, authLoading, customerId]
  );

  // Fetch customer history
  const fetchHistory = useCallback(
    async (limit: number = 50, offset: number = 0) => {
      if (authLoading || !userData?.token || !customerId) {
        return;
      }

      try {
        const response = await getCustomerHistory(customerId, limit, offset);
        if (response.status === "success") {
          setHistory(response.data.history);
        }
      } catch (err: any) {
        console.error("Error fetching customer history:", err);
      }
    },
    [userData?.token, authLoading, customerId]
  );

  // Update customer
  const updateCustomer = useCallback(
    async (params: UpdateCustomerParams) => {
      if (authLoading || !userData?.token || !customerId) {
        return false;
      }

      try {
        await apiUpdateCustomer(customerId, params);
        // Refresh customer detail
        await fetchCustomerDetail();
        return true;
      } catch (err: any) {
        console.error("Error updating customer:", err);
        throw err;
      }
    },
    [userData?.token, authLoading, customerId, fetchCustomerDetail]
  );

  // Add task
  const addTask = useCallback(
    async (params: AddTaskParams) => {
      if (authLoading || !userData?.token || !customerId) {
        return false;
      }

      try {
        await addTaskToCustomer(customerId, params);
        // Refresh customer detail
        await fetchCustomerDetail();
        return true;
      } catch (err: any) {
        console.error("Error adding task:", err);
        throw err;
      }
    },
    [userData?.token, authLoading, customerId, fetchCustomerDetail]
  );

  // Update task
  const updateTask = useCallback(
    async (taskId: string, params: UpdateTaskParams) => {
      if (authLoading || !userData?.token || !customerId) {
        return false;
      }

      try {
        await apiUpdateTask(customerId, taskId, params);
        // Refresh customer detail
        await fetchCustomerDetail();
        return true;
      } catch (err: any) {
        console.error("Error updating task:", err);
        throw err;
      }
    },
    [userData?.token, authLoading, customerId, fetchCustomerDetail]
  );

  // Delete task
  const deleteTask = useCallback(
    async (taskId: string) => {
      if (authLoading || !userData?.token || !customerId) {
        return false;
      }

      try {
        await apiDeleteTask(customerId, taskId);
        // Refresh customer detail
        await fetchCustomerDetail();
        return true;
      } catch (err: any) {
        console.error("Error deleting task:", err);
        throw err;
      }
    },
    [userData?.token, authLoading, customerId, fetchCustomerDetail]
  );

  // Update preferences
  const updatePreferences = useCallback(
    async (params: UpdatePreferencesParams) => {
      if (authLoading || !userData?.token || !customerId) {
        return false;
      }

      try {
        await updateCustomerPreferences(customerId, params);
        // Refresh customer detail
        await fetchCustomerDetail();
        return true;
      } catch (err: any) {
        console.error("Error updating preferences:", err);
        throw err;
      }
    },
    [userData?.token, authLoading, customerId, fetchCustomerDetail]
  );

  // Assign property to customer
  const assignProperty = useCallback(
    async (params: AssignPropertyParams) => {
      if (authLoading || !userData?.token || !customerId) {
        return false;
      }

      try {
        const response = await assignPropertyToCustomer(customerId, params);
        if (response.status === "success") {
          // Refresh assigned properties from separate endpoint
          await fetchAssignedProperties();
          return true;
        }
        return false;
      } catch (err: any) {
        console.error("Error assigning property:", err);
        throw err;
      }
    },
    [userData?.token, authLoading, customerId, fetchAssignedProperties]
  );

  // Refetch properties only
  const refetchProperties = useCallback(
    async () => {
      if (authLoading || !userData?.token || !customerId) {
        return;
      }

      try {
        // Refresh assigned properties from separate endpoint
        await fetchAssignedProperties();
      } catch (err: any) {
        console.error("Error refetching properties:", err);
      }
    },
    [userData?.token, authLoading, customerId, fetchAssignedProperties]
  );

  // Initial fetch
  useEffect(() => {
    if (authLoading || !userData?.token || !customerId) {
      return;
    }

    const loadData = async () => {
      await Promise.all([
        fetchCustomerDetail(),
        fetchHistory(),
        fetchAssignedProperties(),
      ]);
    };

    loadData();
  }, [userData?.token, authLoading, customerId, fetchCustomerDetail, fetchHistory, fetchAssignedProperties]);

  return {
    customer,
    stats,
    tasks,
    interestedProperties,
    assignedProperties,
    propertyRequests,
    preferences,
    history,
    loading,
    loadingProperties,
    error,
    refetch: fetchCustomerDetail,
    updateCustomer,
    addTask,
    updateTask,
    deleteTask,
    updatePreferences,
    fetchHistory,
    assignProperty,
    refetchProperties,
    fetchAssignedProperties,
  };
}

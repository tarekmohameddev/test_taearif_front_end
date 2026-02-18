import { useState, useEffect, useCallback } from "react";
import useAuthStore from "@/context/AuthContext";
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
} from "@/lib/services/customers-hub-detail-api";
import {
  assignPropertyToCustomer,
  getCustomerAssignedProperties,
  type AssignPropertyParams,
} from "@/lib/services/customer-assigned-properties-api";
import type { UnifiedCustomer } from "@/types/unified-customer";

export function useCustomerDetail(customerId: string) {
  const { userData, IsLoading: authLoading } = useAuthStore();
  const [customer, setCustomer] = useState<UnifiedCustomer | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [interestedProperties, setInterestedProperties] = useState<any[]>([]);
  const [preferences, setPreferences] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch customer detail
  const fetchCustomerDetail = useCallback(
    async (includeTasks: boolean = true, includeProperties: boolean = true, includePreferences: boolean = true) => {
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
            properties: response.data.interestedProperties || response.data.customer.properties || [],
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
          if (response.data.interestedProperties) {
            setInterestedProperties(response.data.interestedProperties);
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
          // Refresh customer detail with properties
          await fetchCustomerDetail(true, true, true);
          return true;
        }
        return false;
      } catch (err: any) {
        console.error("Error assigning property:", err);
        throw err;
      }
    },
    [userData?.token, authLoading, customerId, fetchCustomerDetail]
  );

  // Refetch properties only
  const refetchProperties = useCallback(
    async () => {
      if (authLoading || !userData?.token || !customerId) {
        return;
      }

      try {
        // Refresh customer detail with properties included
        await fetchCustomerDetail(true, true, true);
      } catch (err: any) {
        console.error("Error refetching properties:", err);
      }
    },
    [userData?.token, authLoading, customerId, fetchCustomerDetail]
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
      ]);
    };

    loadData();
  }, [userData?.token, authLoading, customerId, fetchCustomerDetail, fetchHistory]);

  return {
    customer,
    stats,
    tasks,
    interestedProperties,
    preferences,
    history,
    loading,
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
  };
}

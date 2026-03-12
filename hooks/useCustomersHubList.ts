import { useState, useEffect, useCallback } from "react";
import useAuthStore from "@/context/AuthContext";
import { selectUserData, selectIsLoading } from "@/context/auth/selectors";
import {
  getCustomersList,
  getListFilterOptions,
  getListStats,
  type CustomersListParams,
  type FilterOptionsResponse,
  type StatsResponse,
} from "@/lib/services/customers-hub-list-api";
import type { UnifiedCustomer } from "@/types/unified-customer";

export function useCustomersHubList() {
  const userData = useAuthStore(selectUserData);
  const authLoading = useAuthStore(selectIsLoading);
  const [customers, setCustomers] = useState<UnifiedCustomer[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptionsResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 50,
  });

  // Fetch customers list
  const fetchCustomers = useCallback(
    async (params: CustomersListParams) => {
      if (authLoading || !userData?.token) {
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await getCustomersList(params);
        
        if (response.status === "success") {
          // Transform customers data to match UnifiedCustomer type
          const transformedCustomers = response.data.customers.map((customer: any) => ({
            ...customer,
            id: customer.id?.toString() || customer.id,
            assignedEmployeeId: (customer.assignedTo?.id != null && String(customer.assignedTo?.name ?? "").trim())
              ? (customer.assignedTo.id?.toString() ?? customer.assignedTo?.toString())
              : undefined,
            assignedEmployee: (customer.assignedTo?.id != null && String(customer.assignedTo?.name ?? "").trim())
              ? {
                  id: customer.assignedTo.id?.toString() || String(customer.assignedTo.id),
                  name: String(customer.assignedTo.name ?? "").trim(),
                  email: customer.assignedTo.email,
                  phone: customer.assignedTo.phone,
                }
              : undefined,
            // Use stage_id (string) from API; when stage is object with id: null → "no_stage" (بدون مرحلة)
            stage: (typeof customer.stage === "object" && customer.stage !== null && (customer.stage as any).id == null)
              ? "no_stage"
              : (customer.stage?.id ?? (customer.stage as any)?.stage_id ?? (typeof customer.stage === "string" ? customer.stage : null)) || "new_lead",
            priority: customer.priority?.name?.toLowerCase() || customer.priority || "medium",
            preferences: customer.preferences || {},
            stageHistory: customer.stageHistory || [],
            properties: customer.properties || [],
            interactions: customer.interactions || [],
            appointments: customer.appointments || [],
            reminders: customer.reminders || [],
            documents: customer.documents || [],
            tags: customer.tags || [],
            aiInsights: customer.aiInsights || {},
            leadScore: customer.leadScore || 0,
            source: customer.source || "manual",
            totalPropertyRequests: customer.totalPropertyRequests ?? customer.propertyRequestsCount ?? 0,
            lastPropertyRequest: customer.lastPropertyRequest ?? undefined,
            createdAt: customer.createdAt || new Date().toISOString(),
            updatedAt: customer.updatedAt || new Date().toISOString(),
          }));
          
          setCustomers(transformedCustomers);
          if (response.data.stats) {
            setStats(response.data.stats);
          }
          if (response.data.pagination) {
            setPagination(response.data.pagination);
          }
        } else {
          setError(response.message || "Failed to load customers");
        }
      } catch (err: any) {
        console.error("Error fetching customers:", err);
        setError(
          err.response?.data?.message || "An error occurred while loading customers"
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
      const response = await getListFilterOptions();
      if (response.status === "success") {
        setFilterOptions(response.data);
      }
    } catch (err: any) {
      console.error("Error fetching filter options:", err);
    }
  }, [userData?.token, authLoading]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    if (authLoading || !userData?.token) {
      return;
    }

    try {
      const response = await getListStats();
      if (response.status === "success") {
        setStats(response.data.stats);
      }
    } catch (err: any) {
      console.error("Error fetching stats:", err);
    }
  }, [userData?.token, authLoading]);

  return {
    customers,
    stats,
    filterOptions,
    loading,
    error,
    pagination,
    fetchCustomers,
    fetchFilterOptions,
    fetchStats,
    setCustomers,
  };
}

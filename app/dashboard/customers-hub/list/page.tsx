"use client";

import React, { useEffect, useState } from "react";
import { EnhancedCustomersHubPage } from "@/components/customers-hub/page/EnhancedCustomersHubPage";
import { useCustomersHubList } from "@/hooks/useCustomersHubList";
import useAuthStore from "@/context/AuthContext";
import type { CustomersListParams } from "@/lib/services/customers-hub-list-api";

export default function CustomersListPage() {
  const { userData, IsLoading: authLoading } = useAuthStore();
  const {
    customers,
    stats,
    filterOptions,
    loading,
    error,
    pagination,
    fetchCustomers,
    fetchFilterOptions,
    fetchStats,
  } = useCustomersHubList();

  const [initialLoad, setInitialLoad] = useState(false);

  // Fetch initial data when token is ready
  useEffect(() => {
    // Wait until token is fetched
    if (authLoading || !userData?.token) {
      return;
    }

    if (initialLoad) {
      return;
    }

    const loadInitialData = async () => {
      try {
        // Fetch filter options first
        await fetchFilterOptions();

        // Fetch stats
        await fetchStats();

        // Fetch customers list with default params
        const params: CustomersListParams = {
          action: "list",
          includeStats: true,
          pagination: {
            page: 1,
            limit: 50,
          },
          sorting: {
            field: "created_at",
            order: "desc",
          },
        };

        await fetchCustomers(params);
        setInitialLoad(true);
      } catch (err) {
        console.error("Error loading initial data:", err);
      }
    };

    loadInitialData();
  }, [userData?.token, authLoading, fetchCustomers, fetchFilterOptions, fetchStats, initialLoad]);

  return (
    <EnhancedCustomersHubPage
      customers={customers}
      stats={stats}
      filterOptions={filterOptions}
      loading={loading}
      error={error}
      pagination={pagination}
      onFetchCustomers={fetchCustomers}
    />
  );
}

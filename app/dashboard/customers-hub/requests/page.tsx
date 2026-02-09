"use client";

import React, { useEffect, useState } from "react";
import { RequestsCenterPage } from "@/components/customers-hub/requests/RequestsCenterPage";
import { useCustomersHubRequests } from "@/hooks/useCustomersHubRequests";
import useAuthStore from "@/context/AuthContext";
import type { RequestsListFilters } from "@/lib/services/customers-hub-requests-api";

export default function CustomersHubRequestsPage() {
  const { userData, IsLoading: authLoading } = useAuthStore();
  const {
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
  } = useCustomersHubRequests();

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

        // Fetch requests list with default params (flat structure)
        const params: RequestsListFilters = {
          tab: "all",
          limit: 50,
          offset: 0,
          sort_by: "createdAt",
          sort_dir: "desc",
        };

        await fetchRequests(params);
        setInitialLoad(true);
      } catch (err) {
        console.error("Error loading initial data:", err);
      }
    };

    loadInitialData();
  }, [userData?.token, authLoading, fetchRequests, fetchFilterOptions, initialLoad]);

  return (
    <RequestsCenterPage
      actions={actions}
      stats={stats}
      stages={stages}
      filterOptions={filterOptions}
      loading={loading}
      error={error}
      pagination={pagination}
      onFetchRequests={fetchRequests}
      onCompleteAction={completeAction}
      onDismissAction={dismissAction}
      onSnoozeAction={snoozeAction}
      onAssignAction={assignAction}
      onCompleteMultipleActions={completeMultipleActions}
      onDismissMultipleActions={dismissMultipleActions}
      onSnoozeMultipleActions={snoozeMultipleActions}
      onAssignMultipleActions={assignMultipleActions}
      onChangeMultipleActionsPriority={changeMultipleActionsPriority}
    />
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { RequestsCenterPage } from "@/components/customers-hub/requests/RequestsCenterPage";
import { useCustomersHubRequests } from "@/hooks/useCustomersHubRequests";
import useAuthStore from "@/context/AuthContext";
import type { RequestsListParams } from "@/lib/services/customers-hub-requests-api";

export default function CustomersHubRequestsPage() {
  const { userData, IsLoading: authLoading } = useAuthStore();
  const {
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

        // Fetch requests list with default params
        const params: RequestsListParams = {
          action: "list",
          includeStats: true,
          pagination: {
            page: 1,
            limit: 50,
          },
          sorting: {
            field: "dueDate",
            order: "asc",
          },
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

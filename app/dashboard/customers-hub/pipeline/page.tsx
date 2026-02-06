"use client";

import React, { useEffect, useState } from "react";
import { PipelinePage } from "@/components/customers-hub/pipeline/PipelinePage";
import { useCustomersHubPipeline } from "@/hooks/useCustomersHubPipeline";
import useAuthStore from "@/context/AuthContext";
import type { PipelineBoardParams } from "@/lib/services/customers-hub-pipeline-api";

export default function CustomersHubPipelinePage() {
  const { userData, IsLoading: authLoading } = useAuthStore();
  const {
    stages,
    analytics,
    filterOptions,
    loading,
    error,
    fetchPipelineBoard,
    fetchFilterOptions,
    moveCustomer,
  } = useCustomersHubPipeline();

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

        // Fetch pipeline board with default params
        const params: PipelineBoardParams = {
          action: "board",
          includeAnalytics: true,
        };

        await fetchPipelineBoard(params);
        setInitialLoad(true);
      } catch (err) {
        console.error("Error loading initial data:", err);
      }
    };

    loadInitialData();
  }, [userData?.token, authLoading, fetchPipelineBoard, fetchFilterOptions, initialLoad]);

  return (
    <PipelinePage
      stages={stages}
      analytics={analytics}
      filterOptions={filterOptions}
      loading={loading}
      error={error}
      onFetchPipelineBoard={fetchPipelineBoard}
      onMoveCustomer={moveCustomer}
    />
  );
}

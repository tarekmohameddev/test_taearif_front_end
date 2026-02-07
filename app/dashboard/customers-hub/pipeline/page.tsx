"use client";

import React, { useEffect, useState } from "react";
import { PipelinePage } from "@/components/customers-hub/pipeline/PipelinePage";
import { useCustomersHubPipeline } from "@/hooks/useCustomersHubPipeline";
import { useCustomersHubStagesStore } from "@/context/store/customers-hub-stages";
import useAuthStore from "@/context/AuthContext";
import type { PipelineBoardParams } from "@/lib/services/customers-hub-pipeline-api";

export default function CustomersHubPipelinePage() {
  const { userData, IsLoading: authLoading } = useAuthStore();
  const {
    stages,
    analytics,
    filterOptions,
    totalCustomers,
    loading,
    error,
    fetchPipelineBoard,
    fetchFilterOptions,
    moveCustomer,
    bulkMoveCustomers,
  } = useCustomersHubPipeline();
  
  // Fetch stages from API stages
  const { stages: apiStages, fetchStages: fetchApiStages, loading: stagesLoading } = useCustomersHubStagesStore();

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
        // Fetch stages from API stages first (for boards display)
        await fetchApiStages(true); // active_only = true
        
        // Fetch filter options
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
  }, [userData?.token, authLoading, fetchPipelineBoard, fetchFilterOptions, fetchApiStages, initialLoad]);

  return (
    <PipelinePage
      stages={stages}
      apiStages={apiStages}
      analytics={analytics}
      filterOptions={filterOptions}
      totalCustomers={totalCustomers}
      loading={loading || stagesLoading}
      error={error}
      onFetchPipelineBoard={fetchPipelineBoard}
      onMoveCustomer={moveCustomer}
    />
  );
}

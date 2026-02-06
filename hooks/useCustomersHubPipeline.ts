import { useState, useEffect, useCallback } from "react";
import useAuthStore from "@/context/AuthContext";
import {
  getPipelineBoard,
  getPipelineFilterOptions,
  moveCustomerInPipeline,
  type PipelineBoardParams,
  type FilterOptionsResponse,
  type PipelineStage,
  type PipelineAnalytics,
  type MoveCustomerParams,
} from "@/lib/services/customers-hub-pipeline-api";

export function useCustomersHubPipeline() {
  const { userData, IsLoading: authLoading } = useAuthStore();
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [analytics, setAnalytics] = useState<PipelineAnalytics | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptionsResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch pipeline board
  const fetchPipelineBoard = useCallback(
    async (params: PipelineBoardParams) => {
      if (authLoading || !userData?.token) {
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await getPipelineBoard(params);
        
        if (response.status === "success") {
          // Transform stages and customers data
          const transformedStages = response.data.stages.map((stage) => ({
            ...stage,
            customers: stage.customers.map((customer: any) => ({
              ...customer,
              id: customer.id?.toString() || customer.id,
              assignedEmployeeId: customer.assignedTo?.id?.toString() || customer.assignedTo?.toString(),
              assignedEmployee: customer.assignedTo ? {
                id: customer.assignedTo.id?.toString() || customer.assignedTo.toString(),
                name: customer.assignedTo.name || "",
                email: customer.assignedTo.email,
                phone: customer.assignedTo.phone,
              } : undefined,
              stage: customer.stage?.name || customer.stage || "new_lead",
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
              createdAt: customer.createdAt || new Date().toISOString(),
              updatedAt: customer.updatedAt || new Date().toISOString(),
            })),
          }));
          
          setStages(transformedStages);
          if (response.data.analytics) {
            setAnalytics(response.data.analytics);
          }
        } else {
          setError(response.message || "Failed to load pipeline");
        }
      } catch (err: any) {
        console.error("Error fetching pipeline:", err);
        setError(
          err.response?.data?.message || "An error occurred while loading pipeline"
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
      const response = await getPipelineFilterOptions();
      if (response.status === "success") {
        setFilterOptions(response.data);
      }
    } catch (err: any) {
      console.error("Error fetching filter options:", err);
    }
  }, [userData?.token, authLoading]);

  // Move customer in pipeline
  const moveCustomer = useCallback(
    async (params: MoveCustomerParams) => {
      if (authLoading || !userData?.token) {
        return false;
      }

      try {
        await moveCustomerInPipeline(params);
        // Refresh pipeline board after move
        await fetchPipelineBoard({
          action: "board",
          includeAnalytics: true,
        });
        return true;
      } catch (err: any) {
        console.error("Error moving customer:", err);
        throw err;
      }
    },
    [userData?.token, authLoading, fetchPipelineBoard]
  );

  return {
    stages,
    analytics,
    filterOptions,
    loading,
    error,
    fetchPipelineBoard,
    fetchFilterOptions,
    moveCustomer,
    setStages,
  };
}

import { useState, useEffect, useCallback } from "react";
import useAuthStore from "@/context/AuthContext";
import {
  getPipelineBoard,
  getPipelineFilterOptions,
  moveCustomerInPipeline,
  bulkMoveCustomersInPipeline,
  type PipelineBoardParams,
  type FilterOptionsResponse,
  type PipelineStage,
  type PipelineAnalytics,
  type MoveCustomerParams,
  type BulkMoveParams,
} from "@/lib/services/customers-hub-pipeline-api";

export function useCustomersHubPipeline() {
  const { userData, IsLoading: authLoading } = useAuthStore();
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [analytics, setAnalytics] = useState<PipelineAnalytics | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptionsResponse["data"] | null>(null);
  const [totalCustomers, setTotalCustomers] = useState<number>(0);
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
          const transformedStages = response.data.stages.map((stage: any) => ({
            ...stage,
            // Ensure both id and stage_id are integers (from API)
            id: typeof stage.id === 'number' ? stage.id : parseInt(stage.id) || stage.id,
            stage_id: typeof stage.stage_id === 'number' ? stage.stage_id : (stage.stage_id || stage.id),
            // Convert API's 'count' to 'customerCount' for compatibility
            customerCount: stage.count ?? stage.customerCount ?? 0,
            // Map stage names
            name: stage.name || stage.nameAr || "",
            nameAr: stage.name || stage.nameAr || "",
            nameEn: stage.nameEn || stage.nameEn || "",
            customers: stage.customers.map((customer: any) => ({
              ...customer,
              // Keep customer id as is (property request id)
              id: typeof customer.id === 'number' ? customer.id : parseInt(customer.id) || customer.id,
              // Handle assignedEmployee (from API response)
              assignedEmployeeId: customer.assignedEmployee?.id 
                ? (typeof customer.assignedEmployee.id === 'number' 
                    ? customer.assignedEmployee.id 
                    : parseInt(customer.assignedEmployee.id))
                : undefined,
              assignedEmployee: customer.assignedEmployee || customer.assignedTo ? {
                id: customer.assignedEmployee?.id || customer.assignedTo?.id || "",
                name: customer.assignedEmployee?.name || customer.assignedTo?.name || "",
                email: customer.assignedEmployee?.email || customer.assignedTo?.email,
                phone: customer.assignedEmployee?.phone || customer.assignedTo?.phone,
              } : undefined,
              // Handle priority (from API response)
              priority: customer.priority?.name?.toLowerCase() 
                || customer.priority?.id?.toLowerCase() 
                || customer.priority 
                || "medium",
              // Handle propertyType (from API response - can be array or single value)
              propertyType: customer.propertyType || customer.preferences?.propertyType || [],
              preferences: {
                ...customer.preferences,
                propertyType: customer.propertyType || customer.preferences?.propertyType || [],
              },
              // Use totalDealValue from API or fallback
              totalDealValue: customer.totalDealValue || customer.preferences?.budgetMax || customer.budgetMax || undefined,
              // Additional fields for compatibility
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
              createdAt: customer.createdAt || customer.lastContactAt || new Date().toISOString(),
              updatedAt: customer.updatedAt || new Date().toISOString(),
              lastContactAt: customer.lastContactAt || customer.createdAt || new Date().toISOString(),
            })),
          }));
          
          setStages(transformedStages);
          if (response.data.totalCustomers !== undefined) {
            setTotalCustomers(response.data.totalCustomers);
          }
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
        // Ensure requestId (preferred) or customerId (backward compatibility) and newStageId are integers
        const moveParams: MoveCustomerParams = {
          requestId: params.requestId !== undefined
            ? (typeof params.requestId === "number" 
                ? params.requestId 
                : parseInt(params.requestId.toString()))
            : (params.customerId !== undefined
                ? (typeof params.customerId === "number"
                    ? params.customerId
                    : parseInt(params.customerId.toString()))
                : undefined),
          customerId: params.requestId === undefined && params.customerId !== undefined
            ? (typeof params.customerId === "number"
                ? params.customerId
                : parseInt(params.customerId.toString()))
            : undefined,
          newStageId: typeof params.newStageId === "number" 
            ? params.newStageId 
            : parseInt(params.newStageId.toString()),
          notes: params.notes,
        };
        
        await moveCustomerInPipeline(moveParams);
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

  // Bulk move customers in pipeline
  const bulkMoveCustomers = useCallback(
    async (params: BulkMoveParams) => {
      if (authLoading || !userData?.token) {
        return false;
      }

      try {
        // Ensure all IDs are integers - prefer requestIds, fallback to customerIds for backward compatibility
        const bulkMoveParams: BulkMoveParams = {
          requestIds: params.requestIds !== undefined
            ? params.requestIds.map(id => 
                typeof id === "number" ? id : parseInt(id.toString())
              )
            : (params.customerIds !== undefined
                ? params.customerIds.map(id => 
                    typeof id === "number" ? id : parseInt(id.toString())
                  )
                : undefined),
          customerIds: params.requestIds === undefined && params.customerIds !== undefined
            ? params.customerIds.map(id => 
                typeof id === "number" ? id : parseInt(id.toString())
              )
            : undefined,
          newStageId: typeof params.newStageId === "number" 
            ? params.newStageId 
            : parseInt(params.newStageId.toString()),
        };
        
        const response = await bulkMoveCustomersInPipeline(bulkMoveParams);
        // Refresh pipeline board after bulk move
        await fetchPipelineBoard({
          action: "board",
          includeAnalytics: true,
        });
        return response.data.updated;
      } catch (err: any) {
        console.error("Error bulk moving customers:", err);
        throw err;
      }
    },
    [userData?.token, authLoading, fetchPipelineBoard]
  );

  return {
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
    setStages,
  };
}

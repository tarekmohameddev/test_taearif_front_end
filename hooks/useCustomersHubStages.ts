import { useState, useEffect, useCallback } from "react";
import useAuthStore from "@/context/AuthContext";
import {
  getStages,
  createStage,
  updateStage,
  deleteStage,
  type Stage,
  type GetStagesParams,
  type CreateStageParams,
  type UpdateStageParams,
} from "@/lib/services/customers-hub-stages-api";

export function useCustomersHubStages(activeOnly: boolean = false, skip: boolean = false) {
  const { userData, IsLoading: authLoading } = useAuthStore();
  const [stages, setStages] = useState<Stage[]>([]);
  const [loading, setLoading] = useState(skip ? false : true);
  const [error, setError] = useState<string | null>(null);

  // Fetch stages
  const fetchStages = useCallback(
    async (params?: GetStagesParams) => {
      if (authLoading || !userData?.token) {
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await getStages({
          active_only: activeOnly,
          order_by: "order",
          ...params,
        });

        if (response.status === "success") {
          // Sort by order to ensure consistent ordering
          const sortedStages = [...response.data.stages].sort(
            (a, b) => a.order - b.order
          );
          setStages(sortedStages);
        } else {
          setError(response.message || "Failed to load stages");
        }
      } catch (err: any) {
        console.error("Error fetching stages:", err);
        setError(
          err.response?.data?.message || "An error occurred while loading stages"
        );
      } finally {
        setLoading(false);
      }
    },
    [userData?.token, authLoading, activeOnly]
  );

  // Create a new stage
  const createNewStage = useCallback(
    async (params: CreateStageParams) => {
      if (authLoading || !userData?.token) {
        throw new Error("Not authenticated");
      }

      try {
        const response = await createStage(params);
        if (response.status === "success") {
          // Refresh stages list
          await fetchStages();
          return response.data;
        } else {
          throw new Error(response.message || "Failed to create stage");
        }
      } catch (err: any) {
        console.error("Error creating stage:", err);
        throw err;
      }
    },
    [userData?.token, authLoading, fetchStages]
  );

  // Update an existing stage
  const updateExistingStage = useCallback(
    async (stageId: string, params: UpdateStageParams) => {
      if (authLoading || !userData?.token) {
        throw new Error("Not authenticated");
      }

      try {
        const response = await updateStage(stageId, params);
        if (response.status === "success") {
          // Refresh stages list
          await fetchStages();
          return response.data;
        } else {
          throw new Error(response.message || "Failed to update stage");
        }
      } catch (err: any) {
        console.error("Error updating stage:", err);
        throw err;
      }
    },
    [userData?.token, authLoading, fetchStages]
  );

  // Delete a stage
  const deleteExistingStage = useCallback(
    async (stageId: string) => {
      if (authLoading || !userData?.token) {
        throw new Error("Not authenticated");
      }

      try {
        const response = await deleteStage(stageId);
        if (response.status === "success") {
          // Refresh stages list
          await fetchStages();
          return true;
        } else {
          // Check if it's a conflict error (stage in use)
          if (response.code === 409) {
            throw new Error(
              response.data?.requests_count
                ? `Cannot delete stage: ${response.data.requests_count} customers are using this stage`
                : response.message || "Cannot delete stage: stage is in use"
            );
          }
          throw new Error(response.message || "Failed to delete stage");
        }
      } catch (err: any) {
        console.error("Error deleting stage:", err);
        throw err;
      }
    },
    [userData?.token, authLoading, fetchStages]
  );

  // Fetch stages on mount (skip if skip is true)
  useEffect(() => {
    if (!skip) {
      fetchStages();
    }
  }, [fetchStages, skip]);

  return {
    stages,
    loading,
    error,
    fetchStages,
    createStage: createNewStage,
    updateStage: updateExistingStage,
    deleteStage: deleteExistingStage,
    refetch: fetchStages,
  };
}

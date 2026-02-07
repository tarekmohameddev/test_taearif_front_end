import { create } from "zustand";
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

interface CustomersHubStagesStore {
  // State
  stages: Stage[];
  loading: boolean;
  error: string | null;
  hasLoaded: boolean;
  activeOnly: boolean;

  // Actions
  fetchStages: (activeOnly?: boolean) => Promise<void>;
  createStage: (params: CreateStageParams) => Promise<Stage>;
  updateStage: (stageId: string, params: UpdateStageParams) => Promise<Stage>;
  deleteStage: (stageId: string) => Promise<boolean>;
  reset: () => void;
}

export const useCustomersHubStagesStore = create<CustomersHubStagesStore>((set, get) => ({
  // Initial state
  stages: [],
  loading: false,
  error: null,
  hasLoaded: false,
  activeOnly: true,

  // Fetch stages - only fetch once, prevent spam requests
  fetchStages: async (activeOnly: boolean = true) => {
    const { userData, IsLoading: authLoading } = useAuthStore.getState();
    
    // Check authentication
    if (authLoading || !userData?.token) {
      return;
    }

    // Prevent multiple simultaneous requests
    if (get().loading) {
      return;
    }

    // If already loaded with same activeOnly filter and stages exist, don't fetch again
    // But allow retry if previous fetch failed (error exists) or stages are empty
    const currentState = get();
    if (
      currentState.hasLoaded &&
      currentState.activeOnly === activeOnly &&
      currentState.stages.length > 0 &&
      !currentState.error
    ) {
      return;
    }

    set({ loading: true, error: null, activeOnly });

    try {
      const response = await getStages({
        active_only: activeOnly,
        order_by: "order",
      });

      if (response.status === "success") {
        // Sort by order to ensure consistent ordering
        const sortedStages = [...response.data.stages].sort(
          (a, b) => a.order - b.order
        );
        set({
          stages: sortedStages,
          loading: false,
          hasLoaded: true,
        });
      } else {
        set({
          error: response.message || "Failed to load stages",
          loading: false,
        });
      }
    } catch (err: any) {
      console.error("Error fetching stages:", err);
      set({
        error: err.response?.data?.message || "An error occurred while loading stages",
        loading: false,
      });
    }
  },

  // Create a new stage
  createStage: async (params: CreateStageParams) => {
    const { userData, IsLoading: authLoading } = useAuthStore.getState();
    
    if (authLoading || !userData?.token) {
      throw new Error("Not authenticated");
    }

    try {
      const response = await createStage(params);
      if (response.status === "success") {
        // Refresh stages list after creation
        await get().fetchStages(get().activeOnly);
        return response.data;
      } else {
        throw new Error(response.message || "Failed to create stage");
      }
    } catch (err: any) {
      console.error("Error creating stage:", err);
      throw err;
    }
  },

  // Update an existing stage
  updateStage: async (stageId: string, params: UpdateStageParams) => {
    const { userData, IsLoading: authLoading } = useAuthStore.getState();
    
    if (authLoading || !userData?.token) {
      throw new Error("Not authenticated");
    }

    try {
      const response = await updateStage(stageId, params);
      if (response.status === "success") {
        // Refresh stages list after update
        await get().fetchStages(get().activeOnly);
        return response.data;
      } else {
        throw new Error(response.message || "Failed to update stage");
      }
    } catch (err: any) {
      console.error("Error updating stage:", err);
      throw err;
    }
  },

  // Delete a stage
  deleteStage: async (stageId: string) => {
    const { userData, IsLoading: authLoading } = useAuthStore.getState();
    
    if (authLoading || !userData?.token) {
      throw new Error("Not authenticated");
    }

    try {
      const response = await deleteStage(stageId);
      if (response.status === "success") {
        // Refresh stages list after deletion
        await get().fetchStages(get().activeOnly);
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

  // Reset store (useful for logout or token change)
  reset: () => {
    set({
      stages: [],
      loading: false,
      error: null,
      hasLoaded: false,
      activeOnly: true,
    });
  },
}));

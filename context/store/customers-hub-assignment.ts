import { create } from "zustand";
import {
  getEmployees,
  getUnassignedCount,
  autoAssignCustomers,
  manualAssignCustomers,
  saveAssignmentRules,
  getAssignmentRules,
  type EmployeeWorkload,
  type EmployeeConfig,
  type AutoAssignParams,
  type ManualAssignParams,
  type SaveRulesParams,
} from "@/lib/services/customers-hub-assignment-api";

interface CustomersHubAssignmentStore {
  // State
  employees: EmployeeWorkload[];
  rules: EmployeeConfig[];
  unassignedCount: number;
  loading: boolean;
  error: string | null;
  hasLoaded: boolean;
  // Loading flags for individual fetches
  fetchingUnassignedCount: boolean;
  fetchingRules: boolean;

  // Actions
  fetchEmployees: () => Promise<void>;
  fetchUnassignedCount: () => Promise<void>;
  fetchRules: () => Promise<void>;
  handleAutoAssign: (params: AutoAssignParams) => Promise<boolean>;
  handleManualAssign: (params: ManualAssignParams) => Promise<boolean>;
  handleSaveRules: (params: SaveRulesParams) => Promise<boolean>;
  reset: () => void;
}

export const useCustomersHubAssignmentStore = create<CustomersHubAssignmentStore>((set, get) => ({
  // Initial state
  employees: [],
  rules: [],
  unassignedCount: 0,
  loading: false,
  error: null,
  hasLoaded: false,
  fetchingUnassignedCount: false,
  fetchingRules: false,

  // Fetch employees - only fetch if not already loaded
  fetchEmployees: async () => {
    // Prevent multiple simultaneous requests
    if (get().loading) {
      return;
    }

    // If already loaded, don't fetch again
    if (get().hasLoaded && get().employees.length > 0) {
      return;
    }

    set({ loading: true, error: null });

    try {
      const response = await getEmployees();
      
      if (response.status === "success") {
        set({
          employees: response.data.employees,
          loading: false,
          hasLoaded: true,
        });
      } else {
        set({
          error: response.message || "Failed to load employees",
          loading: false,
        });
      }
    } catch (err: any) {
      console.error("Error fetching employees:", err);
      set({
        error: err.response?.data?.message || "An error occurred while loading employees",
        loading: false,
      });
    }
  },

  // Fetch unassigned count - with debouncing protection
  fetchUnassignedCount: async () => {
    // Prevent multiple simultaneous requests
    if (get().fetchingUnassignedCount) {
      return;
    }

    set({ fetchingUnassignedCount: true });

    try {
      const response = await getUnassignedCount();
      if (response.status === "success") {
        set({ unassignedCount: response.data.unassignedCount });
      }
    } catch (err: any) {
      console.error("Error fetching unassigned count:", err);
    } finally {
      set({ fetchingUnassignedCount: false });
    }
  },

  // Fetch assignment rules - with debouncing protection
  fetchRules: async () => {
    // Prevent multiple simultaneous requests
    if (get().fetchingRules) {
      return;
    }

    set({ fetchingRules: true });

    try {
      const response = await getAssignmentRules();
      if (response.status === "success") {
        set({ rules: response.data.rules });
      }
    } catch (err: any) {
      console.error("Error fetching rules:", err);
    } finally {
      set({ fetchingRules: false });
    }
  },

  // Auto assign customers
  handleAutoAssign: async (params: AutoAssignParams) => {
    try {
      const response = await autoAssignCustomers(params);
      if (response.status === "success") {
        // Refresh employees and unassigned count after assignment
        await Promise.all([
          get().fetchEmployees(),
          get().fetchUnassignedCount(),
        ]);
        return true;
      }
      return false;
    } catch (err: any) {
      console.error("Error auto assigning customers:", err);
      return false;
    }
  },

  // Manual assign customer
  handleManualAssign: async (params: ManualAssignParams) => {
    try {
      const response = await manualAssignCustomers(params);
      if (response.status === "success") {
        // Refresh employees and unassigned count after assignment
        await Promise.all([
          get().fetchEmployees(),
          get().fetchUnassignedCount(),
        ]);
        return true;
      }
      return false;
    } catch (err: any) {
      console.error("Error manually assigning customer:", err);
      return false;
    }
  },

  // Save assignment rules
  handleSaveRules: async (params: SaveRulesParams) => {
    try {
      const response = await saveAssignmentRules(params);
      if (response.status === "success") {
        // Refresh rules after saving
        await get().fetchRules();
        return true;
      }
      return false;
    } catch (err: any) {
      console.error("Error saving rules:", err);
      return false;
    }
  },

  // Reset store (useful for logout or token change)
  reset: () => {
    set({
      employees: [],
      rules: [],
      unassignedCount: 0,
      loading: false,
      error: null,
      hasLoaded: false,
      fetchingUnassignedCount: false,
      fetchingRules: false,
    });
  },
}));

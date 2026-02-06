import { useEffect } from "react";
import useAuthStore from "@/context/AuthContext";
import { useCustomersHubAssignmentStore } from "@/context/store/customers-hub-assignment";

/**
 * Hook wrapper for CustomersHubAssignmentStore
 * This hook ensures data is loaded once when token is available
 * and provides a consistent API for components
 * 
 * All components using this hook will share the same employees data
 * from the Zustand store, preventing duplicate API calls.
 */
export function useCustomersHubAssignment() {
  const { userData, IsLoading: authLoading } = useAuthStore();
  const store = useCustomersHubAssignmentStore();

  // Initial load - only run once when token is available
  useEffect(() => {
    if (authLoading || !userData?.token) {
      return;
    }

    // Load initial data if not already loaded
    // The store will prevent duplicate requests
    if (!store.hasLoaded) {
      Promise.all([
        store.fetchEmployees(),
        store.fetchUnassignedCount(),
        store.fetchRules(),
      ]);
    }
  }, [userData?.token, authLoading, store.hasLoaded, store.fetchEmployees, store.fetchUnassignedCount, store.fetchRules]);

  // Reset store when token is removed (logout)
  useEffect(() => {
    if (!userData?.token && store.hasLoaded) {
      store.reset();
    }
  }, [userData?.token, store.hasLoaded, store.reset]);

  return {
    employees: store.employees,
    rules: store.rules,
    unassignedCount: store.unassignedCount,
    loading: store.loading,
    error: store.error,
    fetchEmployees: store.fetchEmployees,
    fetchUnassignedCount: store.fetchUnassignedCount,
    fetchRules: store.fetchRules,
    handleAutoAssign: store.handleAutoAssign,
    handleManualAssign: store.handleManualAssign,
    handleSaveRules: store.handleSaveRules,
  };
}

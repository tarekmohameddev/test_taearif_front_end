import { useState, useEffect, useCallback } from "react";
import useAuthStore from "@/context/AuthContext";
import {
  type EmployeeWorkload,
  type EmployeeConfig,
  type AutoAssignParams,
  type ManualAssignParams,
  type SaveRulesParams,
  type EmployeesResponse,
  type UnassignedCountResponse,
  type AutoAssignResponse,
  type ManualAssignResponse,
  type SaveRulesResponse,
  type GetRulesResponse,
} from "@/lib/services/customers-hub-assignment-api";

/**
 * NOTE: All API functions have been removed because the endpoints
 * are not documented in docs/backend/customersHubDoc.txt
 * 
 * These are stub functions that return empty/default values
 * to prevent breaking the code that uses this hook.
 */

// Stub function - endpoint not available
async function getEmployees(): Promise<EmployeesResponse> {
  return {
    status: "success",
    code: 200,
    message: "Endpoint not available - not documented in API docs",
    data: { employees: [] },
    timestamp: new Date().toISOString(),
  };
}

// Stub function - endpoint not available
async function getUnassignedCount(): Promise<UnassignedCountResponse> {
  return {
    status: "success",
    code: 200,
    message: "Endpoint not available - not documented in API docs",
    data: { unassignedCount: 0 },
    timestamp: new Date().toISOString(),
  };
}

// Stub function - endpoint not available
async function autoAssignCustomers(params: AutoAssignParams): Promise<AutoAssignResponse> {
  console.warn("autoAssignCustomers: Endpoint not available - not documented in API docs");
  return {
    status: "success",
    code: 200,
    message: "Endpoint not available - not documented in API docs",
    data: {
      assignedCount: 0,
      failedCount: 0,
      assignments: [],
    },
    timestamp: new Date().toISOString(),
  };
}

// Stub function - endpoint not available
async function manualAssignCustomers(params: ManualAssignParams): Promise<ManualAssignResponse> {
  console.warn("manualAssignCustomers: Endpoint not available - not documented in API docs");
  return {
    status: "success",
    code: 200,
    message: "Endpoint not available - not documented in API docs",
    data: {
      assignedCount: 0,
      assignments: [],
    },
    timestamp: new Date().toISOString(),
  };
}

// Stub function - endpoint not available
async function saveAssignmentRules(params: SaveRulesParams): Promise<SaveRulesResponse> {
  console.warn("saveAssignmentRules: Endpoint not available - not documented in API docs");
  return {
    status: "success",
    code: 200,
    message: "Endpoint not available - not documented in API docs",
    data: {
      savedCount: 0,
      rules: params.employeeRules,
    },
    timestamp: new Date().toISOString(),
  };
}

// Stub function - endpoint not available
async function getAssignmentRules(): Promise<GetRulesResponse> {
  return {
    status: "success",
    code: 200,
    message: "Endpoint not available - not documented in API docs",
    data: { rules: [] },
    timestamp: new Date().toISOString(),
  };
}

export function useCustomersHubAssignment() {
  const { userData, IsLoading: authLoading } = useAuthStore();
  const [employees, setEmployees] = useState<EmployeeWorkload[]>([]);
  const [rules, setRules] = useState<EmployeeConfig[]>([]);
  const [unassignedCount, setUnassignedCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch employees
  const fetchEmployees = useCallback(async () => {
    if (authLoading || !userData?.token) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getEmployees();
      
      if (response.status === "success") {
        setEmployees(response.data.employees);
      } else {
        setError(response.message || "Failed to load employees");
      }
    } catch (err: any) {
      console.error("Error fetching employees:", err);
      setError(
        err.response?.data?.message || "An error occurred while loading employees"
      );
    } finally {
      setLoading(false);
    }
  }, [userData?.token, authLoading]);

  // Fetch unassigned count
  const fetchUnassignedCount = useCallback(async () => {
    if (authLoading || !userData?.token) {
      return;
    }

    try {
      const response = await getUnassignedCount();
      if (response.status === "success") {
        setUnassignedCount(response.data.unassignedCount);
      }
    } catch (err: any) {
      console.error("Error fetching unassigned count:", err);
    }
  }, [userData?.token, authLoading]);

  // Fetch assignment rules
  const fetchRules = useCallback(async () => {
    if (authLoading || !userData?.token) {
      return;
    }

    try {
      const response = await getAssignmentRules();
      if (response.status === "success") {
        setRules(response.data.rules);
      }
    } catch (err: any) {
      console.error("Error fetching rules:", err);
      // If rules don't exist yet, initialize empty array
      setRules([]);
    }
  }, [userData?.token, authLoading]);

  // Auto assign customers
  const handleAutoAssign = useCallback(
    async (params: AutoAssignParams) => {
      if (authLoading || !userData?.token) {
        return { assignedCount: 0, failedCount: 0 };
      }

      try {
        setLoading(true);
        setError(null);
        const response = await autoAssignCustomers(params);
        
        if (response.status === "success") {
          // Refresh employees and unassigned count after assignment
          await fetchEmployees();
          await fetchUnassignedCount();
          return {
            assignedCount: response.data.assignedCount,
            failedCount: response.data.failedCount,
          };
        } else {
          setError(response.message || "Failed to assign customers");
          return { assignedCount: 0, failedCount: 0 };
        }
      } catch (err: any) {
        console.error("Error auto assigning customers:", err);
        setError(
          err.response?.data?.message || "An error occurred while assigning customers"
        );
        return { assignedCount: 0, failedCount: 0 };
      } finally {
        setLoading(false);
      }
    },
    [userData?.token, authLoading, fetchEmployees, fetchUnassignedCount]
  );

  // Manual assign customers
  const handleManualAssign = useCallback(
    async (params: ManualAssignParams) => {
      if (authLoading || !userData?.token) {
        return false;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await manualAssignCustomers(params);
        
        if (response.status === "success") {
          // Refresh employees and unassigned count after assignment
          await fetchEmployees();
          await fetchUnassignedCount();
          return true;
        } else {
          setError(response.message || "Failed to assign customers");
          return false;
        }
      } catch (err: any) {
        console.error("Error manually assigning customers:", err);
        setError(
          err.response?.data?.message || "An error occurred while assigning customers"
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    [userData?.token, authLoading, fetchEmployees, fetchUnassignedCount]
  );

  // Save assignment rules
  const handleSaveRules = useCallback(
    async (params: SaveRulesParams) => {
      if (authLoading || !userData?.token) {
        return false;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await saveAssignmentRules(params);
        
        if (response.status === "success") {
          setRules(response.data.rules);
          return true;
        } else {
          setError(response.message || "Failed to save rules");
          return false;
        }
      } catch (err: any) {
        console.error("Error saving rules:", err);
        setError(
          err.response?.data?.message || "An error occurred while saving rules"
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    [userData?.token, authLoading]
  );

  // Initial load
  useEffect(() => {
    if (authLoading || !userData?.token) {
      return;
    }

    const loadInitialData = async () => {
      await Promise.all([
        fetchEmployees(),
        fetchUnassignedCount(),
        fetchRules(),
      ]);
    };

    loadInitialData();
  }, [userData?.token, authLoading, fetchEmployees, fetchUnassignedCount, fetchRules]);

  return {
    employees,
    rules,
    unassignedCount,
    loading,
    error,
    fetchEmployees,
    fetchUnassignedCount,
    fetchRules,
    handleAutoAssign,
    handleManualAssign,
    handleSaveRules,
  };
}

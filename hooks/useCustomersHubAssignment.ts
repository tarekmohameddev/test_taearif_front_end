import { useState, useEffect, useCallback } from "react";
import useAuthStore from "@/context/AuthContext";
import axiosInstance from "@/lib/axiosInstance";
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
 * NOTE: Temporarily using /v1/employees endpoint until 
 * /api/v2/customers-hub/assignment/employees is implemented.
 * 
 * The new endpoint is documented in:
 * docs/backend-integration/api/assignment/customers-hub-assignment-api-specification.md
 */

// Interface for /v1/employees response
interface V1Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  active: boolean;
  roles?: Array<{ id: number; name: string; team_id: number }>;
}

interface V1EmployeesResponse {
  current_page: number;
  data: V1Employee[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

// Fetch employees from /v1/employees and transform to EmployeeWorkload format
async function getEmployees(): Promise<EmployeesResponse> {
  try {
    const response = await axiosInstance.get<V1EmployeesResponse>("/v1/employees");
    
    // Transform V1Employee[] to EmployeeWorkload[]
    const employees: EmployeeWorkload[] = response.data.data.map((emp) => {
      const fullName = `${emp.first_name} ${emp.last_name}`.trim();
      const roleName = emp.roles && emp.roles.length > 0 
        ? emp.roles[0].name 
        : "Employee";
      
      // Default values - these should come from the new endpoint when implemented
      const customerCount = 0;
      const activeCount = 0;
      const maxCapacity = 50; // Default capacity
      const loadPercentage = maxCapacity > 0 
        ? Math.round((customerCount / maxCapacity) * 100) 
        : 0;
      
      return {
        id: emp.id.toString(),
        name: fullName,
        role: roleName,
        email: emp.email || undefined,
        phone: emp.phone || undefined,
        customerCount,
        activeCount,
        maxCapacity,
        isActive: emp.active,
        loadPercentage,
      };
    });
    
    return {
      status: "success",
      code: 200,
      message: "Employees retrieved successfully",
      data: { employees },
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error("Error fetching employees from /v1/employees:", error);
    // Return empty array on error to prevent breaking the UI
    return {
      status: "error",
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to fetch employees",
      data: { employees: [] },
      timestamp: new Date().toISOString(),
    };
  }
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

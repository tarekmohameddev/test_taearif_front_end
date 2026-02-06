import { create } from "zustand";
import axiosInstance from "@/lib/axiosInstance";
import type {
  EmployeeWorkload,
  EmployeeConfig,
  AutoAssignParams,
  ManualAssignParams,
  SaveRulesParams,
  EmployeesResponse,
  UnassignedCountResponse,
  AutoAssignResponse,
  ManualAssignResponse,
  SaveRulesResponse,
  GetRulesResponse,
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
  total: number;
  per_page: number;
  last_page: number;
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
    message: "Unassigned count retrieved successfully",
    data: { unassignedCount: 0 },
    timestamp: new Date().toISOString(),
  };
}

// Stub function - endpoint not available
async function autoAssignCustomers(params: AutoAssignParams): Promise<AutoAssignResponse> {
  return {
    status: "success",
    code: 200,
    message: "Customers assigned successfully",
    data: { assignedCount: 0 },
    timestamp: new Date().toISOString(),
  };
}

// Stub function - endpoint not available
async function manualAssignCustomers(params: ManualAssignParams): Promise<ManualAssignResponse> {
  return {
    status: "success",
    code: 200,
    message: "Customer assigned successfully",
    data: { success: true },
    timestamp: new Date().toISOString(),
  };
}

// Stub function - endpoint not available
async function saveAssignmentRules(params: SaveRulesParams): Promise<SaveRulesResponse> {
  return {
    status: "success",
    code: 200,
    message: "Rules saved successfully",
    data: { success: true },
    timestamp: new Date().toISOString(),
  };
}

// Stub function - endpoint not available
async function getAssignmentRules(): Promise<GetRulesResponse> {
  return {
    status: "success",
    code: 200,
    message: "Rules retrieved successfully",
    data: { rules: [] },
    timestamp: new Date().toISOString(),
  };
}

interface CustomersHubAssignmentStore {
  // State
  employees: EmployeeWorkload[];
  rules: EmployeeConfig[];
  unassignedCount: number;
  loading: boolean;
  error: string | null;
  hasLoaded: boolean;

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

  // Fetch unassigned count
  fetchUnassignedCount: async () => {
    try {
      const response = await getUnassignedCount();
      if (response.status === "success") {
        set({ unassignedCount: response.data.unassignedCount });
      }
    } catch (err: any) {
      console.error("Error fetching unassigned count:", err);
    }
  },

  // Fetch assignment rules
  fetchRules: async () => {
    try {
      const response = await getAssignmentRules();
      if (response.status === "success") {
        set({ rules: response.data.rules });
      }
    } catch (err: any) {
      console.error("Error fetching rules:", err);
    }
  },

  // Auto assign customers
  handleAutoAssign: async (params: AutoAssignParams) => {
    try {
      const response = await autoAssignCustomers(params);
      if (response.status === "success") {
        // Refresh employees after assignment
        await get().fetchEmployees();
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
        // Refresh employees after assignment
        await get().fetchEmployees();
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
    });
  },
}));

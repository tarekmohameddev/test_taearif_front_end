import axiosInstance from "@/lib/axiosInstance";

const BASE_URL = "/v2/customers-hub/assignment";

export interface EmployeeWorkload {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  customerCount: number;
  activeCount: number;
  maxCapacity: number;
  isActive: boolean;
  loadPercentage: number;
}

export interface EmployeeRule {
  id: string;
  field: "budgetMin" | "budgetMax" | "propertyType" | "city" | "source";
  operator: "equals" | "greaterThan" | "lessThan" | "contains";
  value: string;
}

export interface EmployeeConfig {
  employeeId: string;
  isActive: boolean;
  rules: EmployeeRule[];
}

export interface EmployeesResponse {
  status: "success";
  code: number;
  message: string;
  data: {
    employees: EmployeeWorkload[];
  };
  timestamp: string;
}

export interface UnassignedCountResponse {
  status: "success";
  code: number;
  message: string;
  data: {
    unassignedCount: number;
  };
  timestamp: string;
}

export interface AutoAssignParams {
  employeeRules: EmployeeConfig[];
}

export interface AutoAssignResponse {
  status: "success";
  code: number;
  message: string;
  data: {
    assignedCount: number;
    failedCount: number;
    assignments: Array<{
      customerId: string;
      employeeId: string;
      assignedAt: string;
    }>;
  };
  timestamp: string;
}

export interface ManualAssignParams {
  requestIds?: string[]; // Composite request IDs (e.g. "property_request_42", "inquiry_17")
  customerIds?: string[]; // Backward compatibility
  employeeId: string;
}

export interface ManualAssignResponse {
  status: "success";
  code: number;
  message: string;
  data: {
    assignedCount: number;
    assignments: Array<{
      customerId: string;
      employeeId: string;
      assignedAt: string;
    }>;
  };
  timestamp: string;
}

export interface SaveRulesParams {
  employeeRules: EmployeeConfig[];
}

export interface SaveRulesResponse {
  status: "success";
  code: number;
  message: string;
  data: {
    savedCount: number;
    rules: EmployeeConfig[];
  };
  timestamp: string;
}

export interface GetRulesResponse {
  status: "success";
  code: number;
  message: string;
  data: {
    rules: EmployeeConfig[];
  };
  timestamp: string;
}

// Get Employees
export async function getEmployees(): Promise<EmployeesResponse> {
  const response = await axiosInstance.get<EmployeesResponse>(`${BASE_URL}/employees`);
  return response.data;
}

// Get Unassigned Count
export async function getUnassignedCount(): Promise<UnassignedCountResponse> {
  const response = await axiosInstance.get<UnassignedCountResponse>(`${BASE_URL}/unassigned-count`);
  return response.data;
}

// Auto Assign Customers
export async function autoAssignCustomers(params: AutoAssignParams): Promise<AutoAssignResponse> {
  const response = await axiosInstance.post<AutoAssignResponse>(`${BASE_URL}/auto-assign`, params);
  return response.data;
}

// Manual Assign Customers/Requests
// Supports both requestIds (preferred) and customerIds (backward compatibility)
export async function manualAssignCustomers(params: ManualAssignParams): Promise<ManualAssignResponse> {
  const response = await axiosInstance.post<ManualAssignResponse>(`${BASE_URL}/assign`, params);
  return response.data;
}

// Assign single or multiple requests (convenience function)
export async function assignRequests(
  requestIds: string[],
  employeeId: string
): Promise<ManualAssignResponse> {
  return manualAssignCustomers({
    requestIds,
    employeeId,
  });
}

// Save Assignment Rules
export async function saveAssignmentRules(params: SaveRulesParams): Promise<SaveRulesResponse> {
  const response = await axiosInstance.post<SaveRulesResponse>(`${BASE_URL}/rules`, params);
  return response.data;
}

// Get Assignment Rules
export async function getAssignmentRules(): Promise<GetRulesResponse> {
  const response = await axiosInstance.get<GetRulesResponse>(`${BASE_URL}/rules`);
  return response.data;
}

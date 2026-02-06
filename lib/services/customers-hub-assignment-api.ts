/**
 * NOTE: This file contains TypeScript interfaces/types only.
 * All API endpoints for assignment functionality have been removed
 * because they are not documented in docs/backend/customersHubDoc.txt
 * 
 * The following endpoints were removed (not found in documentation):
 * - GET /v2/customers-hub/assignment/employees
 * - GET /v2/customers-hub/assignment/unassigned-count
 * - POST /v2/customers-hub/assignment/auto-assign
 * - POST /v2/customers-hub/assignment/assign
 * - POST /v2/customers-hub/assignment/rules
 * - GET /v2/customers-hub/assignment/rules
 */

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
  customerIds: string[];
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

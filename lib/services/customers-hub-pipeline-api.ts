import axiosInstance from "@/lib/axiosInstance";
import type { UnifiedCustomer } from "@/types/unified-customer";

const BASE_URL = "/v2/customers-hub/pipeline";

export interface PipelineFilters {
  status?: number[];              // Restrict to these stage IDs (property_request_statuses.id)
  status_id?: number[];          // Same as status
  property_type?: string[];      // Restrict to these property types
  city_id?: number;              // Filter by city
  district_id?: number;          // Filter by district
  districts_id?: number;         // Same as district_id
  budget_from?: number;          // Min budget
  budget_to?: number;            // Max budget
  assignedEmployeeId?: number;   // Only requests whose linked customer is assigned to this employee
  search?: string;               // Search in full_name and phone (max 255)
  // Legacy filters (for backward compatibility)
  priority?: number[];
  type?: number[];
  assignedTo?: number[];
}

export interface PipelineBoardParams {
  action?: "board" | "get_board" | "analytics";  // Default: "board"
  includeAnalytics?: boolean;    // When true, response includes analytics even if action is board
  filters?: PipelineFilters;
}

export interface PipelineStage {
  id: number;                    // Stage ID (property_request_statuses.id) - integer
  stage_id: number;              // Same as id (integer)
  name: string;                  // Stage name (Arabic)
  nameEn?: string;               // English stage name
  color: string;
  order: number;
  count: number;                 // Number of requests in this stage
  customers: UnifiedCustomer[];  // Request cards (property requests)
}

export interface PipelineAnalytics {
  conversionRate: number;
  avgDaysInPipeline: number;
  bottlenecks: any[];
}

export interface PipelineBoardResponse {
  status: "success";
  code: number;
  message: string;
  data: {
    stages: PipelineStage[];
    totalCustomers?: number;
    analytics?: PipelineAnalytics;
  };
  timestamp: string;
}

export interface FilterOptionsResponse {
  status: "success";
  code: number;
  message: string;
  data: {
    stages?: Array<{ 
      id: string;                 // stage_id (string)
      label?: string;              // Arabic label
      labelEn?: string;           // English label
      color: string;
      order?: number;
    }>;
    priorities: Array<{ id: number; name: string }>;
    types: Array<{ id: number; name: string }>;
    employees: Array<{ id: number; name: string }>;
  };
  timestamp: string;
}

export interface MoveCustomerParams {
  customerId: number;             // Property request ID (integer)
  newStageId: number;             // Target stage ID (property_request_statuses.id) - integer, must be active
  notes?: string;                 // Optional notes (max 500)
}

export interface MoveCustomerResponse {
  status: "success";
  code: number;
  message: string;
  data: {
    message: string;
    customerId: number;
    customerName: string;
    previousStage: {
      id: number;                 // stage_id (integer)
      nameAr: string;
      nameEn: string;
    };
    newStage: {
      id: number;                 // stage_id (integer)
      nameAr: string;
      nameEn: string;
    };
    movedAt: string;
    movedBy: {
      id: number;
      name: string;
    };
    notes?: string;
  };
  timestamp: string;
}

export interface BulkMoveParams {
  customerIds: number[];          // Property request IDs (array of integers)
  newStageId: number;             // Target stage ID (property_request_statuses.id) - integer, must be active
}

export interface BulkMoveResponse {
  status: "success";
  code: number;
  message: string;
  data: {
    updated: number;              // Number of requests successfully moved
    message: string;
  };
  timestamp: string;
}

// Get Pipeline Board
export async function getPipelineBoard(params: PipelineBoardParams): Promise<PipelineBoardResponse> {
  const response = await axiosInstance.post<PipelineBoardResponse>(`${BASE_URL}`, params);
  return response.data;
}

// Get Pipeline Filter Options
export async function getPipelineFilterOptions(): Promise<FilterOptionsResponse> {
  const response = await axiosInstance.get<FilterOptionsResponse>(`${BASE_URL}/filter-options`);
  return response.data;
}

// Move Customer in Pipeline
export async function moveCustomerInPipeline(params: MoveCustomerParams): Promise<MoveCustomerResponse> {
  const response = await axiosInstance.post<MoveCustomerResponse>(`${BASE_URL}/move`, params);
  return response.data;
}

// Bulk Move Customers in Pipeline
export async function bulkMoveCustomersInPipeline(params: BulkMoveParams): Promise<BulkMoveResponse> {
  const response = await axiosInstance.post<BulkMoveResponse>(`${BASE_URL}/bulk-move`, params);
  return response.data;
}

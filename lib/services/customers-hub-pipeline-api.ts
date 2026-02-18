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

// Pipeline Customer extends UnifiedCustomer with pipeline-specific fields
// Each card in pipeline is either a request or an inquiry
// Note: source is overridden to be "request" | "inquiry" (pipeline-specific) instead of CustomerSource
export type PipelineCustomer = Omit<UnifiedCustomer, 'source'> & {
  // Pipeline-specific fields from API response
  source: "request" | "inquiry";  // Indicates if this is a property request or inquiry (overrides UnifiedCustomer.source)
  requestId?: number | null;       // Property request ID (set when source === "request")
  inquiryId?: number | null;       // Inquiry ID (api_customer_inquiry.id) (set when source === "inquiry")
}

export interface PipelineStage {
  id: number | null;                    // Stage ID (customers_hub_stages.id) - integer or null for Unassigned
  stage_id: string | number | null;     // String identifier (e.g. "new_lead", "qualified") or integer (customers_hub_stages.id) or null
  name: string;                          // Stage name (Arabic)
  nameEn?: string;                       // English stage name
  color: string;
  order: number;
  count: number;                         // Number of requests + inquiries in this stage
  customers: PipelineCustomer[];        // Mix of request cards and inquiry cards
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
  requestId?: number;             // Property request ID (integer) - required when not using inquiryId
  customerId?: number;            // Backward compatibility: treated as request id when requestId is omitted
  inquiryId?: number;             // Inquiry ID (api_customer_inquiry.id) - required when not using requestId/customerId
  newStageId: string | number;    // Target stage: string (e.g. "qualified") or integer (customers_hub_stages.id). Must be active
  notes?: string;                 // Optional notes (max 500)
}

export interface MoveCustomerResponse {
  status: "success";
  code: number;
  message: string;
  data: {
    message: string;
    source: "request" | "inquiry";  // Indicates what was moved
    requestId: number | null;        // Set when source === "request"
    inquiryId: number | null;        // Set when source === "inquiry"
    customerId: number | null;       // The linked customer id (api_customers.id) for reference; may be null if no customer record exists
    customerName: string;            // Request/inquiry contact name (full_name)
    previousStage: {
      id: number;                    // Numeric id (customers_hub_stages.id)
      stage_id: string;              // String identifier (e.g. "new_lead")
      nameAr: string;
      nameEn: string;
    };
    newStage: {
      id: number;                    // Numeric id (customers_hub_stages.id)
      stage_id: string;              // String identifier (e.g. "qualified")
      nameAr: string;
      nameEn: string;
    };
    movedAt: string;
    movedBy: {
      id: number;
      name: string;
    };
    notes?: string | null;
  };
  timestamp: string;
}

export interface BulkMoveParams {
  requestIds?: number[];         // Property request IDs (array of integers) - preferred
  customerIds?: number[];        // Backward compatibility: same as request IDs. Use only for backward compatibility when requestIds is omitted.
  newStageId: string | number;   // Target stage: string (e.g. "qualified") or integer (customers_hub_stages.id). Must be active
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

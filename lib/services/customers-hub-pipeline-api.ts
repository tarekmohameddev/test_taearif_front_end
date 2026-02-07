import axiosInstance from "@/lib/axiosInstance";
import type { UnifiedCustomer } from "@/types/unified-customer";

const BASE_URL = "/v2/customers-hub/pipeline";

export interface PipelineFilters {
  priority?: number[];
  type?: number[];
  assignedTo?: number[];
}

export interface PipelineBoardParams {
  action: "board";
  includeAnalytics?: boolean;
  filters?: PipelineFilters;
}

export interface PipelineStage {
  id?: number;                    // Internal DB id (optional, for backward compatibility)
  stage_id: string;              // Unique stage identifier (e.g., "new_lead", "qualified")
  name?: string;                  // Stage name (optional, use stage_name_ar or stage_name_en from API)
  stage_name_ar?: string;        // Arabic stage name
  stage_name_en?: string;        // English stage name
  color: string;
  order: number;
  customerCount: number;
  customers: UnifiedCustomer[];
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
  customerId: number | string;
  newStageId: string;             // stage_id (string, e.g., "new_lead", "qualified")
  notes?: string;
}

export interface MoveCustomerResponse {
  status: "success";
  code: number;
  message: string;
  data: {
    customerId: number | string;
    customerName: string;
    previousStage: {
      id: string;                 // stage_id (string)
      name?: string;
      nameAr?: string;
      nameEn?: string;
    };
    newStage: {
      id: string;                 // stage_id (string)
      name?: string;
      nameAr?: string;
      nameEn?: string;
    };
    movedAt: string;
    movedBy: {
      id: number | string;
      name: string;
    };
    notes?: string;
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

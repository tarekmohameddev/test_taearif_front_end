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
  id: number;
  name: string;
  color: string;
  order: number;
  customerCount: number;
  customers: UnifiedCustomer[];
}

export interface PipelineAnalytics {
  totalCustomers: number;
  avgTimePerStage: Record<string, string>;
  conversionRates: Record<string, string>;
}

export interface PipelineBoardResponse {
  status: "success";
  code: number;
  message: string;
  data: {
    stages: PipelineStage[];
    analytics?: PipelineAnalytics;
  };
  timestamp: string;
}

export interface FilterOptionsResponse {
  status: "success";
  code: number;
  message: string;
  data: {
    priorities: Array<{ id: number; name: string }>;
    types: Array<{ id: number; name: string }>;
    employees: Array<{ id: number; name: string }>;
  };
  timestamp: string;
}

export interface MoveCustomerParams {
  customerId: number;
  newStageId: number;
  notes?: string;
}

export interface MoveCustomerResponse {
  status: "success";
  code: number;
  message: string;
  data: {
    customerId: number;
    customerName: string;
    previousStage: {
      id: number;
      name: string;
    };
    newStage: {
      id: number;
      name: string;
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

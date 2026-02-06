import axiosInstance from "@/lib/axiosInstance";
import type { UnifiedCustomer } from "@/types/unified-customer";

const BASE_URL = "/v2/customers-hub/list";

export interface CustomersListFilters {
  stage?: number[];
  priority?: number[];
  type?: number[];
  city?: number[];
  district?: number[];
  assignedTo?: number[];
  search?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface CustomersListParams {
  action: "list";
  includeStats?: boolean;
  filters?: CustomersListFilters;
  pagination?: {
    page: number;
    limit: number;
  };
  sorting?: {
    field: string;
    order: "asc" | "desc";
  };
}

export interface CustomersListResponse {
  status: "success";
  code: number;
  message: string;
  data: {
    customers: UnifiedCustomer[];
    stats?: {
      totalCustomers: number;
      newThisMonth: number;
      avgDaysInStage: number;
      conversionRate: string;
    };
    pagination?: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
  timestamp: string;
}

export interface FilterOptionsResponse {
  status: "success";
  code: number;
  message: string;
  data: {
    stages: Array<{ id: number; name: string; color: string; order: number }>;
    priorities: Array<{ id: number; name: string }>;
    types: Array<{ id: number; name: string }>;
    cities: Array<{ id: number; name: string }>;
    districts?: Array<{ id: number; name: string; cityId: number }>;
  };
  timestamp: string;
}

export interface StatsResponse {
  status: "success";
  code: number;
  message: string;
  data: {
    stats: {
      totalCustomers: number;
      newToday: number;
      newThisWeek: number;
      newThisMonth: number;
      avgDaysInStage: number;
      conversionRate: string;
      byStage: Record<string, number>;
      byPriority: Record<string, number>;
      byType: Record<string, number>;
    };
  };
  timestamp: string;
}

// Get Customers List
export async function getCustomersList(params: CustomersListParams): Promise<CustomersListResponse> {
  const response = await axiosInstance.post<CustomersListResponse>(`${BASE_URL}`, params);
  return response.data;
}

// Get Filter Options
export async function getListFilterOptions(): Promise<FilterOptionsResponse> {
  const response = await axiosInstance.get<FilterOptionsResponse>(`${BASE_URL}/filter-options`);
  return response.data;
}

// Get List Stats
export async function getListStats(): Promise<StatsResponse> {
  const response = await axiosInstance.get<StatsResponse>(`${BASE_URL}/stats`);
  return response.data;
}

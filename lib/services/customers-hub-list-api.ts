import axiosInstance from "@/lib/axiosInstance";
import type { UnifiedCustomer } from "@/types/unified-customer";

const BASE_URL = "/v2/customers-hub/list";

// --- In-flight request deduplication (PREVENT_DUPLICATE_API) ---
const inFlight = new Map<string, Promise<unknown>>();

function dedupeByKey<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const existing = inFlight.get(key);
  if (existing) return existing as Promise<T>;
  const promise = fn().finally(() => inFlight.delete(key));
  inFlight.set(key, promise);
  return promise;
}

function listParamsKey(params: CustomersListParams): string {
  const sorted: Record<string, unknown> = {};
  (Object.keys(params) as (keyof CustomersListParams)[])
    .sort()
    .forEach((k) => {
      const v = params[k];
      if (v !== undefined) sorted[k as string] = v;
    });
  return `list:${JSON.stringify(sorted)}`;
}

export interface CustomersListFilters {
  stage?: string[];              // Array of stage_id strings (e.g., ["new_lead", "qualified"])
  priority?: number[];
  type?: number[];
  city?: number[];
  district?: number[];
  assignedTo?: number[];
  /** مصدر العميل (مثل: whatsapp, manual, inquiry) */
  source?: string[];
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
    stages: Array<{ 
      id: string;                 // stage_id (string, e.g., "new_lead", "qualified")
      label?: string;              // Arabic label (stage_name_ar)
      labelEn?: string;           // English label (stage_name_en)
      name?: string;               // Alias for label (backward compatibility)
      color: string;
      order: number;
    }>;
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
      totalDealValue: number;
      closedThisMonth: number;
      conversionRate: number | string;
      avgDaysInPipeline: number;
      avgDaysInStage: number;
      byStage: Record<string, number>;
      byPriority: Record<string, number>;
      byType: Record<string, number>;
    };
  };
  timestamp: string;
}

// Get Customers List
export async function getCustomersList(params: CustomersListParams): Promise<CustomersListResponse> {
  const key = listParamsKey(params);
  return dedupeByKey(key, async () => {
    const response = await axiosInstance.post<CustomersListResponse>(`${BASE_URL}`, params);
    return response.data;
  });
}

// Get Filter Options
export async function getListFilterOptions(): Promise<FilterOptionsResponse> {
  return dedupeByKey("filter-options", async () => {
    const response = await axiosInstance.get<FilterOptionsResponse>(`${BASE_URL}/filter-options`);
    return response.data;
  });
}

// Get List Stats
export async function getListStats(): Promise<StatsResponse> {
  return dedupeByKey("stats", async () => {
    const response = await axiosInstance.get<StatsResponse>(`${BASE_URL}/stats`);
    return response.data;
  });
}

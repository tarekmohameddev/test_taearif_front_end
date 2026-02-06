import axiosInstance from "@/lib/axiosInstance";
import type { CustomerAction, CustomerActionType, CustomerSource, Priority } from "@/types/unified-customer";

const BASE_URL = "/v2/customers-hub/requests";

export interface RequestsListFilters {
  tab?: "all" | "pending" | "overdue" | "completed";
  type?: CustomerActionType[];
  priority?: Priority[];
  status?: ("pending" | "in_progress" | "overdue" | "completed" | "dismissed")[];
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
}

export interface RequestsListParams {
  action: "list";
  includeStats?: boolean;
  filters?: RequestsListFilters;
  pagination?: {
    page: number;
    limit: number;
  };
  sorting?: {
    field: string;
    order: "asc" | "desc";
  };
}

export interface RequestsListResponse {
  status: "success";
  code: number;
  message: string;
  data: {
    actions: CustomerAction[];
    stats?: {
      total: number;
      pending: number;
      completed: number;
      overdue: number;
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
    types: Array<{ value: string; label: string }>;
    priorities: Array<{ value: string; label: string }>;
    statuses: Array<{ value: string; label: string }>;
    employees: Array<{ id: number; name: string }>;
  };
  timestamp: string;
}

export interface ActionDetailResponse {
  status: "success";
  code: number;
  message: string;
  data: {
    action: CustomerAction;
  };
  timestamp: string;
}

export interface CompleteActionResponse {
  status: "success";
  code: number;
  message: string;
  data: {
    actionId: string;
    status: string;
    completedAt: string;
    completedBy: {
      id: number;
      name: string;
    };
  };
  timestamp: string;
}

export interface DismissActionResponse {
  status: "success";
  code: number;
  message: string;
  data: {
    actionId: string;
    status: string;
    dismissedAt: string;
    reason?: string;
  };
  timestamp: string;
}

export interface SnoozeActionResponse {
  status: "success";
  code: number;
  message: string;
  data: {
    actionId: string;
    previousDueDate: string;
    newDueDate: string;
    snoozedAt: string;
    reason?: string;
  };
  timestamp: string;
}

export interface AssignActionResponse {
  status: "success";
  code: number;
  message: string;
  data: {
    actionId: string;
    previousAssignee?: {
      id: number;
      name: string;
    };
    newAssignee: {
      id: number;
      name: string;
    };
    assignedAt: string;
  };
  timestamp: string;
}

// Get Requests List
export async function getRequestsList(params: RequestsListParams): Promise<RequestsListResponse> {
  const response = await axiosInstance.post<RequestsListResponse>(`${BASE_URL}/list`, params);
  return response.data;
}

// Get Filter Options
export async function getFilterOptions(): Promise<FilterOptionsResponse> {
  const response = await axiosInstance.get<FilterOptionsResponse>(`${BASE_URL}/filter-options`);
  return response.data;
}

// Get Single Action Detail
export async function getActionDetail(actionId: string): Promise<ActionDetailResponse> {
  const response = await axiosInstance.get<ActionDetailResponse>(`${BASE_URL}/${actionId}`);
  return response.data;
}

// Complete Action
export async function completeAction(actionId: string, notes?: string): Promise<CompleteActionResponse> {
  const response = await axiosInstance.post<CompleteActionResponse>(`${BASE_URL}/${actionId}/complete`, { notes });
  return response.data;
}

// Dismiss Action
export async function dismissAction(actionId: string, reason?: string): Promise<DismissActionResponse> {
  const response = await axiosInstance.post<DismissActionResponse>(`${BASE_URL}/${actionId}/dismiss`, { reason });
  return response.data;
}

// Snooze Action
export async function snoozeAction(
  actionId: string,
  snoozeUntil: string,
  reason?: string
): Promise<SnoozeActionResponse> {
  const response = await axiosInstance.post<SnoozeActionResponse>(`${BASE_URL}/${actionId}/snooze`, {
    snoozeUntil,
    reason,
  });
  return response.data;
}

// Assign Action
export async function assignAction(actionId: string, employeeId: number): Promise<AssignActionResponse> {
  const response = await axiosInstance.post<AssignActionResponse>(`${BASE_URL}/${actionId}/assign`, { employeeId });
  return response.data;
}

// Get Action Stats
export async function getActionStats(actionId: string): Promise<any> {
  const response = await axiosInstance.get(`${BASE_URL}/${actionId}/stats`);
  return response.data;
}

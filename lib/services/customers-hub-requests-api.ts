import axiosInstance from "@/lib/axiosInstance";
import type { CustomerAction, CustomerActionType, CustomerSource, Priority } from "@/types/unified-customer";

const BASE_URL = "/v2/customers-hub/requests";

export interface RequestsListFilters {
  tab?: "all" | "pending" | "overdue" | "completed" | "inbox" | "followups";
  type?: CustomerActionType[];
  priority?: Priority[];
  status?: ("pending" | "in_progress" | "overdue" | "completed" | "dismissed" | "snoozed")[];
  source?: CustomerSource[];
  assignedTo?: string[]; // Employee IDs
  dueDate?: "all" | "overdue" | "today" | "week" | "no_date";
  search?: string;
  // Customer-based filters
  city?: string[];
  state?: string[]; // Regions/states
  budgetMin?: number;
  budgetMax?: number;
  propertyType?: string[];
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

export interface StageDistribution {
  stage_id: string;
  stage_name_ar: string;
  stage_name_en: string;
  color: string;
  order: number;
  requestCount: number;
  percentage: number;
}

export interface RequestsListResponse {
  status: "success";
  code: number;
  message: string;
  data: {
    actions: CustomerAction[];
    stats?: {
      inbox: number;
      followups: number;
      pending: number;
      overdue: number;
      today: number;
      completed: number;
      total?: number;
    };
    stages?: StageDistribution[];
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

export interface AddNoteResponse {
  status: "success";
  code: number;
  message: string;
  data: {
    actionId: string;
    note: string;
    addedAt: string;
    addedBy: {
      id: number;
      name: string;
    };
  };
  timestamp: string;
}

export interface UpdateCustomerStageResponse {
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

// Bulk Actions Types
export type BulkActionType = 'complete' | 'dismiss' | 'snooze' | 'assign' | 'change_priority';

export interface BulkActionRequest {
  action: BulkActionType;
  actionIds: string[];
  data: {
    notes?: string;
    reason?: string;
    snoozedUntil?: string;
    assignedTo?: number;
    priority?: Priority;
    completedBy?: number;
    dismissedBy?: number;
    snoozedBy?: number;
    assignedBy?: number;
    changedBy?: number;
  };
}

export interface BulkActionResponse {
  status: 'success' | 'error' | 'partial_success';
  code: number;
  message: string;
  data: {
    action: string;
    updatedCount: number;
    successCount: number;
    failedCount: number;
    actionIds: string[];
    failedActionIds?: string[];
    failures?: Array<{
      actionId: string;
      reason: string;
    }>;
    completedAt?: string;
    completedBy?: {
      id: number;
      name: string;
    };
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

// Add Note to Action
export async function addNoteToAction(
  actionId: string,
  note: string,
  addedBy?: number
): Promise<AddNoteResponse> {
  const response = await axiosInstance.post<AddNoteResponse>(
    `${BASE_URL}/${actionId}`,
    {
      action: "add_note",
      data: {
        note,
        addedBy: addedBy?.toString() || "current_user",
      },
    }
  );
  return response.data;
}

// Update Customer Stage
export async function updateCustomerStage(
  customerId: string | number,
  newStageId: string | number,  // Can be string stage_id or numeric stage.id - will be converted to number
  notes?: string
): Promise<UpdateCustomerStageResponse> {
  // Convert customerId to number if needed
  const customerIdNum = typeof customerId === "string" ? parseInt(customerId) : customerId;
  
  // Convert newStageId to number (API expects integer)
  const newStageIdNum = typeof newStageId === "number" 
    ? newStageId 
    : parseInt(newStageId.toString());

  const response = await axiosInstance.post<UpdateCustomerStageResponse>(
    "/v2/customers-hub/pipeline/move",
    {
      customerId: customerIdNum,
      newStageId: newStageIdNum,  // Always numeric stage.id (integer)
      notes: notes || undefined,
    }
  );
  return response.data;
}

// Bulk Actions - Unified Endpoint
export async function bulkActions(
  request: BulkActionRequest
): Promise<BulkActionResponse> {
  const response = await axiosInstance.post<BulkActionResponse>(
    `${BASE_URL}/bulk`,
    request
  );
  return response.data;
}

// Convenience functions for bulk actions
export async function bulkCompleteActions(
  actionIds: string[],
  completedBy: number,
  notes?: string
): Promise<BulkActionResponse> {
  return bulkActions({
    action: 'complete',
    actionIds,
    data: {
      notes,
      completedBy,
    },
  });
}

export async function bulkDismissActions(
  actionIds: string[],
  dismissedBy: number,
  reason?: string
): Promise<BulkActionResponse> {
  return bulkActions({
    action: 'dismiss',
    actionIds,
    data: {
      reason,
      dismissedBy,
    },
  });
}

export async function bulkSnoozeActions(
  actionIds: string[],
  snoozedUntil: string,
  snoozedBy: number,
  reason?: string
): Promise<BulkActionResponse> {
  return bulkActions({
    action: 'snooze',
    actionIds,
    data: {
      snoozedUntil,
      reason,
      snoozedBy,
    },
  });
}

export async function bulkAssignActions(
  actionIds: string[],
  assignedTo: number,
  assignedBy: number
): Promise<BulkActionResponse> {
  return bulkActions({
    action: 'assign',
    actionIds,
    data: {
      assignedTo,
      assignedBy,
    },
  });
}

export async function bulkChangePriority(
  actionIds: string[],
  priority: Priority,
  changedBy: number
): Promise<BulkActionResponse> {
  return bulkActions({
    action: 'change_priority',
    actionIds,
    data: {
      priority,
      changedBy,
    },
  });
}

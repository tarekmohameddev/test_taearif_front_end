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
  code?: number; // Optional - may not be present in all responses
  message?: string; // Optional - may not be present in all responses
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
      // New API format (preferred)
      total?: number;
      limit?: number;
      offset?: number;
      hasMore?: boolean;
      // Legacy format (for backward compatibility)
      currentPage?: number;
      totalPages?: number;
      totalItems?: number;
      itemsPerPage?: number;
    };
  };
  timestamp?: string; // Optional - may not be present in all responses
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
    requestId: number;            // The property request that was moved
    customerId: number | null;    // The linked customer id (api_customers.id) for reference; may be null if no customer record exists
    customerName: string;         // Request contact name (full_name)
    previousStage: {
      id: number;
      nameAr: string;
      nameEn: string;
    };
    newStage: {
      id: number;
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

// Update Customer Stage (moves property request to new stage)
export async function updateCustomerStage(
  requestId: string | number,     // Property request ID (preferred) - can also be customerId for backward compatibility
  newStageId: string | number,    // Can be string stage_id or numeric stage.id - will be converted to number
  notes?: string
): Promise<UpdateCustomerStageResponse> {
  // Validate requestId
  if (requestId === null || requestId === undefined || requestId === "") {
    throw new Error("Request ID is required and cannot be null or empty");
  }

  // Convert requestId to number if needed
  const requestIdNum = typeof requestId === "string" ? parseInt(requestId) : requestId;
  
  // Validate that requestIdNum is a valid number
  if (isNaN(requestIdNum) || requestIdNum === null || requestIdNum === undefined) {
    throw new Error(`Invalid request ID: ${requestId} - must be a valid number`);
  }

  // Validate newStageId
  if (newStageId === null || newStageId === undefined || newStageId === "") {
    throw new Error("Stage ID is required and cannot be null or empty");
  }

  // Convert newStageId to number (API expects integer)
  const newStageIdNum = typeof newStageId === "number" 
    ? newStageId 
    : parseInt(newStageId.toString());

  // Validate that newStageIdNum is a valid number
  if (isNaN(newStageIdNum) || newStageIdNum === null || newStageIdNum === undefined) {
    throw new Error(`Invalid stage ID: ${newStageId} - must be a valid number`);
  }

  const response = await axiosInstance.post<UpdateCustomerStageResponse>(
    "/v2/customers-hub/pipeline/move",
    {
      requestId: requestIdNum,     // Use requestId (preferred) - API also accepts customerId for backward compatibility
      newStageId: newStageIdNum,   // Always numeric stage.id (integer)
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

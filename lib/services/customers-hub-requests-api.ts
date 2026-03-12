import axiosInstance from "@/lib/axiosInstance";
import type { CustomerAction, CustomerActionType, CustomerSource, Priority } from "@/types/unified-customer";

const BASE_URL = "/v2/customers-hub/requests";

// --- In-flight request deduplication (PREVENT_DUPLICATE_API) ---
// Same key requested while a request is in progress returns the existing promise.
const inFlight = new Map<string, Promise<unknown>>();

function dedupeByKey<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const existing = inFlight.get(key);
  if (existing) {
    return existing as Promise<T>;
  }
  const promise = fn().finally(() => {
    inFlight.delete(key);
  });
  inFlight.set(key, promise);
  return promise;
}

/** Stable key for list params (sorted keys for consistency). */
function listParamsKey(body: RequestsListFilters): string {
  const sorted: Record<string, unknown> = {};
  (Object.keys(body) as (keyof RequestsListFilters)[])
    .sort()
    .forEach((k) => {
      const v = body[k];
      if (v !== undefined) sorted[k as string] = v;
    });
  return "list:" + JSON.stringify(sorted);
}

// Flat structure matching new API format
export type ObjectType = "inquiry" | "property_request" | "reminder" | "appointment" | "customer_reminder";

/** Appointment type filter: property_request only if it has ≥1 appointment of selected type(s). Other action types unaffected. */
export type AppointmentTypeFilter =
  | "site_visit"
  | "office_meeting"
  | "phone_call"
  | "video_call"
  | "contract_signing"
  | "other";

export interface RequestsListFilters {
  tab?: "inbox" | "followups" | "all" | "completed";
  status?: ("pending" | "in_progress" | "completed" | "dismissed" | "snoozed")[]; // Changed from "statuses" to "status"
  sources?: CustomerSource[]; // Changed from "source" to "sources"
  objectTypes?: ObjectType[]; // Kind of record (inquiry, property_request, reminder, appointment, customer_reminder)
  appointment_types?: AppointmentTypeFilter[]; // Optional: filter property_request by appointment type (property_request_appointments)
  priorities?: Priority[]; // Changed from "priority" to "priorities"
  assignees?: number[]; // Changed from "assignedTo" (string[]) to "assignees" (number[])
  due_date_bucket?: "overdue" | "today" | "week" | "no_date"; // Changed from "dueDate" to "due_date_bucket"
  customer_id?: number;
  property_categories?: string[]; // Unit type: villa, apartment, building, etc. (applied to both inquiries and property requests)
  property_types?: string[]; // Sector: Residential, Commercial, Industrial, Agricultural (property requests only)
  cities?: string[]; // Changed from "city" to "cities"
  states?: string[]; // Changed from "state" to "states"
  stages?: number[]; // Pipeline stage IDs (property_request_statuses.id) – filter list by stage
  budget_min?: number; // Changed from "budgetMin" to "budget_min"
  budget_max?: number; // Changed from "budgetMax" to "budget_max"
  date_from?: string; // New field (ISO date string)
  date_to?: string; // New field (ISO date string)
  search?: string;
  sort_by?: "createdAt" | "dueDate" | "priority" | "customerName"; // Changed from sorting.field
  sort_dir?: "asc" | "desc"; // Changed from sorting.order
  limit?: number; // Changed from pagination.limit
  offset?: number; // Changed from pagination.offset (calculated from page)
}

// Legacy interface kept for backward compatibility but deprecated
export interface LegacyRequestsListFilters {
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
  action?: "list"; // Optional now since we're sending flat structure
  includeStats?: boolean; // Not used in new API format
  filters?: LegacyRequestsListFilters; // Deprecated - use flat structure instead
  pagination?: {
    page: number;
    limit: number;
  }; // Deprecated - use limit/offset instead
  sorting?: {
    field: string;
    order: "asc" | "desc";
  }; // Deprecated - use sort_by/sort_dir instead
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
    sources?: Array<{ value: string; label: string }>; // Optional: Origin options
    objectTypes?: Array<{ id: string; label: string; labelEn: string }>; // Options for filtering by kind of record
    appointmentTypes?: Array<{ id: string; label: string; labelEn: string }>; // Options for filter "نوع الموعد" (from GET filter-options)
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
// New API format: flat structure in request body
export async function getRequestsList(params: RequestsListFilters | RequestsListParams): Promise<RequestsListResponse> {
  // Convert legacy nested format to flat format if needed
  let requestBody: RequestsListFilters;
  
  if ('filters' in params && params.filters) {
    // Legacy format: convert to flat structure
    // Type guard: params is RequestsListParams when 'filters' exists
    const legacyParams = params as RequestsListParams;
    const legacyFilters: LegacyRequestsListFilters = legacyParams.filters!;
    // Convert legacy tab values to new format
    let tab: "inbox" | "followups" | "all" | "completed" | undefined;
    if (legacyFilters.tab === "pending" || legacyFilters.tab === "overdue") {
      tab = "all"; // Map pending/overdue to "all"
    } else {
      tab = legacyFilters.tab as "inbox" | "followups" | "all" | "completed" | undefined;
    }
    
    // Filter out "overdue" from status if present
    const status = legacyFilters.status?.filter(s => s !== "overdue") as ("pending" | "in_progress" | "completed" | "dismissed" | "snoozed")[] | undefined;
    
    requestBody = {
      tab,
      status,
      sources: legacyFilters.source,
      priorities: legacyFilters.priority,
      assignees: legacyFilters.assignedTo ? legacyFilters.assignedTo.map((id: any) => parseInt(id.toString())) : undefined,
      due_date_bucket: legacyFilters.dueDate !== "all" ? legacyFilters.dueDate : undefined,
      property_categories: legacyFilters.propertyType,
      cities: legacyFilters.city,
      states: legacyFilters.state,
      budget_min: legacyFilters.budgetMin,
      budget_max: legacyFilters.budgetMax,
      search: legacyFilters.search,
      sort_by: legacyParams.sorting?.field === "created_at" ? "createdAt" : legacyParams.sorting?.field as any,
      sort_dir: legacyParams.sorting?.order,
      limit: legacyParams.pagination?.limit || 50,
      offset: legacyParams.pagination ? (legacyParams.pagination.page - 1) * legacyParams.pagination.limit : 0,
    };
    
    // ALWAYS ensure objectTypes includes inquiry and property_request
    if (!requestBody.objectTypes || requestBody.objectTypes.length === 0) {
      requestBody.objectTypes = ["inquiry", "property_request"];
    } else {
      // Ensure both inquiry and property_request are included
      if (!requestBody.objectTypes.includes("inquiry")) {
        requestBody.objectTypes = ["inquiry", ...requestBody.objectTypes];
      }
      if (!requestBody.objectTypes.includes("property_request")) {
        requestBody.objectTypes = [...requestBody.objectTypes, "property_request"];
      }
    }
    
    // Remove undefined fields
    Object.keys(requestBody).forEach(key => {
      if (requestBody[key as keyof RequestsListFilters] === undefined) {
        delete requestBody[key as keyof RequestsListFilters];
      }
    });
  } else {
    // Already flat format
    requestBody = params as RequestsListFilters;
    
    // Ensure default values
    if (requestBody.limit === undefined) {
      requestBody.limit = 50;
    }
    if (requestBody.offset === undefined) {
      requestBody.offset = 0;
    }
    if (requestBody.sort_by === undefined) {
      requestBody.sort_by = "createdAt";
    }
    if (requestBody.sort_dir === undefined) {
      requestBody.sort_dir = "desc";
    }
    
    // ALWAYS ensure objectTypes includes inquiry and property_request
    if (!requestBody.objectTypes || requestBody.objectTypes.length === 0) {
      requestBody.objectTypes = ["inquiry", "property_request"];
    } else {
      // Ensure both inquiry and property_request are included
      if (!requestBody.objectTypes.includes("inquiry")) {
        requestBody.objectTypes = ["inquiry", ...requestBody.objectTypes];
      }
      if (!requestBody.objectTypes.includes("property_request")) {
        requestBody.objectTypes = [...requestBody.objectTypes, "property_request"];
      }
    }
    
    // Remove undefined fields
    Object.keys(requestBody).forEach(key => {
      if (requestBody[key as keyof RequestsListFilters] === undefined) {
        delete requestBody[key as keyof RequestsListFilters];
      }
    });
  }

  const key = listParamsKey(requestBody);
  return dedupeByKey(key, async () => {
    const response = await axiosInstance.post<RequestsListResponse>(`${BASE_URL}/list`, requestBody);
    return response.data;
  });
}

// Get Filter Options
export async function getFilterOptions(): Promise<FilterOptionsResponse> {
  return dedupeByKey("filter-options", async () => {
    const response = await axiosInstance.get<FilterOptionsResponse>(`${BASE_URL}/filter-options`);
    return response.data;
  });
}

// Get Single Action Detail
export async function getActionDetail(actionId: string): Promise<ActionDetailResponse> {
  return dedupeByKey(`detail:${actionId}`, async () => {
    const response = await axiosInstance.get<ActionDetailResponse>(`${BASE_URL}/${actionId}`);
    return response.data;
  });
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
  return dedupeByKey(`stats:${actionId}`, async () => {
    const response = await axiosInstance.get(`${BASE_URL}/${actionId}/stats`);
    return response.data;
  });
}

// Add Note to Action
// Endpoint: POST /api/v2/customers-hub/requests/{requestId}/notes
// Body: { "note": "Required note text", "addedBy": "Optional display name" }
export async function addNoteToAction(
  actionId: string, // Composite id like "property_request_89" or "inquiry_17"
  note: string,
  addedBy?: number | string // Can be user ID (number) or display name (string)
): Promise<AddNoteResponse> {
  // Build request body according to API documentation
  const requestBody: { note: string; addedBy?: string } = {
    note: note.trim(),
  };
  
  // Add addedBy if provided (API expects string display name)
  if (addedBy !== undefined) {
    // If it's a number (user ID), convert to string
    // Backend will handle it appropriately
    requestBody.addedBy = typeof addedBy === 'string' ? addedBy : String(addedBy);
  }
  
  // Use correct endpoint: /notes (not just the base URL)
  const response = await axiosInstance.post<AddNoteResponse>(
    `${BASE_URL}/${actionId}/notes`, // Correct endpoint: /v2/customers-hub/requests/{requestId}/notes
    requestBody // Flat body structure: { note, addedBy }
  );
  
  return response.data;
}

// Update Customer Stage (moves property request or inquiry to new stage)
export async function updateCustomerStage(
  requestIdOrInquiryId: string | number | undefined,  // Can be undefined if inquiryId is provided
  newStageId: string | number,            // Can be string stage_id (e.g. "qualified") or numeric stage.id
  notes?: string,
  inquiryId?: number                       // Optional: explicitly provide inquiryId if moving an inquiry
): Promise<UpdateCustomerStageResponse> {
  // Validate: either requestIdOrInquiryId or inquiryId must be provided
  if ((requestIdOrInquiryId === null || requestIdOrInquiryId === undefined || requestIdOrInquiryId === "") 
      && (inquiryId === undefined || inquiryId === null)) {
    throw new Error("Request ID or Inquiry ID is required and cannot be null or empty");
  }

  // Validate newStageId
  if (newStageId === null || newStageId === undefined || newStageId === "") {
    throw new Error("Stage ID is required and cannot be null or empty");
  }

  // Prepare request body - API accepts either requestId or inquiryId (not both)
  const requestBody: {
    requestId?: number;
    customerId?: number;
    inquiryId?: number;
    newStageId: string | number;
    notes?: string;
  } = {
    newStageId: newStageId,  // API accepts both string and number
    notes: notes || undefined,
  };

  // If inquiryId is explicitly provided, use it
  if (inquiryId !== undefined && inquiryId !== null) {
    const inquiryIdNum = Number(inquiryId);
    if (isNaN(inquiryIdNum)) {
      throw new Error(`Invalid inquiry ID: ${inquiryId} - must be a valid number`);
    }
    requestBody.inquiryId = inquiryIdNum;
  } else if (requestIdOrInquiryId !== undefined && requestIdOrInquiryId !== null && requestIdOrInquiryId !== "") {
    // Otherwise, treat as requestId (backward compatibility)
    const requestIdNum = typeof requestIdOrInquiryId === "string" 
      ? parseInt(requestIdOrInquiryId) 
      : requestIdOrInquiryId;
    
    if (isNaN(requestIdNum) || requestIdNum === null || requestIdNum === undefined) {
      throw new Error(`Invalid request ID: ${requestIdOrInquiryId} - must be a valid number`);
    }
    requestBody.requestId = requestIdNum;
  }

  const response = await axiosInstance.post<UpdateCustomerStageResponse>(
    "/v2/customers-hub/pipeline/move",
    requestBody
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

// Appointment and Reminder Types
export interface CreateAppointmentParams {
  type: 'site_visit' | 'office_meeting' | 'phone_call' | 'video_call' | 'contract_signing' | 'other';
  datetime: string; // ISO 8601 datetime - must be in the future
  duration?: number; // Duration in minutes (default 30, min 1)
  notes?: string; // Optional notes
  title?: string; // Optional - if omitted, backend sets default title
  priority?: 'low' | 'medium' | 'high' | 'urgent'; // Default medium
}

export interface CreateAppointmentResponse {
  success: boolean;
  data: {
    appointment: {
      id: number;
      requestId: string;
      customerId: number | null;
      title: string;
      type: string;
      datetime: string;
      duration: number;
      status: string;
      priority: string;
      notes: string | null;
      createdAt: string;
      updatedAt: string;
    };
  };
  error?: {
    code: string;
    message: string;
    message_ar?: string;
  };
}

export interface CreateReminderParams {
  title: string; // Required
  description?: string; // Optional
  datetime: string; // ISO 8601 datetime - must be in the future
  priority: 'low' | 'medium' | 'high' | 'urgent'; // Required
  type: 'follow_up' | 'payment_due' | 'document_required' | 'other'; // Required
  notes?: string; // Optional
}

export interface CreateReminderResponse {
  success: boolean;
  data: {
    reminder: {
      id: number;
      requestId: string;
      customerId: number | null;
      title: string;
      description: string | null;
      datetime: string;
      priority: string;
      type: string;
      status: string;
      notes: string | null;
      isOverdue: boolean;
      daysUntilDue: number;
      createdAt: string;
      updatedAt: string;
    };
  };
  error?: {
    code: string;
    message: string;
    message_ar?: string;
  };
}

// Create Appointment for Property Request
export async function createAppointmentForRequest(
  requestId: string, // Composite id like "property_request_89"
  params: CreateAppointmentParams
): Promise<CreateAppointmentResponse> {
  // Validate requestId
  if (!requestId || typeof requestId !== 'string') {
    throw new Error(`Invalid requestId: ${requestId}. Must be a composite id like "property_request_89"`);
  }
  
  // Validate required fields
  if (!params.type || !params.datetime) {
    throw new Error("Missing required fields: type and datetime are required");
  }
  
  // Remove undefined values from params
  const cleanParams: Record<string, any> = {
    type: params.type,
    datetime: params.datetime,
  };
  
  if (params.duration !== undefined) cleanParams.duration = params.duration;
  if (params.notes !== undefined && params.notes !== null && params.notes !== '') cleanParams.notes = params.notes;
  if (params.title !== undefined && params.title !== null && params.title !== '') cleanParams.title = params.title;
  if (params.priority !== undefined) cleanParams.priority = params.priority;
  
  const url = `${BASE_URL}/${encodeURIComponent(requestId)}/appointments`;
  
  console.log('🔵 createAppointmentForRequest - Request details:', {
    url,
    requestId,
    cleanParams,
    fullUrl: `${axiosInstance.defaults.baseURL || ''}${url}`,
  });
  
  try {
    const response = await axiosInstance.post<CreateAppointmentResponse>(url, cleanParams);
    console.log('✅ createAppointmentForRequest - Success:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error in createAppointmentForRequest:', {
      url,
      requestId,
      params: cleanParams,
      error: error.response?.data || error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      headers: error.response?.headers,
    });
    throw error;
  }
}

// Create Reminder for Property Request
export async function createReminderForRequest(
  requestId: string, // Composite id like "property_request_89"
  params: CreateReminderParams
): Promise<CreateReminderResponse> {
  // Validate requestId
  if (!requestId || typeof requestId !== 'string') {
    throw new Error(`Invalid requestId: ${requestId}. Must be a composite id like "property_request_89"`);
  }
  
  // Validate required fields
  if (!params.title || !params.datetime || !params.priority || !params.type) {
    throw new Error("Missing required fields: title, datetime, priority, and type are required");
  }
  
  // Remove undefined values from params
  const cleanParams: Record<string, any> = {
    title: params.title,
    datetime: params.datetime,
    priority: params.priority,
    type: params.type,
  };
  
  if (params.description !== undefined && params.description !== null && params.description !== '') {
    cleanParams.description = params.description;
  }
  if (params.notes !== undefined && params.notes !== null && params.notes !== '') {
    cleanParams.notes = params.notes;
  }
  
  const url = `${BASE_URL}/${encodeURIComponent(requestId)}/reminders`;
  
  try {
    const response = await axiosInstance.post<CreateReminderResponse>(url, cleanParams);
    return response.data;
  } catch (error: any) {
    console.error('Error in createReminderForRequest:', {
      url,
      requestId,
      params: cleanParams,
      error: error.response?.data || error.message,
      status: error.response?.status,
    });
    throw error;
  }
}

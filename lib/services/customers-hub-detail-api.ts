import axiosInstance from "@/lib/axiosInstance";
import type { UnifiedCustomer, Appointment, PropertyInterest } from "@/types/unified-customer";

const BASE_URL = "/v2/customers-hub/customers";

export interface CustomerDetailResponse {
  status: "success";
  code: number;
  message: string;
  data: {
    customer: UnifiedCustomer;
    stats?: {
      totalInquiries: number;
      totalTasks: number;
      completedTasks: number;
      pendingTasks: number;
      totalAppointments: number;
      daysAsCustomer: number;
    };
    tasks?: Array<{
      id: number;
      type: string;
      title: string;
      description?: string;
      priority: number;
      status: string;
      dueDate: string;
      createdAt: string;
    }>;
    interestedProperties?: PropertyInterest[];
    preferences?: {
      propertyType: string;
      minBudget?: number;
      maxBudget?: number;
      preferredAreas: string[];
      minBedrooms?: number;
      minBathrooms?: number;
      features?: string[];
    };
  };
  timestamp: string;
}

export interface UpdateCustomerParams {
  name?: string;
  phone_number?: string;
  email?: string;
  source?: string;
  note?: string;
  customers_hub_stage_id?: string;  // stage_id (string, e.g., "new_lead", "qualified")
  priority_id?: number;
  type_id?: number;
  procedure_id?: number;
  responsible_employee_id?: number;
  city_id?: number;
  district_id?: number;
}

export interface UpdateCustomerResponse {
  status: "success";
  code: number;
  message: string;
  data: {
    customer: {
      id: number | string;
      name?: string;
      email?: string;
      phone_number?: string;
      stage?: {
        id: string;                 // stage_id (string)
        name?: string;
        nameAr?: string;
        nameEn?: string;
        color?: string;
      };
      customers_hub_stage_id?: string;  // stage_id (string)
      updatedAt: string;
    };
  };
  timestamp: string;
}

export interface AddTaskParams {
  type: string;
  datetime: string;
  notes?: string;
  priority: number;
}

export interface AddTaskResponse {
  status: "success";
  code: number;
  message: string;
  data: {
    task: {
      id: number;
      customerId: number;
      type: string;
      title: string;
      datetime: string;
      notes?: string;
      priority: number;
      status: string;
      createdAt: string;
    };
  };
  timestamp: string;
}

export interface UpdateTaskParams {
  datetime?: string;
  notes?: string;
  priority?: number;
  status?: string;
}

export interface UpdateTaskResponse {
  status: "success";
  code: number;
  message: string;
  data: {
    task: {
      id: number;
      customerId: number;
      datetime?: string;
      notes?: string;
      priority?: number;
      status?: string;
      updatedAt: string;
    };
  };
  timestamp: string;
}

export interface UpdatePreferencesParams {
  propertyType?: string;
  minBudget?: number;
  maxBudget?: number;
  preferredAreas?: string[];
  minBedrooms?: number;
  minBathrooms?: number;
  minArea?: number;
  maxArea?: number;
  features?: string[];
}

export interface UpdatePreferencesResponse {
  status: "success";
  code: number;
  message: string;
  data: {
    preferences: {
      propertyType?: string;
      minBudget?: number;
      maxBudget?: number;
      preferredAreas?: string[];
      minBedrooms?: number;
      minBathrooms?: number;
      minArea?: number;
      maxArea?: number;
      features?: string[];
      updatedAt: string;
    };
  };
  timestamp: string;
}

export interface CustomerHistoryResponse {
  status: "success";
  code: number;
  message: string;
  data: {
    history: Array<{
      id: number;
      type: string;
      description: string;
      details?: Record<string, any>;
      performedBy: {
        id: number;
        name: string;
      };
      timestamp: string;
    }>;
    pagination: {
      limit: number;
      offset: number;
      total: number;
    };
  };
  timestamp: string;
}

// Get Customer Details
export async function getCustomerDetail(customerId: string, includeTasks?: boolean, includeProperties?: boolean, includePreferences?: boolean): Promise<CustomerDetailResponse> {
  const params = new URLSearchParams();
  if (includeTasks !== undefined) params.append("includeTasks", includeTasks.toString());
  if (includeProperties !== undefined) params.append("includeProperties", includeProperties.toString());
  if (includePreferences !== undefined) params.append("includePreferences", includePreferences.toString());
  
  const url = `${BASE_URL}/${customerId}${params.toString() ? `?${params.toString()}` : ""}`;
  const response = await axiosInstance.get<CustomerDetailResponse>(url);
  return response.data;
}

// Update Customer
export async function updateCustomer(customerId: string, params: UpdateCustomerParams): Promise<UpdateCustomerResponse> {
  const response = await axiosInstance.put<UpdateCustomerResponse>(`${BASE_URL}/${customerId}`, params);
  return response.data;
}

// Add Task to Customer
export async function addTaskToCustomer(customerId: string, params: AddTaskParams): Promise<AddTaskResponse> {
  const response = await axiosInstance.post<AddTaskResponse>(`${BASE_URL}/${customerId}/tasks`, params);
  return response.data;
}

// Update Task
export async function updateTask(customerId: string, taskId: string, params: UpdateTaskParams): Promise<UpdateTaskResponse> {
  const response = await axiosInstance.put<UpdateTaskResponse>(`${BASE_URL}/${customerId}/tasks/${taskId}`, params);
  return response.data;
}

// Delete Task
export async function deleteTask(customerId: string, taskId: string): Promise<any> {
  const response = await axiosInstance.delete(`${BASE_URL}/${customerId}/tasks/${taskId}`);
  return response.data;
}

// Update Customer Preferences
export async function updateCustomerPreferences(customerId: string, params: UpdatePreferencesParams): Promise<UpdatePreferencesResponse> {
  const response = await axiosInstance.put<UpdatePreferencesResponse>(`${BASE_URL}/${customerId}/preferences`, params);
  return response.data;
}

// Get Customer History
export async function getCustomerHistory(customerId: string, limit?: number, offset?: number): Promise<CustomerHistoryResponse> {
  const params = new URLSearchParams();
  if (limit !== undefined) params.append("limit", limit.toString());
  if (offset !== undefined) params.append("offset", offset.toString());
  
  const url = `${BASE_URL}/${customerId}/history${params.toString() ? `?${params.toString()}` : ""}`;
  const response = await axiosInstance.get<CustomerHistoryResponse>(url);
  return response.data;
}

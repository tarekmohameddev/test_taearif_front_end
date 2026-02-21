import axiosInstance from "@/lib/axiosInstance";

const BASE_URL = "/v2/customers-hub/customers";

// Types
export interface AssignPropertyParams {
  propertyId: number;
}

export interface AssignPropertyResponse {
  status: "success" | "error";
  message: string;
  data?: {
    customerId: number;
    propertyId: number;
    attachedAt: string;
    message: string;
  };
}

export interface AssignedProperty {
  id: number;
  title: string;
  price: number;
  purpose: string;
  type: string;
  attachedAt: string;
}

export interface GetAssignedPropertiesResponse {
  status: "success" | "error";
  message?: string;
  data?: {
    customerId: number;
    properties: AssignedProperty[];
    total: number;
    pagination?: {
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    };
  };
}

export interface RemovePropertyResponse {
  status: "success" | "error";
  message: string;
  data?: {
    message: string;
    customerId: number;
    propertyId: number;
  };
}

// Assign one property to customer
export async function assignPropertyToCustomer(
  customerId: string,
  params: AssignPropertyParams
): Promise<AssignPropertyResponse> {
  const response = await axiosInstance.post<AssignPropertyResponse>(
    `${BASE_URL}/${customerId}/properties`,
    params
  );
  return response.data;
}

// Get all assigned properties for a customer
export async function getCustomerAssignedProperties(
  customerId: string,
  limit?: number,
  offset?: number
): Promise<GetAssignedPropertiesResponse> {
  const params = new URLSearchParams();
  if (limit !== undefined) params.append("limit", limit.toString());
  if (offset !== undefined) params.append("offset", offset.toString());

  const url = `${BASE_URL}/${customerId}/properties${params.toString() ? `?${params.toString()}` : ""}`;
  const response = await axiosInstance.get<GetAssignedPropertiesResponse>(url);
  return response.data;
}

// Remove property assignment from customer
export async function removePropertyFromCustomer(
  customerId: string,
  propertyId: number
): Promise<RemovePropertyResponse> {
  const response = await axiosInstance.delete<RemovePropertyResponse>(
    `${BASE_URL}/${customerId}/properties/${propertyId}`
  );
  return response.data;
}

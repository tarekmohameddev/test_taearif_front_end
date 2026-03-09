import axiosInstance from "@/lib/axiosInstance";

export type SubmitPropertyInterestPayload = {
  tenant_username: string;
  property_id: number;
  full_name: string;
  phone: string;
  notes?: string;
};

export type SubmitPropertyInterestResponse = {
  message?: string;
  message_en?: string;
  data?: {
    request_id: number;
    property_id: number;
  };
};

/**
 * Submit property interest (no auth required).
 * POST /api/v1/property-requests/interest
 * Backend creates users_property_requests with referral_source = 'property_interest', source = 'website'.
 */
export async function submitPropertyInterest(
  data: SubmitPropertyInterestPayload
): Promise<SubmitPropertyInterestResponse> {
  const res = await axiosInstance.post(
    "/v1/property-requests/interest",
    data,
    { headers: { "Content-Type": "application/json" } }
  );

  const body = res.data as SubmitPropertyInterestResponse;
  return body;
}

/**
 * Helper to get user-friendly error message from API error response.
 */
export function getPropertyInterestErrorMessage(err: any): string {
  const data = err?.response?.data;
  if (data?.message && typeof data.message === "string") {
    return data.message;
  }
  if (data?.errors && typeof data.errors === "object") {
    const firstKey = Object.keys(data.errors)[0];
    const firstMsg = firstKey && Array.isArray(data.errors[firstKey]) ? data.errors[firstKey][0] : null;
    if (firstMsg) return firstMsg;
  }
  return "حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.";
}

/**
 * Extract field-level validation errors from API error response.
 * Returns record of field name -> first error message (e.g. full_name, phone, notes).
 */
export function getPropertyInterestFieldErrors(err: any): Record<string, string> {
  const data = err?.response?.data;
  const out: Record<string, string> = {};
  if (data?.errors && typeof data.errors === "object") {
    for (const key of Object.keys(data.errors)) {
      const val = data.errors[key];
      const msg = Array.isArray(val) ? val[0] : typeof val === "string" ? val : null;
      if (msg) out[key] = msg;
    }
  }
  return out;
}

// --- Property IDs on Property Requests (attach/detach) ---

export interface PropertyRequestWithIds {
  id: number;
  user_id?: number;
  full_name?: string;
  phone?: string;
  property_ids?: number[] | null;
  customer_id?: number | null;
  created_at?: string;
  [key: string]: unknown;
}

export interface AttachPropertiesBody {
  propertyIds: number[];
}

export interface AttachPropertiesResponse {
  status: string;
  message?: string;
  data?: {
    property_request: PropertyRequestWithIds;
  };
}

export interface DetachPropertyResponse {
  status: string;
  message?: string;
  data?: {
    property_request: PropertyRequestWithIds;
  };
}

/**
 * Attach property IDs to a property request (append).
 * PUT /api/v1/property-requests/{requestId}/properties
 */
export async function attachPropertiesToRequest(
  requestId: number,
  propertyIds: number[]
): Promise<PropertyRequestWithIds> {
  const res = await axiosInstance.post<AttachPropertiesResponse>(
    `/v1/property-requests/${requestId}/properties`,
    { propertyIds },
    { headers: { "Content-Type": "application/json" } }
  );
  const data = res.data?.data?.property_request;
  if (!data) throw new Error(res.data?.message || "Failed to attach properties");
  return data;
}

/**
 * Detach one property ID from a property request.
 * DELETE /api/v1/property-requests/{requestId}/properties/{propertyId}
 */
export async function detachPropertyFromRequest(
  requestId: number,
  propertyId: number
): Promise<PropertyRequestWithIds> {
  const res = await axiosInstance.delete<DetachPropertyResponse>(
    `/v1/property-requests/${requestId}/properties/${propertyId}`
  );
  const data = res.data?.data?.property_request;
  if (!data) throw new Error(res.data?.message || "Failed to detach property");
  return data;
}

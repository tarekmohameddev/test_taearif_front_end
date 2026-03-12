/**
 * Property Requests Dashboard API Service
 *
 * @description جميع استدعاءات API الخاصة بـ /dashboard/property-requests مع منع الطلبات المكررة.
 * @see docs/important/prompts/PREVENT_DUPLICATE_API_PROMPT.md
 *
 * @endpoints
 * - GET  /v1/property-requests/filters
 * - GET  /v1/property-requests?params
 * - GET  /v1/property-requests/{id}
 * - POST /v1/property-requests
 * - PUT  /v1/property-requests/{id}
 * - PUT  /v1/property-requests/{id}/status
 * - PUT  /v1/property-requests/customer/{customerId}/employee
 * - DELETE /v1/property-requests/{id}
 * - GET  /v1/employees
 * - GET  /customers
 * - GET  /v1/crm/requests?customer_id=
 * - GET  /crm/stages
 * - PUT  /customers/{id}
 */

import axiosInstance from "@/lib/axiosInstance";

// ─── منع الطلبات المكررة (PREVENT_DUPLICATE_API_PROMPT) ───
const inFlight = new Map<string, Promise<unknown>>();
const cache = new Map<string, { data: unknown; ts: number }>();

function cacheKey(prefix: string, ...parts: (string | number)[]): string {
  return [prefix, ...parts].join(":");
}

async function withDedup<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
  const now = Date.now();
  if (inFlight.has(key)) return inFlight.get(key) as Promise<T>;
  const cached = cache.get(key);
  if (cached != null) return cached.data as T;
  const promise = fetchFn()
    .then((data) => {
      cache.set(key, { data, ts: now });
      inFlight.delete(key);
      return data;
    })
    .catch((err) => {
      inFlight.delete(key);
      throw err;
    });
  inFlight.set(key, promise);
  return promise as Promise<T>;
}

async function withMutationDedup<T>(
  key: string,
  fetchFn: () => Promise<T>
): Promise<T> {
  if (inFlight.has(key)) return inFlight.get(key) as Promise<T>;
  const promise = fetchFn()
    .then((data) => {
      inFlight.delete(key);
      return data;
    })
    .catch((err) => {
      inFlight.delete(key);
      throw err;
    });
  inFlight.set(key, promise);
  return promise as Promise<T>;
}

/** إبطال كاش مفتاح أو كل الكاش (مثلاً بعد create/update/delete). */
export function invalidatePropertyRequestsCache(keyPrefix?: string): void {
  if (keyPrefix == null) {
    cache.clear();
    return;
  }
  for (const k of Array.from(cache.keys())) {
    if (k.startsWith(keyPrefix)) cache.delete(k);
  }
}

// ─── Property Requests ───

export interface FiltersData {
  cities: { id: number; name_ar: string; name_en: string }[];
  districts: { id: number; city_id: number; name_ar: string; name_en: string }[];
  categories: { id: number; name: string; slug: string; icon: string | null }[];
  property_types: string[];
  purchase_goals: string[];
  seriousness_options: string[];
  types?: { id: number; name: string; value: string; icon: string; color: string }[];
  status?: { id: number; name_ar: string; name_en: string }[];
}

export async function getPropertyRequestsFilters(): Promise<FiltersData> {
  const key = "filters";
  return withDedup(key, async () => {
    const res = await axiosInstance.get<{ status: string; data: FiltersData }>(
      "/v1/property-requests/filters"
    );
    return res.data.data;
  });
}

export interface ListParams {
  city_id?: string;
  district_id?: string;
  category_id?: string;
  property_type?: string;
  purchase_goal?: string;
  seriousness?: string;
  responsible_employee_id?: string;
  employee_phone?: string;
  status_id?: string;
  q?: string;
  created_from?: string;
  created_to?: string;
  type_id?: string;
  per_page?: number;
  page?: number;
}

export async function getPropertyRequestsList(params: ListParams) {
  const clean: Record<string, string | number> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") clean[k] = v as string | number;
  }
  const key = "list:" + new URLSearchParams(clean as Record<string, string>).toString();
  return withDedup(key, async () => {
    const res = await axiosInstance.get("/v1/property-requests", {
      params: clean,
    });
    return res.data;
  });
}

export async function getPropertyRequestById(id: string | number) {
  const key = cacheKey("id", String(id));
  return withDedup(key, async () => {
    const res = await axiosInstance.get(`/v1/property-requests/${id}`);
    const data = res.data?.data ?? res.data;
    return data;
  });
}

export async function createPropertyRequest(data: Record<string, unknown>) {
  invalidatePropertyRequestsCache("list:");
  return withMutationDedup("create", async () => {
    const res = await axiosInstance.post("/v1/property-requests", data);
    return res.data;
  });
}

export async function updatePropertyRequest(
  id: number,
  data: Record<string, unknown>
) {
  invalidatePropertyRequestsCache("list:");
  cache.delete(cacheKey("id", String(id)));
  return withMutationDedup(`update:${id}`, async () => {
    const res = await axiosInstance.put(`/v1/property-requests/${id}`, data);
    return res.data;
  });
}

export async function deletePropertyRequest(id: number) {
  invalidatePropertyRequestsCache("list:");
  cache.delete(cacheKey("id", String(id)));
  return withMutationDedup(`delete:${id}`, async () => {
    const res = await axiosInstance.delete(`/v1/property-requests/${id}`);
    return res.data;
  });
}

export async function updatePropertyRequestStatus(
  id: number,
  body: { status_id: number }
) {
  invalidatePropertyRequestsCache("list:");
  cache.delete(cacheKey("id", String(id)));
  return withMutationDedup(`status:${id}`, async () => {
    const res = await axiosInstance.put(
      `/v1/property-requests/${id}/status`,
      body
    );
    return res.data;
  });
}

export async function assignPropertyRequestEmployee(
  customerId: number,
  body: { responsible_employee_id: number | null }
) {
  invalidatePropertyRequestsCache("list:");
  return withMutationDedup(`employee:${customerId}`, async () => {
    const res = await axiosInstance.put(
      `/v1/property-requests/customer/${customerId}/employee`,
      body
    );
    return res.data;
  });
}

// ─── Employees (للنوافذ المستخدمة في property-requests) ───

export async function getEmployees(): Promise<unknown[]> {
  const key = "employees";
  return withDedup(key, async () => {
    const res = await axiosInstance.get("/v1/employees");
    const d = res.data?.data ?? res.data;
    return Array.isArray(d) ? d : [];
  });
}

// ─── Customers & CRM (جدول الطلبات ونافذة تعيين المرحلة) ───

export async function getCustomers() {
  const key = "customers";
  return withDedup(key, async () => {
    const res = await axiosInstance.get("/customers");
    return res.data;
  });
}

export async function getCrmRequestsByCustomer(customerId: number) {
  const key = cacheKey("crm-requests", customerId);
  return withDedup(key, async () => {
    const res = await axiosInstance.get(
      `/v1/crm/requests?customer_id=${customerId}`
    );
    return res.data;
  });
}

export async function getCrmStages(): Promise<{ id: number; stage_name: string; color: string | null; icon: string | null; description: string | null; order: number }[]> {
  const key = "crm-stages";
  return withDedup(key, async () => {
    const res = await axiosInstance.get("/crm/stages");
    if (res.data?.status === "success" && Array.isArray(res.data.data)) {
      return res.data.data.sort(
        (a: { order: number }, b: { order: number }) => a.order - b.order
      );
    }
    return [];
  });
}

export async function updateCustomerStage(
  customerId: number,
  body: { stage_id: number }
) {
  cache.delete("customers");
  return withMutationDedup(`customer-stage:${customerId}`, async () => {
    const res = await axiosInstance.put(`/customers/${customerId}`, body);
    return res.data;
  });
}

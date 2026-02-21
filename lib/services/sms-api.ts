/**
 * SMS API — campaigns, templates, logs, stats
 * Base: /api/v1/sms (backend).
 * All requests use @/lib/axiosInstance (Bearer token from AuthStore).
 */
import axiosInstance from "@/lib/axiosInstance";

const BASE = "/v1/sms";

function getData<T>(res: { data?: { status?: string | boolean; data?: T }; status: number }): T {
  const body = res.data;
  if (body?.status === "error" || (res.status >= 400)) {
    const msg = (body as { message?: string })?.message ?? "Request failed";
    throw new Error(msg);
  }
  return (body?.data ?? body) as T;
}

// --- Campaigns ---

export interface CampaignListParams {
  per_page?: number;
  page?: number;
}

export interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

/** Backend campaign (snake_case). Map to UI type in component. */
export interface ApiCampaign {
  id: number;
  name: string;
  description?: string | null;
  message: string;
  status: "draft" | "scheduled" | "sent" | "in_progress";
  recipient_count: number;
  sent_count: number;
  delivered_count: number;
  failed_count: number;
  scheduled_at?: string | null;
  sent_at?: string | null;
  created_at: string;
  updated_at?: string;
  created_by?: string | null;
  tags?: string[] | null;
}

export interface CampaignListResponse {
  campaigns: ApiCampaign[];
  pagination: Pagination;
}

/** Laravel-style list: { data: [], current_page, per_page, total, last_page } */
interface LaravelPaginatedData<T> {
  data?: T[];
  current_page?: number;
  per_page?: number;
  total?: number;
  last_page?: number;
}

export async function getCampaigns(params?: CampaignListParams): Promise<CampaignListResponse> {
  const q = new URLSearchParams();
  if (params?.per_page != null) q.set("per_page", String(params.per_page));
  if (params?.page != null) q.set("page", String(params.page));
  const res = await axiosInstance.get(`${BASE}/campaigns?${q}`);
  const raw = getData<LaravelPaginatedData<ApiCampaign>>(res);
  const list = raw?.data ?? [];
  return {
    campaigns: Array.isArray(list) ? list : [],
    pagination: {
      current_page: raw?.current_page ?? 1,
      per_page: raw?.per_page ?? 20,
      total: raw?.total ?? 0,
      last_page: raw?.last_page ?? 1,
    },
  };
}

export async function getCampaign(id: number): Promise<ApiCampaign> {
  const res = await axiosInstance.get(`${BASE}/campaigns/${id}`);
  return getData<ApiCampaign>(res);
}

export interface CreateCampaignBody {
  name: string;
  description?: string;
  message: string;
  status?: "draft" | "scheduled";
  scheduled_at?: string;
  recipient_ids?: number[];
  segment_filters?: Record<string, unknown>;
  tags?: string[];
}

export async function createCampaign(body: CreateCampaignBody): Promise<ApiCampaign> {
  const res = await axiosInstance.post(`${BASE}/campaigns`, body);
  return getData<ApiCampaign>(res);
}

export interface UpdateCampaignBody {
  name?: string;
  description?: string;
  message?: string;
  status?: "draft" | "scheduled";
  scheduled_at?: string | null;
  tags?: string[];
}

export async function updateCampaign(id: number, body: UpdateCampaignBody): Promise<ApiCampaign> {
  const res = await axiosInstance.patch(`${BASE}/campaigns/${id}`, body);
  return getData<ApiCampaign>(res);
}

export async function deleteCampaign(id: number): Promise<void> {
  const res = await axiosInstance.delete(`${BASE}/campaigns/${id}`);
  getData<unknown>(res);
}

/** Trigger send (now or scheduled). Sends Idempotency-Key to avoid duplicate charges. */
export async function sendCampaign(id: number): Promise<{ message?: string }> {
  const res = await axiosInstance.post(`${BASE}/campaigns/${id}/send`, {}, {
    headers: { "Idempotency-Key": crypto.randomUUID() },
  });
  return getData<{ message?: string }>(res);
}

// --- Templates ---

/** Backend template (snake_case). */
export interface ApiTemplate {
  id: number;
  name: string;
  content: string;
  category: string;
  variables: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TemplateListResponse {
  templates?: ApiTemplate[];
  data?: ApiTemplate[];
  pagination?: Pagination;
}

export async function getTemplates(params?: { per_page?: number; page?: number }): Promise<{
  templates: ApiTemplate[];
  pagination?: Pagination;
}> {
  const q = new URLSearchParams();
  if (params?.per_page != null) q.set("per_page", String(params.per_page));
  if (params?.page != null) q.set("page", String(params.page));
  const res = await axiosInstance.get(`${BASE}/templates?${q}`);
  const data = getData<TemplateListResponse>(res);
  const templates = data.templates ?? (data as unknown as { data?: ApiTemplate[] }).data ?? [];
  return {
    templates: Array.isArray(templates) ? templates : [],
    pagination: data.pagination,
  };
}

export async function getTemplate(id: number): Promise<ApiTemplate> {
  const res = await axiosInstance.get(`${BASE}/templates/${id}`);
  return getData<ApiTemplate>(res);
}

export interface CreateTemplateBody {
  name: string;
  content: string;
  category: string;
  variables?: string[];
  is_active?: boolean;
}

export async function createTemplate(body: CreateTemplateBody): Promise<ApiTemplate> {
  const res = await axiosInstance.post(`${BASE}/templates`, body);
  return getData<ApiTemplate>(res);
}

export interface UpdateTemplateBody {
  name?: string;
  content?: string;
  category?: string;
  variables?: string[];
  is_active?: boolean;
}

export async function updateTemplate(id: number, body: UpdateTemplateBody): Promise<ApiTemplate> {
  const res = await axiosInstance.patch(`${BASE}/templates/${id}`, body);
  return getData<ApiTemplate>(res);
}

export async function deleteTemplate(id: number): Promise<void> {
  const res = await axiosInstance.delete(`${BASE}/templates/${id}`);
  getData<unknown>(res);
}

// --- Logs ---

export interface ApiSmsLog {
  id: number | string;
  campaign_id?: number;
  campaign_name?: string;
  contact_id?: number | string;
  contact_name?: string;
  phone: string;
  message: string;
  status: "sent" | "delivered" | "failed" | "pending";
  sent_at: string;
  delivered_at?: string | null;
  error_message?: string | null;
}

export interface LogsListResponse {
  logs: ApiSmsLog[];
  pagination: Pagination;
}

export async function getLogs(params?: {
  per_page?: number;
  page?: number;
  campaign_id?: number;
  status?: string;
}): Promise<LogsListResponse> {
  const q = new URLSearchParams();
  if (params?.per_page != null) q.set("per_page", String(params.per_page));
  if (params?.page != null) q.set("page", String(params.page));
  if (params?.campaign_id != null) q.set("campaign_id", String(params.campaign_id));
  if (params?.status) q.set("status", params.status);
  const res = await axiosInstance.get(`${BASE}/logs?${q}`);
  const data = getData<LogsListResponse>(res);
  return {
    logs: data.logs ?? [],
    pagination: data.pagination ?? { current_page: 1, per_page: 20, total: 0, last_page: 1 },
  };
}

// --- Stats ---

export interface ApiSmsStats {
  total_campaigns: number;
  total_sent: number;
  total_delivered: number;
  total_failed: number;
  delivery_rate: number;
  this_month_sent?: number;
}

export async function getStats(): Promise<ApiSmsStats> {
  const res = await axiosInstance.get(`${BASE}/stats`);
  const data = getData<ApiSmsStats>(res);
  return {
    total_campaigns: data.total_campaigns ?? 0,
    total_sent: data.total_sent ?? 0,
    total_delivered: data.total_delivered ?? 0,
    total_failed: data.total_failed ?? 0,
    delivery_rate: data.delivery_rate ?? 0,
    this_month_sent: data.this_month_sent ?? 0,
  };
}

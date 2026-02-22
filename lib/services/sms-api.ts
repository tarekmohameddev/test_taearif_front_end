/**
 * SMS API — campaigns, templates, logs, stats
 * Base: /api/v1/sms (backend).
 * All requests use @/lib/axiosInstance (Bearer token from AuthStore).
 */
import axiosInstance from "@/lib/axiosInstance";

const BASE = "/v1/sms";

function getData<T>(res: { data?: { status?: string | boolean; data?: T; message?: string }; status: number }): T {
  const body = res.data;
  const msg = (body as { message?: string })?.message ?? "Request failed";
  if (body?.status === "error" || body?.status === false || (res.status >= 400)) {
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
  user_id?: number;
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
  creator_display?: { id?: number; type?: string; company_name?: string } | null;
  user?: { id?: number; basic_setting?: { company_name?: string } } | null;
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
  message: string;
  description?: string;
  template_id?: number | null;
  status?: "draft" | "scheduled";
  scheduled_at?: string;
  recipient_ids?: number[];
  segment_filters?: Record<string, unknown>;
  tags?: string[];
  meta?: Record<string, unknown>;
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

/** Body for send campaign: at least one of customer_ids or manual_phones must be present and non-empty. */
export interface SendCampaignBody {
  customer_ids?: number[];
  manual_phones?: string[];
}

/** Trigger send (now or scheduled). Sends Idempotency-Key to avoid duplicate charges. */
export async function sendCampaign(id: number, body: SendCampaignBody): Promise<{ message?: string }> {
  const res = await axiosInstance.post(`${BASE}/campaigns/${id}/send`, body, {
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

/** Raw log item from API (Laravel: recipient_phone, recipient_name, customer_id). */
export interface RawApiSmsLogItem {
  id: number;
  campaign_id?: number;
  customer_id?: number;
  recipient_phone?: string;
  recipient_name?: string;
  message?: string;
  status?: string;
  sent_at?: string | null;
  delivered_at?: string | null;
  error_message?: string | null;
  created_at?: string;
  [key: string]: unknown;
}

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

/** Normalize Laravel log item (recipient_*) to ApiSmsLog (phone, contact_name, contact_id). */
function normalizeLogItem(item: RawApiSmsLogItem): ApiSmsLog {
  return {
    id: item.id,
    campaign_id: item.campaign_id,
    campaign_name: undefined,
    contact_id: item.customer_id,
    contact_name: item.recipient_name ?? "",
    phone: item.recipient_phone ?? "",
    message: item.message ?? "",
    status: (item.status as ApiSmsLog["status"]) ?? "pending",
    sent_at: item.sent_at ?? "",
    delivered_at: item.delivered_at ?? null,
    error_message: item.error_message ?? null,
  };
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
  const raw = getData<LaravelPaginatedData<RawApiSmsLogItem>>(res);
  const list = raw?.data ?? [];
  const logs = Array.isArray(list) ? list.map(normalizeLogItem) : [];
  return {
    logs,
    pagination: {
      current_page: raw?.current_page ?? 1,
      per_page: raw?.per_page ?? 20,
      total: raw?.total ?? 0,
      last_page: raw?.last_page ?? 1,
    },
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

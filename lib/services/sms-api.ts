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

// --- In-flight request deduplication (PREVENT_DUPLICATE_API) ---
const inFlight = new Map<string, Promise<unknown>>();

function dedupeByKey<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const existing = inFlight.get(key);
  if (existing) return existing as Promise<T>;
  const promise = fn().finally(() => inFlight.delete(key));
  inFlight.set(key, promise);
  return promise;
}

function campaignsListKey(params?: CampaignListParams): string {
  if (!params) return "sms-campaigns:{}";
  const sorted: Record<string, unknown> = {};
  (Object.keys(params) as (keyof CampaignListParams)[])
    .sort()
    .forEach((k) => {
      const v = params[k];
      if (v !== undefined) sorted[k as string] = v;
    });
  return `sms-campaigns:${JSON.stringify(sorted)}`;
}

function templatesListKey(params?: { per_page?: number; page?: number }): string {
  if (!params) return "sms-templates:{}";
  const sorted: Record<string, unknown> = {};
  (Object.keys(params) as (keyof { per_page?: number; page?: number })[])
    .sort()
    .forEach((k) => {
      const v = params[k];
      if (v !== undefined) sorted[k as string] = v;
    });
  return `sms-templates:${JSON.stringify(sorted)}`;
}

function logsListKey(params?: {
  per_page?: number;
  page?: number;
  campaign_id?: number;
  status?: string;
}): string {
  if (!params) return "sms-logs:{}";
  const sorted: Record<string, unknown> = {};
  (Object.keys(params) as (keyof typeof params)[])
    .sort()
    .forEach((k) => {
      const v = params[k];
      if (v !== undefined) sorted[k as string] = v;
    });
  return `sms-logs:${JSON.stringify(sorted)}`;
}

/** Extract user-facing error message from SMS API error (Axios or thrown Error). */
export function getSmsApiErrorMessage(error: unknown): string {
  const err = error as {
    response?: { data?: SmsApiErrorBody; status?: number };
    message?: string;
  };
  const data = err?.response?.data;
  if (data?.message && typeof data.message === "string") return data.message;
  if (data?.errors && typeof data.errors === "object") {
    const first = Object.values(data.errors).flat()[0];
    if (typeof first === "string") return first;
  }
  if (err?.message && typeof err.message === "string") return err.message;
  return "Request failed";
}

// --- Campaigns ---

export interface CampaignListParams {
  per_page?: number;
  page?: number;
  /** Filter by status (e.g. paused, in_progress) */
  status?: string;
}

export interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

/** Backend campaign status (snake_case). */
export type ApiCampaignStatus =
  | "draft"
  | "scheduled"
  | "in_progress"
  | "paused"
  | "sent"
  | "failed"
  | "cancelled";

/** Backend campaign (snake_case). Map to UI type in component. */
export interface ApiCampaign {
  id: number;
  user_id?: number;
  name: string;
  description?: string | null;
  message: string;
  status: ApiCampaignStatus;
  recipient_count: number;
  sent_count: number;
  delivered_count: number;
  failed_count: number;
  reserved_credits?: number | null;
  paused_count?: number | null;
  scheduled_at?: string | null;
  sent_at?: string | null;
  created_at: string;
  updated_at?: string;
  created_by?: string | null;
  tags?: string[] | null;
  creator_display?: { id?: number; type?: string; company_name?: string } | null;
  user?: { id?: number; basic_setting?: { company_name?: string } } | null;
}

/** Credit info returned by pause/resume endpoints. */
export interface SmsCreditInfo {
  consumed?: number;
  released?: number;
  reserved?: number;
  balance_after_release?: number;
  balance_after_reserve?: number;
  note?: string;
}

/** Response from POST /sms/campaigns/{id}/pause (200). */
export interface PauseCampaignResponse {
  campaign_id: number;
  status: "paused";
  sent_count: number;
  paused_count: number;
  credit_info: SmsCreditInfo;
}

/** Response from POST /sms/campaigns/{id}/resume (202). */
export interface ResumeCampaignResponse {
  campaign_id: number;
  status: "in_progress";
  mode: "continue" | "restart";
  recipient_count: number;
  credit_info: SmsCreditInfo;
}

/** API error body for SMS endpoints (4xx). */
export interface SmsApiErrorBody {
  status?: boolean;
  code?: string;
  message?: string;
  errors?: Record<string, string[]>;
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
  const key = campaignsListKey(params);
  return dedupeByKey(key, async () => {
    const q = new URLSearchParams();
    if (params?.per_page != null) q.set("per_page", String(params.per_page));
    if (params?.page != null) q.set("page", String(params.page));
    if (params?.status) q.set("status", params.status);
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
  });
}

export async function getCampaign(id: number): Promise<ApiCampaign> {
  return dedupeByKey(`sms-campaign:${id}`, async () => {
    const res = await axiosInstance.get(`${BASE}/campaigns/${id}`);
    return getData<ApiCampaign>(res);
  });
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

/** Body for resume: mode required; customer_ids/manual_phones optional for restart only. */
export interface ResumeCampaignBody {
  mode: "continue" | "restart";
  customer_ids?: number[];
  manual_phones?: string[];
}

/**
 * Pause an in_progress or scheduled campaign. Returns credit_info; reserved credits are released.
 * Throws on 404 (campaign not found) or 422 (invalid status).
 */
export async function pauseCampaign(id: number): Promise<PauseCampaignResponse> {
  const res = await axiosInstance.post(`${BASE}/campaigns/${id}/pause`, {});
  return getData<PauseCampaignResponse>(res);
}

/**
 * Resume a paused campaign. Requires Idempotency-Key header (unique per distinct action).
 * Use a new key for each user action; same key only when retrying the exact same request.
 * Throws on 400 (insufficient credits), 404, 409 (idempotency conflict), 422.
 */
export async function resumeCampaign(
  id: number,
  body: ResumeCampaignBody,
  idempotencyKey: string
): Promise<ResumeCampaignResponse> {
  const res = await axiosInstance.post(`${BASE}/campaigns/${id}/resume`, body, {
    headers: { "Idempotency-Key": idempotencyKey },
  });
  return getData<ResumeCampaignResponse>(res);
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
  const key = templatesListKey(params);
  return dedupeByKey(key, async () => {
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
  });
}

export async function getTemplate(id: number): Promise<ApiTemplate> {
  return dedupeByKey(`sms-template:${id}`, async () => {
    const res = await axiosInstance.get(`${BASE}/templates/${id}`);
    return getData<ApiTemplate>(res);
  });
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
  const key = logsListKey(params);
  return dedupeByKey(key, async () => {
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
  });
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
  return dedupeByKey("sms-stats", async () => {
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
  });
}

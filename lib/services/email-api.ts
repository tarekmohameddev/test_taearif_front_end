/**
 * Email API — templates, campaigns, send, logs, stats
 * Matches: Frontend Email API Reference
 * Base path: /api/v1/email (relative to axios baseURL, e.g. {API_BASE}/api).
 * Auth: Bearer token (Sanctum). All endpoints require authentication except webhook.
 */
import axiosInstance from "@/lib/axiosInstance";

const BASE = "/v1/email";

function getData<T>(res: { data?: { status?: string | boolean; data?: T; message?: string }; status: number }): T {
  const body = res.data;
  const msg = (body as { message?: string })?.message ?? "Request failed";
  if (body?.status === "error" || body?.status === false || (res.status >= 400)) {
    throw new Error(msg);
  }
  return (body?.data ?? body) as T;
}

/**
 * Extract Laravel paginator from API response.
 * Response shape: { status: true, data: { current_page, data: [], last_page, per_page, total, ... } }
 */
function getPaginator<T>(res: { data?: { status?: boolean; data?: { data?: T[]; current_page?: number; last_page?: number; per_page?: number; total?: number } } }): { data: T[]; current_page: number; last_page: number; per_page: number; total: number } {
  const body = res?.data;
  if (!body) {
    return { data: [], current_page: 1, last_page: 1, per_page: 20, total: 0 };
  }
  // Backend: { status: true, data: { current_page, data: [...], last_page, per_page, total } }
  const paginator = body?.data != null && typeof body.data === "object" ? body.data : body;
  const list = Array.isArray(paginator?.data) ? paginator.data : [];
  const total = Number(paginator?.total) || 0;
  const perPage = Number(paginator?.per_page) || 20;
  const currentPage = Number(paginator?.current_page) || 1;
  const lastPage = Number(paginator?.last_page) || Math.max(1, Math.ceil(total / perPage));
  return {
    data: list,
    current_page: currentPage,
    last_page: lastPage,
    per_page: perPage,
    total,
  };
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

function templatesListKey(params?: TemplateListParams): string {
  if (!params) return "email-templates:{}";
  const sorted: Record<string, unknown> = {};
  (Object.keys(params) as (keyof TemplateListParams)[])
    .sort()
    .forEach((k) => {
      const v = params[k];
      if (v !== undefined) sorted[k as string] = v;
    });
  return `email-templates:${JSON.stringify(sorted)}`;
}

function campaignsListKey(params?: CampaignListParams): string {
  if (!params) return "email-campaigns:{}";
  const sorted: Record<string, unknown> = {};
  (Object.keys(params) as (keyof CampaignListParams)[])
    .sort()
    .forEach((k) => {
      const v = params[k];
      if (v !== undefined) sorted[k as string] = v;
    });
  return `email-campaigns:${JSON.stringify(sorted)}`;
}

function logsListKey(params?: LogsListParams): string {
  if (!params) return "email-logs:{}";
  const sorted: Record<string, unknown> = {};
  (Object.keys(params) as (keyof LogsListParams)[])
    .sort()
    .forEach((k) => {
      const v = params[k];
      if (v !== undefined) sorted[k as string] = v;
    });
  return `email-logs:${JSON.stringify(sorted)}`;
}

/** Extract user-facing error message from Email API error. */
export function getEmailApiErrorMessage(error: unknown): string {
  const err = error as {
    response?: { data?: EmailApiErrorBody; status?: number };
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

// --- Templates (API: subject, body_html, body_text) ---

export interface ApiTemplate {
  id: number;
  user_id?: number;
  name: string;
  subject: string;
  body_html: string;
  body_text: string | null;
  is_active: boolean;
  meta: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface TemplateListParams {
  per_page?: number;
  page?: number;
  is_active?: 0 | 1;
}

/** GET /api/v1/email/templates?per_page=20&is_active=1 — Response: { status, data: { current_page, data: [], per_page, total } } */
export async function getTemplates(params?: TemplateListParams): Promise<{
  templates: ApiTemplate[];
  pagination: { current_page: number; per_page: number; total: number; last_page: number };
}> {
  const key = templatesListKey(params);
  return dedupeByKey(key, async () => {
    const q = new URLSearchParams();
    if (params?.per_page != null) q.set("per_page", String(params.per_page));
    if (params?.page != null) q.set("page", String(params.page));
    if (params?.is_active != null) q.set("is_active", String(params.is_active));
    const res = await axiosInstance.get(`${BASE}/templates?${q}`);
    const paginator = getPaginator<ApiTemplate>(res);
    return {
      templates: paginator.data,
      pagination: {
        current_page: paginator.current_page,
        per_page: paginator.per_page,
        total: paginator.total,
        last_page: paginator.last_page,
      },
    };
  });
}

export async function getTemplate(id: number): Promise<ApiTemplate> {
  return dedupeByKey(`email-template:${id}`, async () => {
    const res = await axiosInstance.get(`${BASE}/templates/${id}`);
    return getData<ApiTemplate>(res);
  });
}

export interface CreateTemplateBody {
  name: string;
  subject: string;
  body_html: string;
  body_text?: string;
  is_active?: boolean;
  meta?: Record<string, unknown>;
}

export async function createTemplate(body: CreateTemplateBody): Promise<ApiTemplate> {
  const res = await axiosInstance.post(`${BASE}/templates`, body);
  return getData<ApiTemplate>(res);
}

export interface UpdateTemplateBody {
  name?: string;
  subject?: string;
  body_html?: string;
  body_text?: string;
  is_active?: boolean;
  meta?: Record<string, unknown>;
}

export async function updateTemplate(id: number, body: UpdateTemplateBody): Promise<ApiTemplate> {
  const res = await axiosInstance.patch(`${BASE}/templates/${id}`, body);
  return getData<ApiTemplate>(res);
}

export async function deleteTemplate(id: number): Promise<void> {
  const res = await axiosInstance.delete(`${BASE}/templates/${id}`);
  getData<unknown>(res);
}

// --- Campaigns (API: subject, body_html, body_text) ---

export interface CampaignListParams {
  per_page?: number;
  page?: number;
  status?: string;
}

export interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export type ApiCampaignStatus =
  | "draft"
  | "scheduled"
  | "in_progress"
  | "paused"
  | "sent"
  | "failed"
  | "cancelled";

/** Campaign item as returned by GET /v1/email/campaigns (exact API shape) */
export interface ApiCampaign {
  id: number;
  user_id?: number;
  created_by_user_id?: number;
  name: string;
  description?: string | null;
  subject: string;
  body_html: string;
  body_text?: string | null;
  template_id?: number | null;
  status: ApiCampaignStatus;
  scheduled_at?: string | null;
  sent_at?: string | null;
  dispatch_reference?: string | null;
  recipient_count: number;
  sent_count: number;
  delivered_count: number;
  failed_count: number;
  reserved_credits?: number | null;
  meta?: Record<string, unknown> | null;
  created_at: string;
  updated_at?: string | null;
  creator_display?: { id?: number; type?: string; company_name?: string } | null;
  template?: unknown;
  creator?: { id?: number; first_name?: string; last_name?: string; basic_setting?: { company_name?: string } } | null;
  user?: { id?: number; basic_setting?: { company_name?: string } } | null;
  [key: string]: unknown;
}

export interface EmailCreditInfo {
  consumed?: number;
  released?: number;
  reserved?: number;
  balance_after_release?: number;
  balance_after_reserve?: number;
  note?: string;
}

export interface PauseCampaignResponse {
  campaign_id: number;
  status: "paused";
  sent_count: number;
  paused_count: number;
  credit_info?: EmailCreditInfo;
}

export interface ResumeCampaignResponse {
  campaign_id: number;
  status: "in_progress";
  mode: "continue" | "restart";
  recipient_count: number;
  credit_info?: EmailCreditInfo;
}

/** API error body. Codes: TEMPLATE_NOT_FOUND, CAMPAIGN_NOT_FOUND (404), INSUFFICIENT_CREDITS (400), 409 idempotency, 422 validation. */
export interface EmailApiErrorBody {
  status?: boolean;
  code?: string;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface CampaignListResponse {
  campaigns: ApiCampaign[];
  pagination: Pagination;
}

export async function getCampaigns(params?: CampaignListParams): Promise<CampaignListResponse> {
  const key = campaignsListKey(params);
  return dedupeByKey(key, async () => {
    const q = new URLSearchParams();
    if (params?.per_page != null) q.set("per_page", String(params.per_page));
    if (params?.page != null) q.set("page", String(params.page));
    if (params?.status) q.set("status", params.status);
    const res = await axiosInstance.get(`${BASE}/campaigns?${q}`);
    const paginator = getPaginator<ApiCampaign>(res);
    return {
      campaigns: paginator.data,
      pagination: {
        current_page: paginator.current_page,
        per_page: paginator.per_page,
        total: paginator.total,
        last_page: paginator.last_page,
      },
    };
  });
}

export async function getCampaign(id: number): Promise<ApiCampaign> {
  return dedupeByKey(`email-campaign:${id}`, async () => {
    const res = await axiosInstance.get(`${BASE}/campaigns/${id}`);
    return getData<ApiCampaign>(res);
  });
}

export interface CreateCampaignBody {
  name: string;
  subject: string;
  body_html: string;
  body_text?: string;
  description?: string;
  template_id?: number | null;
  status?: "draft" | "scheduled";
  scheduled_at?: string;
  recipient_ids?: number[];
  tags?: string[];
  meta?: Record<string, unknown>;
}

export async function createCampaign(body: CreateCampaignBody): Promise<ApiCampaign> {
  const res = await axiosInstance.post(`${BASE}/campaigns`, body);
  return getData<ApiCampaign>(res);
}

export interface UpdateCampaignBody {
  name?: string;
  subject?: string;
  body_html?: string;
  body_text?: string;
  description?: string;
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

/** POST /api/v1/email/campaigns/{id}/send — Idempotency-Key required. Body: customer_ids, manual_emails. Returns 202. */
export interface SendCampaignBody {
  customer_ids?: number[];
  manual_emails?: string[];
}

export async function sendCampaign(id: number, body: SendCampaignBody): Promise<{ message?: string; campaign_id?: number; status?: string; recipient_count?: number; dispatch_reference?: string; scheduled_at?: string }> {
  const res = await axiosInstance.post(`${BASE}/campaigns/${id}/send`, body, {
    headers: { "Idempotency-Key": crypto.randomUUID() },
  });
  return getData(res);
}

export interface ResumeCampaignBody {
  mode: "continue" | "restart";
  customer_ids?: number[];
  manual_emails?: string[];
}

export async function pauseCampaign(id: number): Promise<PauseCampaignResponse> {
  const res = await axiosInstance.post(`${BASE}/campaigns/${id}/pause`, {});
  return getData<PauseCampaignResponse>(res);
}

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

// --- Single message send (transactional) ---

export interface SendSingleMessageBody {
  to_email: string;
  subject: string;
  body_html: string;
  body_text?: string;
}

/** POST /api/v1/email/messages/send — Idempotency-Key required. Single transactional email. */
export async function sendSingleMessage(body: SendSingleMessageBody): Promise<unknown> {
  const res = await axiosInstance.post(`${BASE}/messages/send`, body, {
    headers: { "Idempotency-Key": crypto.randomUUID() },
  });
  return getData(res);
}

// --- Logs (API: recipient_email, subject, status, sent_at, delivered_at, error_message) ---

export interface ApiEmailLogItem {
  id: number | string;
  campaign_id?: number;
  campaign_name?: string;
  recipient_email?: string;
  recipient_name?: string;
  subject?: string;
  message?: string;
  status?: string;
  gateway_message_id?: string;
  sent_at?: string | null;
  delivered_at?: string | null;
  error_message?: string | null;
  created_at?: string;
  [key: string]: unknown;
}

export interface ApiEmailLog {
  id: string;
  campaign_id?: number;
  campaign_name?: string;
  recipient_email: string;
  recipient_name?: string;
  subject: string;
  message: string;
  status: string;
  sent_at: string;
  delivered_at?: string | null;
  error_message?: string | null;
}

export interface LogsListParams {
  per_page?: number;
  page?: number;
  campaign_id?: number;
  status?: string;
  from_date?: string;
  to_date?: string;
}

export interface LogsListResponse {
  logs: ApiEmailLog[];
  pagination: Pagination;
}

function normalizeLogItem(item: ApiEmailLogItem): ApiEmailLog {
  return {
    id: String(item.id),
    campaign_id: item.campaign_id,
    campaign_name: item.campaign_name as string | undefined,
    recipient_email: item.recipient_email ?? "",
    recipient_name: item.recipient_name as string | undefined,
    subject: item.subject ?? "",
    message: item.message ?? "",
    status: item.status ?? "pending",
    sent_at: item.sent_at ?? "",
    delivered_at: item.delivered_at ?? null,
    error_message: item.error_message ?? null,
  };
}

/** GET /api/v1/email/logs?per_page=20&campaign_id=1&status=sent&from_date=Y-m-d&to_date=Y-m-d */
export async function getLogs(params?: LogsListParams): Promise<LogsListResponse> {
  const key = logsListKey(params);
  return dedupeByKey(key, async () => {
    const q = new URLSearchParams();
    if (params?.per_page != null) q.set("per_page", String(params.per_page));
    if (params?.page != null) q.set("page", String(params.page));
    if (params?.campaign_id != null) q.set("campaign_id", String(params.campaign_id));
    if (params?.status) q.set("status", params.status);
    if (params?.from_date) q.set("from_date", params.from_date);
    if (params?.to_date) q.set("to_date", params.to_date);
    const res = await axiosInstance.get(`${BASE}/logs?${q}`);
    const paginator = getPaginator<ApiEmailLogItem>(res);
    const logs = paginator.data.map(normalizeLogItem);
    return {
      logs,
      pagination: {
        current_page: paginator.current_page,
        per_page: paginator.per_page,
        total: paginator.total,
        last_page: paginator.last_page,
      },
    };
  });
}

// --- Stats ---

export interface ApiEmailStats {
  total_campaigns: number;
  total_sent: number;
  total_delivered: number;
  total_failed: number;
  delivery_rate: number;
  this_month_sent?: number;
}

export async function getStats(): Promise<ApiEmailStats> {
  return dedupeByKey("email-stats", async () => {
    const res = await axiosInstance.get(`${BASE}/stats`);
    const data = getData<ApiEmailStats>(res);
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

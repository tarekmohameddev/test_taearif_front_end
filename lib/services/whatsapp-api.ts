/**
 * WhatsApp API — numbers, campaigns (CRUD, send, pause, resume).
 * Base: /api/v1/whatsapp (backend).
 * Follows docs/backend/communication/whatsapp/wa-campaign-send-workflow-AI.md
 * All requests use @/lib/axiosInstance (Bearer token).
 */
import axiosInstance from "@/lib/axiosInstance";

const BASE = "/v1/whatsapp";

function getData<T>(
  res: { data?: { status?: string | boolean; data?: T; message?: string }; status: number }
): T {
  const body = res.data;
  const msg = (body as { message?: string })?.message ?? "Request failed";
  if (
    body?.status === "error" ||
    body?.status === false ||
    (res.status >= 400)
  ) {
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

function numbersListKey(params?: GetWhatsAppNumbersParams): string {
  if (!params) return "numbers:{}";
  const sorted: Record<string, unknown> = {};
  (Object.keys(params) as (keyof GetWhatsAppNumbersParams)[])
    .sort()
    .forEach((k) => {
      const v = params[k];
      if (v !== undefined) sorted[k as string] = v;
    });
  return `numbers:${JSON.stringify(sorted)}`;
}

function campaignsListKey(params?: CampaignListParams): string {
  if (!params) return "campaigns:{}";
  const sorted: Record<string, unknown> = {};
  (Object.keys(params) as (keyof CampaignListParams)[])
    .sort()
    .forEach((k) => {
      const v = params[k];
      if (v !== undefined) sorted[k as string] = v;
    });
  return `campaigns:${JSON.stringify(sorted)}`;
}

function waTemplatesListKey(params?: { per_page?: number; page?: number }): string {
  if (!params) return "wa-templates:{}";
  const sorted: Record<string, unknown> = {};
  (Object.keys(params) as (keyof { per_page?: number; page?: number })[])
    .sort()
    .forEach((k) => {
      const v = params[k];
      if (v !== undefined) sorted[k as string] = v;
    });
  return `wa-templates:${JSON.stringify(sorted)}`;
}

/** API error body for WhatsApp endpoints (4xx). */
export interface WhatsAppApiErrorBody {
  status?: boolean;
  code?: string;
  message?: string;
  errors?: Record<string, string[]>;
}

/** Extract user-facing error message from WhatsApp API error. */
export function getWhatsAppApiErrorMessage(error: unknown): string {
  const err = error as {
    response?: { data?: WhatsAppApiErrorBody; status?: number };
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

/** Optional: extract API error code for specific handling (INSUFFICIENT_CREDITS, etc.). */
export function getWhatsAppApiErrorCode(error: unknown): string | undefined {
  const err = error as { response?: { data?: WhatsAppApiErrorBody } };
  return err?.response?.data?.code;
}

// --- Numbers ---

/** Backend number (snake_case). */
export interface ApiWhatsAppNumber {
  id: number;
  phone_number: string;
  name?: string | null;
  status: string;
  provider?: string;
  employee?: { id: number; name: string; email?: string };
}

/** UI-friendly number (camelCase for components/whatsapp-management/types). */
export interface WhatsAppNumberDTO {
  id: number;
  phoneNumber: string;
  name: string | null;
  status: string;
  employee?: { id: number; name: string; email: string };
}

function mapNumberToDTO(n: ApiWhatsAppNumber): WhatsAppNumberDTO {
  return {
    id: n.id,
    phoneNumber: n.phone_number ?? "",
    name: n.name ?? null,
    status: n.status ?? "unknown",
    employee: n.employee
      ? {
          id: n.employee.id,
          name: n.employee.name,
          email: n.employee.email ?? "",
        }
      : undefined,
  };
}

export interface GetWhatsAppNumbersParams {
  per_page?: number;
  status?: string;
}

/** GET /api/v1/whatsapp/numbers */
export async function getWhatsAppNumbers(
  params?: GetWhatsAppNumbersParams
): Promise<WhatsAppNumberDTO[]> {
  const key = numbersListKey(params);
  return dedupeByKey(key, async () => {
    const q = new URLSearchParams();
    if (params?.per_page != null) q.set("per_page", String(params.per_page));
    if (params?.status) q.set("status", params.status);
    const res = await axiosInstance.get(`${BASE}/numbers?${q}`);
    const raw = getData<ApiWhatsAppNumber[] | { data?: ApiWhatsAppNumber[] }>(
      res
    );
    const list = Array.isArray(raw) ? raw : (raw as { data?: ApiWhatsAppNumber[] })?.data ?? [];
    return (list as ApiWhatsAppNumber[]).map(mapNumberToDTO);
  });
}

// --- Campaigns ---

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

export type WaCampaignStatus =
  | "draft"
  | "scheduled"
  | "in_progress"
  | "paused"
  | "sent"
  | "failed"
  | "cancelled";

export interface ApiWaCampaign {
  id: number;
  wa_number_id: number;
  name: string;
  description?: string | null;
  message?: string | null;
  template_id?: number | null;
  meta?: { variables?: Record<string, string> } | null;
  status: WaCampaignStatus;
  recipient_count?: number;
  sent_count?: number;
  delivered_count?: number;
  failed_count?: number;
  scheduled_at?: string | null;
  sent_at?: string | null;
  created_at: string;
  updated_at?: string;
  creator_display?: { id?: number; type?: string; company_name?: string } | null;
}

interface LaravelPaginatedData<T> {
  data?: T[];
  current_page?: number;
  per_page?: number;
  total?: number;
  last_page?: number;
}

export interface WaCampaignListResponse {
  campaigns: ApiWaCampaign[];
  pagination: Pagination;
}

export async function getWaCampaigns(
  params?: CampaignListParams
): Promise<WaCampaignListResponse> {
  const key = campaignsListKey(params);
  return dedupeByKey(key, async () => {
    const q = new URLSearchParams();
    if (params?.per_page != null) q.set("per_page", String(params.per_page));
    if (params?.page != null) q.set("page", String(params.page));
    if (params?.status) q.set("status", params.status);
    const res = await axiosInstance.get(`${BASE}/campaigns?${q}`);
    const raw = getData<LaravelPaginatedData<ApiWaCampaign>>(res);
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

export async function getWaCampaign(id: number): Promise<ApiWaCampaign> {
  return dedupeByKey(`campaign:${id}`, async () => {
    const res = await axiosInstance.get(`${BASE}/campaigns/${id}`);
    return getData<ApiWaCampaign>(res);
  });
}

/** Content contract: exactly one of message or template_id. */
export interface CreateWaCampaignBody {
  wa_number_id: number;
  name: string;
  description?: string;
  status?: "draft" | "scheduled";
  /** Plain message — use this OR template_id, not both. */
  message?: string;
  /** Template ID — use this OR message, not both. */
  template_id?: number;
  /** Optional variables when using template_id. */
  meta?: { variables?: Record<string, string> };
}

export async function createWaCampaign(
  body: CreateWaCampaignBody
): Promise<ApiWaCampaign> {
  const res = await axiosInstance.post(`${BASE}/campaigns`, body);
  return getData<ApiWaCampaign>(res);
}

export interface UpdateWaCampaignBody {
  name?: string;
  description?: string | null;
  status?: "draft" | "scheduled";
  message?: string | null;
  template_id?: number | null;
  meta?: { variables?: Record<string, string> } | null;
}

export async function updateWaCampaign(
  id: number,
  body: UpdateWaCampaignBody
): Promise<ApiWaCampaign> {
  const res = await axiosInstance.patch(`${BASE}/campaigns/${id}`, body);
  return getData<ApiWaCampaign>(res);
}

export async function deleteWaCampaign(id: number): Promise<void> {
  const res = await axiosInstance.delete(`${BASE}/campaigns/${id}`);
  getData<unknown>(res);
}

/** Send body: at least one of customer_ids or manual_phones non-empty. */
export interface SendWaCampaignBody {
  customer_ids?: number[];
  manual_phones?: string[];
}

/** 202 response from POST .../send */
export interface SendWaCampaignResponse {
  campaign_id: number;
  status: string;
  recipient_count: number;
  dispatch_reference?: string;
  queued_at?: string;
  scheduled_at?: string | null;
}

/** Trigger send. Idempotency-Key required; generate once per send intent. */
export async function sendWaCampaign(
  id: number,
  body: SendWaCampaignBody,
  idempotencyKey: string
): Promise<SendWaCampaignResponse> {
  const res = await axiosInstance.post(`${BASE}/campaigns/${id}/send`, body, {
    headers: { "Idempotency-Key": idempotencyKey },
  });
  return getData<SendWaCampaignResponse>(res);
}

/** Credit info from pause/resume. */
export interface WaCreditInfo {
  consumed?: number;
  released?: number;
  reserved?: number;
  balance_after_release?: number;
  balance_after_reserve?: number;
  note?: string;
}

/** 200 response from POST .../pause */
export interface PauseWaCampaignResponse {
  campaign_id: number;
  status: "paused";
  sent_count: number;
  paused_count: number;
  credit_info?: WaCreditInfo;
}

export async function pauseWaCampaign(
  id: number
): Promise<PauseWaCampaignResponse> {
  const res = await axiosInstance.post(`${BASE}/campaigns/${id}/pause`, {});
  return getData<PauseWaCampaignResponse>(res);
}

/** Resume body: mode required; customer_ids/manual_phones for restart only. */
export interface ResumeWaCampaignBody {
  mode: "continue" | "restart";
  customer_ids?: number[];
  manual_phones?: string[];
}

/** 202 response from POST .../resume */
export interface ResumeWaCampaignResponse {
  campaign_id: number;
  status: string;
  mode: "continue" | "restart";
  recipient_count: number;
  credit_info?: WaCreditInfo;
}

export async function resumeWaCampaign(
  id: number,
  body: ResumeWaCampaignBody,
  idempotencyKey: string
): Promise<ResumeWaCampaignResponse> {
  const res = await axiosInstance.post(`${BASE}/campaigns/${id}/resume`, body, {
    headers: { "Idempotency-Key": idempotencyKey },
  });
  return getData<ResumeWaCampaignResponse>(res);
}

// --- Templates (for campaign create: template_id option) ---

export interface ApiWaTemplate {
  id: number;
  name: string;
  content?: string;
  category?: string;
  variables?: string[];
}

/** GET /api/v1/whatsapp/templates — for template_id selection in create campaign. */
export async function getWaTemplates(params?: {
  per_page?: number;
  page?: number;
}): Promise<ApiWaTemplate[]> {
  const key = waTemplatesListKey(params);
  return dedupeByKey(key, async () => {
    const q = new URLSearchParams();
    if (params?.per_page != null) q.set("per_page", String(params.per_page));
    if (params?.page != null) q.set("page", String(params.page));
    const res = await axiosInstance.get(`${BASE}/templates?${q}`);
    const raw = getData<ApiWaTemplate[] | { data?: ApiWaTemplate[] }>(res);
    const list = Array.isArray(raw) ? raw : (raw as { data?: ApiWaTemplate[] })?.data ?? [];
    return (list as ApiWaTemplate[]) ?? [];
  });
}

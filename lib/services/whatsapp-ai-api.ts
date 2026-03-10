/**
 * WhatsApp AI config API — GET/PUT ai/config/{numberId}, PATCH toggle, GET ai/stats.
 * Base: /api/v1/whatsapp (backend). See docs/backend/communication/communication-GUIDE-Frontend.md §3.6
 */
import axiosInstance from "@/lib/axiosInstance";

const BASE = "/v1/whatsapp";

function getData<T>(res: {
  data?: { status?: string | boolean; data?: T; message?: string };
  status: number;
}): T {
  const body = res.data;
  const msg = (body as { message?: string })?.message ?? "Request failed";
  if (
    body?.status === "error" ||
    body?.status === false ||
    res.status >= 400
  ) {
    throw new Error(msg);
  }
  return (body?.data ?? body) as T;
}

/** Backend AI config (snake_case). */
export interface ApiAIConfig {
  id?: string | number | null;
  wa_number_id?: number | null;
  whatsapp_number_id?: number | null;
  enabled?: boolean | null;
  business_hours_only?: boolean | null;
  business_hours?: {
    start?: string | null;
    end?: string | null;
    timezone?: string | null;
  } | null;
  scenarios?: {
    initial_greeting?: boolean | null;
    faq_responses?: boolean | null;
    property_inquiry_response?: boolean | null;
    appointment_booking?: boolean | null;
    general_questions?: boolean | null;
  } | null;
  tone?: "formal" | "friendly" | "professional" | null;
  language?: "ar" | "en" | "both" | null;
  custom_instructions?: string | null;
  fallback_to_human?: boolean | null;
  fallback_delay?: number | null;
  [key: string]: unknown;
}

/** Backend AI stats (snake_case). */
export interface ApiAIStats {
  total_responses_24h?: number | null;
  avg_response_time?: number | null;
  satisfaction_rate?: number | null;
  handoff_rate?: number | null;
  [key: string]: unknown;
}

/** GET /api/v1/whatsapp/ai/config/{numberId} */
export async function getAIConfigApi(
  numberId: number
): Promise<ApiAIConfig | null> {
  const res = await axiosInstance.get(`${BASE}/ai/config/${numberId}`);
  const raw = getData<ApiAIConfig | null>(res);
  return raw ?? null;
}

/** PUT /api/v1/whatsapp/ai/config/{numberId} — create/update. Body in snake_case. */
export async function putAIConfigApi(
  numberId: number,
  body: {
    enabled?: boolean;
    business_hours_only?: boolean;
    business_hours?: { start?: string; end?: string; timezone?: string };
    scenarios?: Record<string, boolean>;
    tone?: string;
    language?: string;
    custom_instructions?: string;
    fallback_to_human?: boolean;
    fallback_delay?: number;
  }
): Promise<ApiAIConfig> {
  const res = await axiosInstance.put(`${BASE}/ai/config/${numberId}`, body);
  return getData<ApiAIConfig>(res);
}

/** PATCH /api/v1/whatsapp/ai/config/{numberId}/toggle — toggle AI on/off. */
export async function patchAIConfigToggleApi(
  numberId: number
): Promise<ApiAIConfig> {
  const res = await axiosInstance.patch(
    `${BASE}/ai/config/${numberId}/toggle`,
    {}
  );
  return getData<ApiAIConfig>(res);
}

/** GET /api/v1/whatsapp/ai/stats — AI usage/stats for tenant. */
export async function getAIStatsApi(): Promise<ApiAIStats> {
  const res = await axiosInstance.get(`${BASE}/ai/stats`);
  return getData<ApiAIStats>(res);
}

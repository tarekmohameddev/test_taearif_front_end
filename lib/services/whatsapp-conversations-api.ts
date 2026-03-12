/**
 * WhatsApp conversations & messages API (backend shapes only).
 * Base: /api/v1/whatsapp (backend) => /v1/whatsapp with axiosInstance.
 *
 * This layer is intentionally backend-oriented (Api* types). Mapping to
 * UI types (Conversation/Message) happens in services/whatsapp-management-api.ts.
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

// --- In-flight request deduplication (PREVENT_DUPLICATE_API) ---
const inFlight = new Map<string, Promise<unknown>>();

function dedupeByKey<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const existing = inFlight.get(key);
  if (existing) return existing as Promise<T>;
  const promise = fn().finally(() => inFlight.delete(key));
  inFlight.set(key, promise);
  return promise;
}

function conversationsListKey(params?: ConversationListParams): string {
  if (!params) return "conversations:{}";
  const sorted: Record<string, unknown> = {};
  (Object.keys(params) as (keyof ConversationListParams)[])
    .sort()
    .forEach((k) => {
      const v = params[k];
      if (v !== undefined) sorted[k as string] = v;
    });
  return `conversations:${JSON.stringify(sorted)}`;
}

// --- Backend types (approximate; keep flexible for mapping layer) ---

export interface ApiConversation {
  id: number | string;
  /** Customer/contact display name, if available. */
  customer_name?: string | null;
  /** Normalized phone, if available. */
  customer_phone?: string | null;
  /** Generic identifier (e.g. WhatsApp phone); used as fallback. */
  external_party_identifier?: string | null;
  /** WhatsApp number id used for this conversation. */
  wa_number_id?: number | null;
  whatsapp_number_id?: number | null;
  /** Text of last message, or preview object. */
  last_message?: string | null;
  last_message_preview?: {
    content?: string | null;
    created_at?: string | null;
  } | null;
  last_message_at?: string | null;
  unread_count?: number | null;
  status?: string | null;
  is_starred?: boolean | null;
  /** Optional assigned agent / owner */
  assigned_agent?: {
    id?: number | string;
    name?: string | null;
    avatar_url?: string | null;
  } | null;
  /** Timestamps */
  created_at?: string;
  updated_at?: string;
}

export interface ApiMessageAttachment {
  id?: number | string;
  type?: string;
  url?: string;
  name?: string;
  size?: number;
}

export interface ApiMessage {
  id: number | string;
  conversation_id?: number | string;
  content?: string | null;
  direction?: "inbound" | "outbound";
  sender_type?: "customer" | "agent" | "system" | "ai";
  sender_name?: string | null;
  status?: string | null;
  created_at?: string;
  sent_at?: string | null;
  attachments?: ApiMessageAttachment[] | null;
}

export interface ConversationListParams {
  per_page?: number;
  page?: number;
  status?: string;
  search?: string;
  /** Optional WhatsApp number filter if backend supports it. */
  wa_number_id?: number;
}

export interface ApiConversationListResponse {
  conversations: ApiConversation[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

type ApiConversationListEnvelope = {
  data?: ApiConversation[];
  pagination?: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
};

// --- Conversations ---

export async function listConversations(
  params?: ConversationListParams
): Promise<ApiConversationListResponse> {
  const key = conversationsListKey(params);
  return dedupeByKey(key, async () => {
    const q = new URLSearchParams();
    if (params?.per_page != null) q.set("per_page", String(params.per_page));
    if (params?.page != null) q.set("page", String(params.page));
    if (params?.status) q.set("status", params.status);
    if (params?.search) q.set("search", params.search);
    if (params?.wa_number_id != null)
      q.set("wa_number_id", String(params.wa_number_id));

    const res = await axiosInstance.get(`${BASE}/conversations?${q}`);
    const raw = getData<ApiConversationListEnvelope>(res);
    const list = raw?.data ?? [];
    const pag = raw?.pagination ?? {};

    return {
      conversations: Array.isArray(list) ? list : [],
      pagination: {
        current_page: pag.current_page ?? 1,
        per_page: pag.per_page ?? (params?.per_page ?? 20),
        total: pag.total ?? 0,
        last_page: pag.last_page ?? 1,
      },
    };
  });
}

export async function getConversationApi(
  id: string
): Promise<ApiConversation> {
  return dedupeByKey(`conversation:${id}`, async () => {
    const res = await axiosInstance.get(`${BASE}/conversations/${id}`);
    const raw = getData<ApiConversation | { data?: ApiConversation }>(res);
    const conv = (raw as { data?: ApiConversation } | ApiConversation).data ?? raw;
    return conv as ApiConversation;
  });
}

// --- Messages ---

export async function listMessages(
  conversationId: string
): Promise<ApiMessage[]> {
  return dedupeByKey(`messages:${conversationId}`, async () => {
    const res = await axiosInstance.get(
      `${BASE}/conversations/${conversationId}/messages`
    );
    const raw = getData<
      | ApiMessage[]
      | { data?: ApiMessage[] }
      | { data?: { messages?: ApiMessage[] } }
    >(res);

    if (Array.isArray(raw)) return raw;
    const inner = (raw as { data?: unknown })?.data;
    if (Array.isArray(inner)) return inner;
    const messages = (inner as { messages?: ApiMessage[] })?.messages;
    if (Array.isArray(messages)) return messages;
    return [];
  });
}

export interface SendMessageBody {
  content: string;
  wa_number_id?: number;
  // Attachments intentionally omitted here; can be extended later.
}

export async function postMessage(
  conversationId: string,
  body: SendMessageBody
): Promise<ApiMessage> {
  const idempotencyKey =
    (globalThis as any).crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random()}`;

  const res = await axiosInstance.post(
    `${BASE}/conversations/${conversationId}/messages`,
    body,
    {
      headers: { "Idempotency-Key": idempotencyKey },
    }
  );
  return getData<ApiMessage>(res);
}

// --- Helpers for read/star/status ---

export async function markConversationReadApi(
  conversationId: string
): Promise<void> {
  const res = await axiosInstance.post(
    `${BASE}/conversations/${conversationId}/read`,
    {}
  );
  getData<unknown>(res);
}

export async function toggleConversationStarApi(
  conversationId: string
): Promise<void> {
  const res = await axiosInstance.post(
    `${BASE}/conversations/${conversationId}/star`,
    {}
  );
  getData<unknown>(res);
}

export async function updateConversationStatusApi(
  conversationId: string,
  status: string
): Promise<void> {
  const res = await axiosInstance.patch(
    `${BASE}/conversations/${conversationId}`,
    { status }
  );
  getData<unknown>(res);
}


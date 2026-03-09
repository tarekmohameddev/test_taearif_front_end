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

// --- Backend types (approximate; keep flexible for mapping layer) ---

export interface ApiAutomationRule {
  id: number | string;
  name?: string | null;
  description?: string | null;
  trigger?: string | null;
  delay_minutes?: number | null;
  template_id?: number | string | null;
  is_active?: boolean | null;
  wa_number_id?: number | null;
  whatsapp_number_id?: number | null;
  created_at?: string | null;
  last_triggered_at?: string | null;
  triggered_count?: number | null;
  // Template or extra fields are allowed but ignored by mapping layer.
  [key: string]: unknown;
}

export interface AutomationRuleListParams {
  is_active?: boolean;
  trigger?: string;
  wa_number_id?: number;
}

interface ApiAutomationRuleListEnvelope {
  data?: ApiAutomationRule[];
  pagination?: {
    current_page?: number;
    per_page?: number;
    total?: number;
    last_page?: number;
  };
}

export interface ApiAutomationStats {
  total_rules?: number | null;
  active_rules?: number | null;
  messages_sent_24h?: number | null;
  success_rate?: number | null;
  [key: string]: unknown;
}

// --- Automation rules endpoints ---

export async function listAutomationRules(
  params?: AutomationRuleListParams
): Promise<ApiAutomationRule[]> {
  const q = new URLSearchParams();
  if (params?.is_active != null) {
    q.set("is_active", params.is_active ? "1" : "0");
  }
  if (params?.trigger) {
    q.set("trigger", params.trigger);
  }
  if (params?.wa_number_id != null) {
    q.set("wa_number_id", String(params.wa_number_id));
  }

  const queryString = q.toString();
  const url =
    queryString.length > 0
      ? `${BASE}/automation/rules?${queryString}`
      : `${BASE}/automation/rules`;

  const res = await axiosInstance.get(url);
  const raw = getData<ApiAutomationRule[] | ApiAutomationRuleListEnvelope>(res);

  if (Array.isArray(raw)) {
    return raw;
  }

  return (raw?.data ?? []) as ApiAutomationRule[];
}

export async function getAutomationRuleApi(
  id: string
): Promise<ApiAutomationRule> {
  const res = await axiosInstance.get(`${BASE}/automation/rules/${id}`);
  return getData<ApiAutomationRule>(res);
}

export async function createAutomationRuleApi(
  body: Record<string, unknown>
): Promise<ApiAutomationRule> {
  const res = await axiosInstance.post(`${BASE}/automation/rules`, body);
  return getData<ApiAutomationRule>(res);
}

export async function updateAutomationRuleApi(
  id: string,
  body: Record<string, unknown>
): Promise<ApiAutomationRule> {
  const res = await axiosInstance.put(
    `${BASE}/automation/rules/${id}`,
    body
  );
  return getData<ApiAutomationRule>(res);
}

export async function toggleAutomationRuleApi(
  id: string
): Promise<ApiAutomationRule> {
  const res = await axiosInstance.patch(
    `${BASE}/automation/rules/${id}/toggle`,
    {}
  );
  return getData<ApiAutomationRule>(res);
}

export async function deleteAutomationRuleApi(id: string): Promise<void> {
  const res = await axiosInstance.delete(
    `${BASE}/automation/rules/${id}`
  );
  getData<unknown>(res);
}

export async function getAutomationStatsApi(): Promise<ApiAutomationStats> {
  const res = await axiosInstance.get(`${BASE}/automation/stats`);
  return getData<ApiAutomationStats>(res);
}


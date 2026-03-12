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

// --- Backend types (approximate; keep flexible for mapping layer) ---

export interface ApiWhatsAppTemplate {
  id?: number | string;
  /** Backend may use template_id instead of id in list/single response. */
  template_id?: number | string;
  name?: string | null;
  content?: string | null;
  category?: string | null;
  variables?: string[] | null;
  [key: string]: unknown;
}

export async function listWhatsAppTemplates(): Promise<ApiWhatsAppTemplate[]> {
  return dedupeByKey("templates", async () => {
    const res = await axiosInstance.get(`${BASE}/templates`);
    const raw = getData<ApiWhatsAppTemplate[] | { data?: ApiWhatsAppTemplate[] }>(
      res
    );
    if (Array.isArray(raw)) {
      return raw;
    }
    return (raw as { data?: ApiWhatsAppTemplate[] })?.data ?? [];
  });
}

export async function getWhatsAppTemplateApi(
  id: string
): Promise<ApiWhatsAppTemplate> {
  return dedupeByKey(`template:${id}`, async () => {
    const res = await axiosInstance.get(`${BASE}/templates/${id}`);
    const raw = getData<
      ApiWhatsAppTemplate | { data?: ApiWhatsAppTemplate; template?: ApiWhatsAppTemplate }
    >(res);
    const withData = (raw as { data?: ApiWhatsAppTemplate })?.data;
    const withTemplate = (raw as { template?: ApiWhatsAppTemplate })?.template;
    const template = withData ?? withTemplate ?? raw;
    return template as ApiWhatsAppTemplate;
  });
}

export async function createWhatsAppTemplateApi(
  body: Record<string, unknown>
): Promise<ApiWhatsAppTemplate> {
  const res = await axiosInstance.post(`${BASE}/templates`, body);
  return getData<ApiWhatsAppTemplate>(res);
}

export async function updateWhatsAppTemplateApi(
  id: string,
  body: Record<string, unknown>
): Promise<ApiWhatsAppTemplate> {
  const safeId = id != null && String(id).trim() !== "" ? String(id) : null;
  if (safeId == null || safeId === "undefined") {
    throw new Error("Template id is required for update");
  }
  const res = await axiosInstance.put(`${BASE}/templates/${safeId}`, body);
  return getData<ApiWhatsAppTemplate>(res);
}

export async function deleteWhatsAppTemplateApi(id: string): Promise<void> {
  const res = await axiosInstance.delete(`${BASE}/templates/${id}`);
  getData<unknown>(res);
}

